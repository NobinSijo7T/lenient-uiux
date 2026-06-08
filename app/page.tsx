import MacBookPro141 from "./mac-book-pro141";
import { ContainerScrollDemo } from "../components/container-scroll-demo";
import FaultyTerminal from "../components/FaultyTerminal";
import LoadingScreen from "../components/loading-screen";
import SectionTransition from "../components/section-transition";
import JourneySection from "../components/journey-section";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import Footer from "../components/footer";

const typewriterWords = [
  { text: "Build.", className: "text-white" },
  { text: "Design.", className: "text-white" },
  { text: "Get hired..", className: "text-blue-500" },
];

export default function Page() {
  return (
    <>
      <LoadingScreen />
      <MacBookPro141 />

      {/* ── Transition: Hero → Container Scroll ── */}
      <SectionTransition variant="b" />

      <ContainerScrollDemo />

      {/* ── Transition: Container Scroll → FaultyTerminal+Journey ── */}
      <SectionTransition variant="a" />

      {/* ── FaultyTerminal as background + Journey content overlaid ── */}
      <div style={{ position: "relative", width: "100%", minHeight: "100vh", background: "#000" }}>

        {/* Layer 0 — FaultyTerminal WebGL shader, fills the whole container */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
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
            brightness={0.85}
            pageLoadAnimation={true}
          />
        </div>

        {/* Layer 1 — dark radial overlay so Journey text stays readable */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.88) 100%)",
        }} />

        {/* Layer 2 — Journey content (transparent mode — no canvas / no bg) */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <JourneySection transparent />
        </div>

        {/* Top fade: blends with section-transition above */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "160px",
          background: "linear-gradient(to bottom, #000, transparent)",
          pointerEvents: "none", zIndex: 5,
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
          background: "linear-gradient(to top, #000, transparent)",
          pointerEvents: "none", zIndex: 5,
        }} />
      </div>

      <section
        style={{
          minHeight: "58vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "110px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: "0",
              color: "#fff",
              fontFamily: "var(--font-sans), Arial, sans-serif",
              fontSize: "clamp(14px, 1.6vw, 20px)",
              fontWeight: 500,
              letterSpacing: "0",
            }}
          >
            Design × Lenient Tree Community
          </p>
          <TypewriterEffectSmooth
            words={typewriterWords}
            className="justify-center text-white my-6"
            cursorClassName="bg-blue-500"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                width: "200px",
                height: "52px",
                borderRadius: "14px",
                border: "1px solid #fff",
                background: "#000",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Join now
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
