import type { NextPage } from "next";
import Image from "next/image";
import styles from "./frame.module.css";

export type FrameType = {
  className?: string;
};

const Frame: NextPage<FrameType> = ({ className = "" }) => {
  return (
    <div className={[styles.frame, className].join(" ")}>
      <h1 className={styles.uiuxCareerAccelerator}>
        UI/UX Career Accelerator <br />
        // Batch 01
      </h1>
      <div className={styles.frame5Row0Parent}>
        <div className={styles.frame5Row0}>
          <h2 className={styles.lenientTree}>Lenient Tree</h2>
          <div className={styles.vector}>
            <Image
              className={styles.vectorIcon}
              width={21.4}
              height={24.5}
              sizes="100vw"
              alt=""
              src="/Vector.svg"
            />
          </div>
        </div>
        <div className={styles.aNewGeneration}>
          A new generation of designers doesn't follow trends they create them.
          Join a community that transforms ideas into meaningful experiences.
        </div>
      </div>
    </div>
  );
};

export default Frame;
