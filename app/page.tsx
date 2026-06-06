import MacBookPro141 from "./mac-book-pro141";
import { ContainerScrollDemo } from "../components/container-scroll-demo";
import FaultyTerminal from "../components/FaultyTerminal";
import LoadingScreen from "../components/loading-screen";
import SectionTransition from "../components/section-transition";

export default function Page() {
  return (
    <>
      <LoadingScreen />
      <MacBookPro141 />

      {/* ── Transition: Hero → Container Scroll ── */}
      <SectionTransition variant="b" />

      <ContainerScrollDemo />

      {/* ── Transition: Container Scroll → Faulty Terminal ── */}
      <SectionTransition variant="a" />

      <div
        style={{
          width: "100%",
          height: "100vh",
          background: "#000",
        }}
      >
        <FaultyTerminal
          scale={1.2}
          gridMul={[2, 1]}
          digitSize={1.5}
          scanlineIntensity={0.9}
          glitchAmount={1.2}
          flickerAmount={1}
          noiseAmp={0.5}
          chromaticAberration={1.5}
          curvature={0.15}
          tint="#ffffff"
          mouseReact={true}
          mouseStrength={0.3}
          brightness={1.1}
          pageLoadAnimation={true}
        />
      </div>
    </>
  );
}
