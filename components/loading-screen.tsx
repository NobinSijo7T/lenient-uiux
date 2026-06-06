"use client";
import { useEffect, useState } from "react";
import styles from "./loading-screen.module.css";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.logo}>
          <span className={styles.logoText}>UI/UX</span>
        </div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress}></div>
        </div>
        <p className={styles.loadingText}>Loading Experience...</p>
      </div>
    </div>
  );
}
