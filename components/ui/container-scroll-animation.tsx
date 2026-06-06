"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? "50rem" : "70rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: isMobile ? "8px" : "40px",
      }}
    >
      <div
        style={{
          paddingTop: isMobile ? "40px" : "60px",
          paddingBottom: isMobile ? "40px" : "60px",
          width: "100%",
          position: "relative",
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        maxWidth: "64rem",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
        maxWidth: "64rem",
        marginTop: "16px",
        marginLeft: "auto",
        marginRight: "auto",
        height: "40rem",
        width: "100%",
        position: "relative",
      }}
    >
      {/* iPad outer shell */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #111 100%)",
          borderRadius: "24px",
          border: "2px solid rgba(255,255,255,0.08)",
          padding: "12px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #333 40%, #1a1a1a 100%)",
            border: "1px solid #444",
            zIndex: 10,
          }}
        />
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};
