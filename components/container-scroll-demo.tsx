"use client";
import React from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import styles from "./container-scroll-demo.module.css";

export function ContainerScrollDemo() {
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
        <div className={styles.gradientOrb3}></div>
        
        {/* Animated Grid */}
        <div className={styles.animatedGrid}></div>
        
        {/* Particles */}
        <div className={styles.particles}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}></div>
          ))}
        </div>
        
        {/* Scanlines */}
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
          src="/landing.png"
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
