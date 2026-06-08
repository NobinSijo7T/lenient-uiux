"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import styles from "./container-scroll-demo.module.css";

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function makeParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: `${(seededValue(i, 1) * 100).toFixed(4)}%`,
    animationDelay: `${(seededValue(i, 2) * 8).toFixed(4)}s`,
    animationDuration: `${(8 + seededValue(i, 3) * 12).toFixed(4)}s`,
  }));
}

const desktopParticles = makeParticles(50);
const mobileParticles = makeParticles(15);


export function ContainerScrollDemo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const particles = isMobile ? mobileParticles : desktopParticles;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#000",
        marginTop: "-2px",
        position: "relative",
      }}
    >
      {/* Animated Background Effects */}
      <div className={styles.backgroundEffects}>
        {/* Gradient Orbs */}
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        {!isMobile && <div className={styles.gradientOrb3}></div>}
        
        {/* Animated Grid — hidden on mobile via CSS */}
        <div className={styles.animatedGrid}></div>
        
        {/* Particles */}
        <div className={styles.particles}>
          {particles.map((particle, i) => (
            <div key={i} className={styles.particle} style={particle}></div>
          ))}
        </div>
        
        {/* Scanlines — hidden on mobile via CSS */}
        <div className={styles.scanlines}></div>
      </div>

      <ContainerScroll
        titleComponent={
          <>
            <h2
              style={{
                fontFamily: "'Inter', 'Russo One', sans-serif",
                fontSize: "clamp(24px, 3.5vw, 42px)",
                color: "#fff",
                fontWeight: 700,
                marginBottom: "0px",
                marginTop: "0px",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                position: "relative",
                zIndex: 2,
              }}
            >
              Learn by Building
            </h2>
            <h2
              style={{
                fontFamily: "'Inter', 'Russo One', sans-serif",
                fontSize: "clamp(48px, 9vw, 110px)",
                color: "#fff",
                fontWeight: 900,
                lineHeight: 1.05,
                marginTop: "0px",
                marginBottom: "0px",
                letterSpacing: "-0.03em",
                position: "relative",
                zIndex: 2,
                textShadow: "0 0 40px rgba(0, 255, 255, 0.3)",
              }}
            >
              Real UI/UX Experiences
            </h2>
          </>
        }
      >
        <Image
          src="/Landing.png"
          alt="landing page preview"
          height={720}
          width={1400}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left top",
          }}
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
