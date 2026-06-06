"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./loading-screen.module.css";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Remove component after fade out completes
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`${styles.loadingContainer} ${fadeOut ? styles.fadeOut : ""}`}>
      <div className={styles.loadingContent}>
        <div className={styles.logoWrapper}>
          <div className={styles.logoGlow}></div>
          <Image
            src="/white.png"
            alt="Logo"
            width={200}
            height={200}
            className={styles.logo}
            priority
          />
        </div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
      </div>
    </div>
  );
}
