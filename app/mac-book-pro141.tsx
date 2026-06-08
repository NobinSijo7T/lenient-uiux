import type { NextPage } from "next";
import Image from "next/image";
import Frame from "../components/frame";
import TexturedMeshViewer from "../components/textured-mesh-viewer";
import styles from "./mac-book-pro141.module.css";

const MacBookPro141: NextPage = () => {
  return (
    <div className={styles.macbookPro141}>
      <main className={styles.frameParent}>
        <section className={styles.frame}>
          <TexturedMeshViewer className={styles.meshViewer} src="/textured_mesh.glb" />
          <Frame className={styles.frameContent} />
        </section>
        <div className={styles.designThinkCreateContainer}>
          <span>Design. Think. Create.</span>
          <span className={styles.breakConventionsBuild}>
             <br />
            Break conventions, build real experiences, and craft a portfolio
            that gets you noticed
          </span>
        </div>
        <Image
          className={styles.frameChild}
          loading="lazy"
          width={10}
          height={362}
          sizes="100vw"
          alt=""
          src="/Frame-3@2x.png"
        />
        <div className={styles.parent}>
          <div className={styles.rectangleWrapper}>
            <div className={styles.frameItem} />
          </div>
        </div>
        <Image
          className={styles.frameInner}
          loading="lazy"
          width={407}
          height={129}
          sizes="100vw"
          alt=""
          src="/Frame-2@2x.png"
        />
        <h1 className={styles.uiuxInternship}>UI/UX INTERNSHIP</h1>
      </main>
    </div>
  );
};

export default MacBookPro141;
