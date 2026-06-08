import MacBookPro141 from "./mac-book-pro141";
import { ContainerScrollDemo } from "../components/container-scroll-demo";
import LoadingScreen from "../components/loading-screen";
import SectionTransition from "../components/section-transition";
import FaultyTerminalSection from "../components/faulty-terminal-section";
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
      <FaultyTerminalSection />


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
