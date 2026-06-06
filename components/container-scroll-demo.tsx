"use client";
import React from "react";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function ContainerScrollDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#000",
        marginTop: "-2px",
      }}
    >
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
              }}
            >
              Unleash the power of
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
              }}
            >
              Scroll Animations
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
