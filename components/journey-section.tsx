"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Keyframes ─────────────────────────────────────────────────────────────
const KF = `
@keyframes jt-fade-up {
  0%   { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes jt-pulse-subtle {
  0%, 100% { box-shadow: 0 0 15px rgba(255,255,255,0.1); }
  50%      { box-shadow: 0 0 30px rgba(255,255,255,0.3); }
}
@keyframes jt-badge-design {
  0%, 100% { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); }
  50%      { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.06); }
}
`;

// ─── Data ───────────────────────────────────────────────────────────────────
const STEPS = [
  { id:"01", title:"Learn Design Fundamentals",  status:"completed" },
  { id:"02", title:"Master Figma & Prototyping", status:"completed" },
  { id:"03", title:"Solve Real User Problems",   status:"active"    },
  { id:"04", title:"Build Industry Projects",    status:"pending"   },
  { id:"05", title:"Create a Job-Ready Portfolio",status:"pending"  },
  { id:"06", title:"Launch Your Design Career",  status:"locked"    },
] as const;
type Status = typeof STEPS[number]["status"];

const BADGES = ["12 WEEKS","LIVE MENTORSHIP","CERTIFICATE INCLUDED"];

// Design style colors (Monochrome/Minimalist)
const NODE_COLOR: Record<Status,string> = {
  completed:"#ffffff", active:"#ffffff",
  pending:"rgba(255,255,255,0.3)", locked:"rgba(255,255,255,0.15)",
};
const NODE_BG: Record<Status,string> = {
  completed:"rgba(255,255,255,0.1)", active:"rgba(255,255,255,0.15)",
  pending:"rgba(255,255,255,0.03)",   locked:"rgba(255,255,255,0.01)",
};

// ─── Main component ─────────────────────────────────────────────────────────
export default function JourneySection({ transparent = false }: { transparent?: boolean }) {
  const secRef    = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number|null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // inject keyframes once
  useEffect(()=>{
    if(document.getElementById("jt-kf-design")) return;
    const s=document.createElement("style"); s.id="jt-kf-design"; s.textContent=KF;
    document.head.appendChild(s);
  },[]);

  // responsive
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<768);
    check(); window.addEventListener("resize",check);
    return ()=>window.removeEventListener("resize",check);
  },[]);

  // intersection → trigger visibility
  useEffect(()=>{
    const el=secRef.current; if(!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{threshold:.1});
    obs.observe(el); return ()=>obs.disconnect();
  },[]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const fadeIn=(delay:string,extra?:React.CSSProperties):React.CSSProperties=>({
    opacity: visible?1:0,
    transform: visible?"none":"translateY(24px)",
    transition:`opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`,
    ...extra,
  });

  return (
    <section
      ref={secRef}
      style={{
        position: transparent ? "relative" : "relative",
        width:"100%", minHeight:"100vh",
        background: transparent ? "transparent" : "#000",
        overflow:"hidden",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"140px 0", boxSizing:"border-box",
        zIndex: transparent ? 2 : undefined,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Content ── */}
      <div style={{
        position:"relative", zIndex:2, width:"100%",
        maxWidth:"1200px", padding:"0 clamp(20px,5vw,60px)",
        boxSizing:"border-box", display:"flex",
        flexDirection:"column", alignItems:"center", gap:"72px",
      }}>

        {/* Eyebrow */}
        <div style={{
          ...fadeIn("0s"),
          fontSize:"12px", fontWeight: 600,
          letterSpacing:"0.2em", color:"rgba(255,255,255,0.6)", textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"16px",
        }}>
          <span style={{display:"inline-block",width:"32px",height:"1px",background:"rgba(255,255,255,0.3)"}}/>
          YOUR JOURNEY
          <span style={{display:"inline-block",width:"32px",height:"1px",background:"rgba(255,255,255,0.3)"}}/>
        </div>

        {/* Title block */}
        <div style={{textAlign:"center", display: "flex", flexDirection: "column", gap: "16px"}}>
          <h2 style={{
            ...fadeIn(".1s"),
            fontSize:"clamp(40px, 7vw, 96px)", lineHeight: 1.1,
            letterSpacing:"-0.03em", margin:0,
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            {/* Transparent outlined text */}
            <span style={{
              fontWeight: 800,
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.6)",
              color: "rgba(255, 255, 255, 0.15)",
              display: "block"
            }}>
              FROM BEGINNER TO
            </span>
            {/* Solid bold text */}
            <span style={{
              fontWeight: 800,
              color: "#fff",
              display: "block",
              textShadow: "0 4px 32px rgba(255,255,255,0.3)"
            }}>
              PRODUCT DESIGNER
            </span>
          </h2>

          <p style={{
            ...fadeIn(".3s"),
            fontSize:"17px",
            color:"rgba(255,255,255,0.85)", lineHeight: 1.6,
            maxWidth:"600px", margin:"0 auto",
            fontWeight: 400,
          }}>
            Transform your creativity into industry-ready skills through
            structured learning, live mentorship, and real-world design challenges.
          </p>
        </div>

        {/* ── Timeline ── */}
        {isMobile ? (
          /* Mobile: stacked cards */
          <div style={{...fadeIn(".5s"),width:"100%",display:"flex",flexDirection:"column",gap:"16px"}}>
            {STEPS.map((step,i)=>{
              const color=NODE_COLOR[step.status];
              const isActive=step.status==="active";
              const isLocked=step.status==="locked";
              return (
                <div key={step.id} style={{
                  display:"flex", alignItems:"center", gap:"20px",
                  padding:"20px 24px", borderRadius:"16px",
                  border:`1px solid ${NODE_COLOR[step.status]}20`,
                  background: NODE_BG[step.status],
                  backdropFilter:"blur(12px)",
                  cursor: isLocked?"not-allowed":"pointer",
                  transition:"all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isActive ? "scale(1.02)" : "scale(1)",
                  boxShadow: isActive?"0 8px 32px rgba(255,255,255,0.1)":"none",
                }}>
                  <div style={{
                    width:"12px",height:"12px",borderRadius:"50%",flexShrink:0,
                    background: color,
                    boxShadow: isActive?"0 0 12px rgba(255,255,255,0.8)":"none",
                  }}/>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{
                      fontSize:"12px",color:"rgba(255,255,255,0.85)",
                      fontWeight: 700, letterSpacing: "0.08em",
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)"
                    }}>
                      STEP {step.id}
                    </div>
                    <div style={{
                      fontSize:"16px",
                      color:isLocked?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.95)",
                      fontWeight: 600,
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)"
                    }}>
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop: horizontal timeline */
          <div style={{...fadeIn(".5s"),width:"100%",position:"relative", padding: "20px 0"}}>
            {/* Base line */}
            <div style={{
              position:"absolute",
              top:"52px",
              left:`calc(100% / ${STEPS.length} / 2)`,
              right:`calc(100% / ${STEPS.length} / 2)`,
              height:"2px", background:"rgba(255,255,255,0.1)", zIndex:0,
              borderRadius: "2px"
            }}>
              {/* Progress fill */}
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 36%, rgba(255,255,255,0.5) 40%, transparent 45%)",
                transformOrigin:"left",
                transform: visible?"scaleX(1)":"scaleX(0)",
                transition:"transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
                borderRadius: "2px"
              }}/>
            </div>

            {/* Nodes */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:1}}>
              {STEPS.map((step,i)=>{
                const color=NODE_COLOR[step.status];
                const isHov=hovered===i;
                const isActive=step.status==="active";
                const isLocked=step.status==="locked";

                return (
                  <div key={step.id}
                    style={{
                      display:"flex",flexDirection:"column",alignItems:"center",gap:"16px",
                      width:`calc(100% / ${STEPS.length})`,
                      cursor:isLocked?"not-allowed":"pointer",
                      opacity: visible?1:0,
                      transform: visible?"none":"translateY(20px)",
                      transition:`opacity 0.8s ease ${0.6+i*0.1}s, transform 0.8s ease ${0.6+i*0.1}s`,
                    }}
                    onMouseEnter={()=>!isLocked&&setHovered(i)}
                    onMouseLeave={()=>setHovered(null)}
                  >
                    {/* Clean circle indicator */}
                    <div style={{
                      position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "64px", height: "64px",
                    }}>
                      <div style={{
                        width: isActive ? "16px" : "12px",
                        height: isActive ? "16px" : "12px",
                        borderRadius: "50%",
                        background: color,
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        transform: isHov && !isLocked ? "scale(1.5)" : "scale(1)",
                        boxShadow: isActive ? "0 0 20px rgba(255,255,255,0.8)" : "none",
                        zIndex: 2,
                      }}/>
                      
                      {/* Hover / Active glow ring */}
                      {(isActive || (isHov && !isLocked)) && (
                         <div style={{
                           position: "absolute",
                           inset: "12px",
                           borderRadius: "50%",
                           border: "1px solid rgba(255,255,255,0.2)",
                           background: "rgba(255,255,255,0.05)",
                           animation: isActive ? "jt-pulse-subtle 3s infinite" : "none",
                           transform: "scale(1)",
                         }}/>
                      )}
                    </div>

                    {/* Step Content */}
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                      transition: "transform 0.3s ease",
                      transform: isHov && !isLocked ? "translateY(-4px)" : "none"
                    }}>
                      <span style={{
                        fontSize:"12px",color: isLocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)",
                        fontWeight: 700, letterSpacing:"0.08em",
                        textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.8)"
                      }}>
                        STEP {step.id}
                      </span>

                      <div style={{
                        textAlign:"center",
                        fontSize:"15px", lineHeight:1.4,
                        fontWeight: isActive || isHov ? 700 : 600,
                        padding:"0 12px",
                        color: isLocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.95)",
                        transition:"color 0.3s ease",
                        textShadow: isActive ? "0 0 20px rgba(255,255,255,0.5), 0 2px 10px rgba(0,0,0,0.8)" : "0 2px 10px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)"
                      }}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Badges ── */}
        <div style={{
          ...fadeIn("0.8s"),
          display:"flex", gap:"16px", flexWrap:"wrap", justifyContent:"center",
          marginTop: "24px"
        }}>
          {BADGES.map((b,i)=>(
            <div key={i} style={{
              fontSize:"12px", fontWeight: 500,
              letterSpacing:"0.05em", color:"rgba(255,255,255,0.8)",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:"100px",
              padding:"10px 24px", background:"rgba(255,255,255,0.02)",
              backdropFilter:"blur(12px)",
              animation:`jt-badge-design ${3+i*0.5}s ease-in-out ${i*0.2}s infinite`,
            }}>
              {b}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
