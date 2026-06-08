"use client";

import React, { useEffect, useRef } from "react";
import {
  Camera,
  GLTFLoader,
  Mesh,
  Orbit,
  Program,
  Renderer,
  Texture,
  Transform,
  Vec3,
} from "ogl";
import type { OGLRenderingContext } from "ogl";

type TexturedMeshViewerProps = {
  className?: string;
  src: string;
};

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat3 normalMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tMap;
uniform vec4 uBaseColor;
uniform vec3 uAmbient;
uniform vec3 uLightDirection;
uniform float uHasMap;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec4 textureColor = mix(vec4(1.0), texture2D(tMap, vUv), uHasMap);
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightDirection);
  float diffuse = max(dot(normal, lightDirection), 0.0);

  vec3 viewDirection = normalize(vViewPosition);
  float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.0) * 0.24;
  vec3 litColor = textureColor.rgb * uBaseColor.rgb * (uAmbient + diffuse * 0.78 + rim);

  float alpha = textureColor.a * uBaseColor.a;
  if (alpha < 0.04) discard;

  gl_FragColor = vec4(litColor, alpha);
}
`;

type MeshWithMaterial = Mesh & {
  program: Program & {
    gltfMaterial?: {
      baseColorFactor?: [number, number, number, number];
      baseColorTexture?: { texture?: Texture };
      alphaMode?: string;
      doubleSided?: boolean;
    };
  };
};

function isRenderableMesh(node: Transform): node is MeshWithMaterial {
  return "geometry" in node && "program" in node;
}

function applyTexturePrograms(gl: OGLRenderingContext, root: Transform) {
  const fallbackTexture = new Texture(gl, {
    image: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    generateMipmaps: false,
  });

  root.traverse((node) => {
    if (!isRenderableMesh(node)) return;

    const material = node.program.gltfMaterial;
    const baseColorFactor = material?.baseColorFactor ?? [1, 1, 1, 1];
    const baseColorTexture = material?.baseColorTexture?.texture;
    const isTransparent = material?.alphaMode === "BLEND" || baseColorFactor[3] < 1;

    node.program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: isTransparent,
      cullFace: material?.doubleSided ? false : gl.BACK,
      uniforms: {
        tMap: { value: baseColorTexture ?? fallbackTexture },
        uBaseColor: { value: baseColorFactor },
        uAmbient: { value: new Vec3(0.44, 0.47, 0.52) },
        uLightDirection: { value: new Vec3(0.5, 0.85, 0.35).normalize() },
        uHasMap: { value: baseColorTexture ? 1 : 0 },
      },
    });
  });
}

function fitModelToView(root: Transform) {
  const min = new Vec3(Infinity, Infinity, Infinity);
  const max = new Vec3(-Infinity, -Infinity, -Infinity);
  let hasBounds = false;

  root.updateMatrixWorld(true);
  root.traverse((node) => {
    if (!isRenderableMesh(node)) return;

    node.geometry.computeBoundingBox();
    const bounds = node.geometry.bounds;
    if (!bounds) return;

    const corners = [
      new Vec3(bounds.min.x, bounds.min.y, bounds.min.z),
      new Vec3(bounds.min.x, bounds.min.y, bounds.max.z),
      new Vec3(bounds.min.x, bounds.max.y, bounds.min.z),
      new Vec3(bounds.min.x, bounds.max.y, bounds.max.z),
      new Vec3(bounds.max.x, bounds.min.y, bounds.min.z),
      new Vec3(bounds.max.x, bounds.min.y, bounds.max.z),
      new Vec3(bounds.max.x, bounds.max.y, bounds.min.z),
      new Vec3(bounds.max.x, bounds.max.y, bounds.max.z),
    ];

    corners.forEach((corner) => {
      corner.applyMatrix4(node.worldMatrix);
      min.x = Math.min(min.x, corner.x);
      min.y = Math.min(min.y, corner.y);
      min.z = Math.min(min.z, corner.z);
      max.x = Math.max(max.x, corner.x);
      max.y = Math.max(max.y, corner.y);
      max.z = Math.max(max.z, corner.z);
      hasBounds = true;
    });
  });

  if (!hasBounds) return;

  const center = new Vec3().add(min, max).scale(0.5);
  const size = new Vec3().sub(max, min);
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;
  const scale = 2.15 / maxAxis;

  root.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  root.scale.set(scale, scale, scale);
}

export default function TexturedMeshViewer({ className = "", src }: TexturedMeshViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile on mount
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // Skip entire WebGL pipeline on mobile — the 4.8MB GLB + OGL renderer
    // is the single biggest performance bottleneck on mobile devices.
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let isVisible = true;
    let controls: Orbit | null = null;

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 1.5),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 32, near: 0.1, far: 100 });
    camera.position.set(0, 0, 6);

    const scene = new Transform();
    const modelRoot = new Transform();
    modelRoot.setParent(scene);

    controls = new Orbit(camera, {
      element: container,
      target: new Vec3(0, 0, 0),
      enablePan: false,
      enableZoom: false,
      enableRotate: true,
      rotateSpeed: 0.45,
      minPolarAngle: Math.PI / 2,
      maxPolarAngle: Math.PI / 2,
      minDistance: 2.6,
      maxDistance: 10,
    });

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.appendChild(gl.canvas);
    resize();

    // Pause rendering when off-screen to save GPU cycles
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    GLTFLoader.load(gl, src)
      .then((gltf) => {
        if (disposed) return;

        gltf.scene.forEach((node) => node.setParent(modelRoot));
        applyTexturePrograms(gl, modelRoot);
        fitModelToView(modelRoot);
      })
      .catch((error) => {
        console.error("Unable to load textured mesh model", error);
      });

    const update = () => {
      frameId = requestAnimationFrame(update);
      if (!isVisible) return; // skip rendering when off-screen
      controls?.update();
      renderer.render({ scene, camera, clear: true });
    };
    frameId = requestAnimationFrame(update);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      controls?.remove();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, isMobile]);

  return <div ref={containerRef} className={className} aria-label="Interactive textured 3D model" />;
}
