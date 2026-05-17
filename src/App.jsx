import {
  motion, useScroll, useTransform, useSpring,
  useMotionValue, useVelocity, AnimatePresence,
  useAnimationFrame
} from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  ivory:   "#F9EAD2",
  champ:   "#F8EEC2",
  peach:   "#DB918F",
  bistre:  "#837534",
  codium:  "#4F5127",
  cafe:    "#4C3D19",
  kombu:   "#354024",
  moss:    "#889063",
  tan:     "#CFBB99",
  bone:    "#E5D7C4",
}

const F = {
  playfair: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  manrope: "'Manrope', sans-serif",
  mono: "'Space Mono', monospace",
}

const PROJECTS = [
  {
    id: "pomodoro", no: "001",
    title: "Pomodoro Timer",
    tag: "Focus & Flow",
    desc: "A distraction-free productivity tool built in pure JavaScript. Clean session tracking, minimal interface, quiet intention. Built for flow states.",
    stack: ["HTML", "CSS", "JavaScript"],
    accent: "#354024", lite: "#a3b87a",
    image: "/pomodoro.jpeg",
    github: "https://github.com/MudithaParamitha/pomodoro-timer",
    demo: "https://mudithaparamitha.github.io/pomodoro-timer",
  },
  {
    id: "dispatch", no: "002",
    title: "Dispatch Validation",
    tag: "Internal Dashboard",
    desc: "A web-based document management dashboard with authentication, real-time status, and data tables — designed for clarity and operational flow.",
    stack: ["HTML", "Bootstrap", "JavaScript"],
    accent: "#837534", lite: "#b09a5a",
    image: "/login.jpeg",
    github: "https://github.com/MudithaParamitha/dispatch-system",
    demo: "https://mudithaparamitha.github.io/dispatch-system/",
  },
  {
    id: "portfolio", no: "003",
    title: "Winxloop",
    tag: "Handmade Brand",
    desc: "An online shop for handmade accessories and charms, designed with a soft editorial aesthetic focused on branding, product storytelling, and user experience.",
    stack: ["React", "Tailwind", "Framer Motion"],
    accent: "#4F5127", lite: "#7a8050",
    image: "/winxloop.jpg",
    github: "https://github.com/MudithaParamitha/winxloop-web",
    demo: "https://winxloop-web.vercel.app/",
  },
]

const SKILLS = [
  "HTML & CSS","JavaScript","React","Tailwind CSS","Bootstrap",
  "Figma","UI Design","Responsive Design","Git","Framer Motion",
  "Visual Design","Frontend Dev",
]

// ─── Hooks ──────────────────────────────────────────────────────────────────
function useMouseParallax() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  useEffect(() => {
    const fn = e => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2)
      my.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener("mousemove", fn)
    return () => window.removeEventListener("mousemove", fn)
  }, [])
  return { mx, my }
}

function useScrollSkew() {
  const { scrollY } = useScroll()
  const v = useVelocity(scrollY)
  const skew = useTransform(v, [-600, 0, 600], ["-3deg", "0deg", "3deg"])
  return useSpring(skew, { stiffness: 300, damping: 30 })
}

// ─── Grain ──────────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
      opacity: 0.032,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "128px",
      mixBlendMode: "multiply",
    }}/>
  )
}

// ─── Cursor ─────────────────────────────────────────────────────────────────
function Cursor() {
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const sx = useSpring(cx, { stiffness: 400, damping: 32 })
  const sy = useSpring(cy, { stiffness: 400, damping: 32 })
  const rx = useSpring(cx, { stiffness: 100, damping: 22 })
  const ry = useSpring(cy, { stiffness: 100, damping: 22 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    const m = e => { cx.set(e.clientX); cy.set(e.clientY) }
    const over = e => setBig(!!e.target.closest("a,button"))
    window.addEventListener("mousemove", m)
    document.addEventListener("mouseover", over)
    return () => {
      window.removeEventListener("mousemove", m)
      document.removeEventListener("mouseover", over)
    }
  }, [])

  return (
    <>
      <motion.div style={{
        position: "fixed", zIndex: 10001, pointerEvents: "none",
        width: 7, height: 7, borderRadius: "50%",
        background: C.peach, translateX: "-50%", translateY: "-50%",
        left: sx, top: sy, mixBlendMode: "multiply",
      }}/>
      <motion.div
        animate={{ width: big ? 40 : 26, height: big ? 40 : 26 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed", zIndex: 10000, pointerEvents: "none",
          borderRadius: "50%", border: `1.5px solid ${C.bistre}`,
          translateX: "-50%", translateY: "-50%",
          left: rx, top: ry,
        }}
      />
    </>
  )
}

// ─── Magnetic ────────────────────────────────────────────────────────────────
function Magnetic({ children, strength = 0.3, style = {} }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMove = useCallback(e => {
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }, [strength])

  const handleLeave = useCallback(() => {
    x.set(0); y.set(0)
  }, [])

  return (
    <motion.div ref={ref}
      style={{ display: "inline-block", x: sx, y: sy, ...style }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </motion.div>
  )
}

// ─── SplitReveal ────────────────────────────────────────────────────────────
function SplitReveal({ text, delay = 0, stagger = 0.06, style = {} }) {
  return (
    <span style={{ display: "inline", ...style }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
            style={{ display: "inline-block" }}
          >{w}&nbsp;</motion.span>
        </span>
      ))}
    </span>
  )
}

// ─── Star ───────────────────────────────────────────────────────────────────
function Star({ size = 22, color = C.peach, duration = 20, opacity = 0.35, style = {} }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      aria-hidden
      style={{ opacity, ...style }}>
      <path d="M12 2 L14.09 8.26 L20.35 8.27 L15.55 12.14 L17.18 18.5 L12 15 L6.82 18.5 L8.45 12.14 L3.65 8.27 L9.91 8.26 Z"
        fill={color}/>
    </motion.svg>
  )
}

// ─── Spoke ornament ─────────────────────────────────────────────────────────
function Spoke({ size = 80, spokes = 12, color = C.bistre, opacity = 0.18, duration = 25, style = {} }) {
  const lines = Array.from({ length: spokes })
  return (
    <motion.svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      aria-hidden style={{ opacity, ...style }}>
      {lines.map((_, i) => {
        const a = (i / spokes) * Math.PI * 2
        const r = size / 2
        return (
          <line key={i}
            x1={r} y1={r}
            x2={r + Math.cos(a) * (r - 4)}
            y2={r + Math.sin(a) * (r - 4)}
            stroke={color} strokeWidth="0.7"/>
        )
      })}
    </motion.svg>
  )
}

// ─── DashedCircle ────────────────────────────────────────────────────────────
function DashedCircle({ size = 60, color = C.bistre, opacity = 0.25, duration = 18, reverse = false, style = {} }) {
  return (
    <motion.svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      aria-hidden style={{ opacity, ...style }}>
      <circle cx={size/2} cy={size/2} r={size/2 - 2}
        stroke={color} strokeWidth="0.8" strokeDasharray="3 3"/>
    </motion.svg>
  )
}

// ─── Tape strip ──────────────────────────────────────────────────────────────
function Tape({ w = 64, h = 16, rotate = 6, left = "50%", top = -9 }) {
  return (
    <div aria-hidden style={{
      position: "absolute", top, left,
      transform: `translateX(-50%) rotate(${rotate}deg)`,
      width: w, height: h,
      background: C.champ, opacity: 0.75,
      border: `0.5px solid ${C.tan}`,
      zIndex: 5,
    }}/>
  )
}

// ─── Cross mark ─────────────────────────────────────────────────────────────
function Cross({ x, y, size = 10, color = C.peach, opacity = 0.18 }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
      style={{
        position: "absolute", left: `${x}%`, top: `${y}%`,
        opacity, color, fontSize: size * 2,
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        fontWeight: 300,
      }}>+</motion.div>
  )
}

// ─── OrbitDot ────────────────────────────────────────────────────────────────
function OrbitDot({ cx, cy, rx, ry, duration = 4000, color = C.peach, size = 4 }) {
  const x = useMotionValue(cx)
  const y = useMotionValue(cy)
  const startRef = useRef(null)

  useAnimationFrame(t => {
    if (!startRef.current) startRef.current = t
    const elapsed = t - startRef.current
    x.set(cx + Math.cos((elapsed / duration) * Math.PI * 2) * rx)
    y.set(cy + Math.sin((elapsed / (duration * 1.3)) * Math.PI * 2) * ry)
  })

  return (
    <motion.div aria-hidden style={{
      position: "absolute",
      width: size, height: size, borderRadius: "50%",
      background: color, opacity: 0.5,
      x, y, translateX: "-50%", translateY: "-50%",
      pointerEvents: "none",
    }}/>
  )
}

// ─── Marquee ────────────────────────────────────────────────────────────────
function Marquee({ items, speed = 38, reverse = false, skewX }) {
  const all = [...items, ...items, ...items]
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        style={{
          display: "flex", whiteSpace: "nowrap",
          skewX,
        }}
        animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}>
        {all.map((item, i) => (
          <span key={i} style={{
            fontFamily: F.mono, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.bistre, opacity: 0.55,
            padding: "0 1.8rem",
            flexShrink: 0,
          }}>
            {item}
            {i % 3 === 2 && <span style={{ color: C.peach, marginLeft: "0.5rem" }}>✦</span>}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── MarqueeStrip ────────────────────────────────────────────────────────────
function MarqueeStrip({ items, speed, reverse, bg, borderColor }) {
  const skewX = useScrollSkew()
  return (
    <div style={{
      background: bg || `${C.bone}30`,
      borderTop: `1px solid ${borderColor || C.tan}44`,
      borderBottom: `1px solid ${borderColor || C.tan}44`,
      padding: "10px 0",
      position: "relative", zIndex: 10,
      overflow: "hidden",
    }}>
      <Marquee items={items} speed={speed} reverse={reverse} skewX={skewX}/>
    </div>
  )
}

// ─── ProjectCard ─────────────────────────────────────────────────────────────
function ProjectCard({ p, index }) {
  const [hov, setHov] = useState(false)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const cardOp = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.3])
  const isEven = index % 2 === 0

  const tapeRotate = index % 2 === 0 ? 5 : -4

  return (
    <motion.div ref={ref}
      style={{ opacity: cardOp, position: "relative" }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Tape */}
      <div aria-hidden style={{
        position: "absolute", top: -1, left: "50%",
        transform: `translateX(-50%) rotate(${tapeRotate}deg)`,
        width: 64, height: 16,
        background: C.champ, opacity: 0.7,
        border: `0.5px solid ${C.tan}55`,
        zIndex: 6,
      }}/>

      <motion.div
        animate={{
          boxShadow: hov ? `0 22px 60px ${C.bistre}28` : `0 4px 18px ${C.bistre}10`,
        }}
        style={{
          border: `1px solid ${C.tan}66`,
          overflow: "hidden",
          position: "relative",
          display: "grid",
          gridTemplateColumns: isEven ? "1.15fr 1fr" : "1fr 1.15fr",
          minHeight: "clamp(340px, 48vh, 560px)",
          background: C.bone,
          transition: "box-shadow 0.4s",
        }}
        className="proj-grid"
      >
        {/* Ghost number */}
        <div aria-hidden style={{
          position: "absolute",
          top: 0, right: 0,
          fontFamily: F.playfair,
          fontSize: "clamp(5rem, 14vw, 11rem)",
          fontWeight: 600,
          color: p.accent,
          opacity: 0.055,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}>{p.no}</div>

        {/* Image area — order depends on index */}
        <div style={{
          order: isEven ? 0 : 1,
          overflow: "hidden",
          position: "relative",
          background: `${p.accent}18`,
        }}>
          {p.image ? (
            <motion.img src={p.image} alt={p.title}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                y: imgY,
                filter: hov ? "saturate(1) contrast(1.02)" : "saturate(0.72) sepia(0.07)",
                scale: hov ? 1.04 : 1,
                transition: "filter 0.5s, scale 0.5s",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", minHeight: 280,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Spoke size={90} color={p.accent} opacity={0.3} duration={22}/>
            </div>
          )}
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `${C.cafe}22`,
            opacity: hov ? 0 : 0.14,
            transition: "opacity 0.5s",
            pointerEvents: "none",
          }}/>
        </div>

        {/* Text area */}
        <motion.div
          animate={{ background: hov ? `${p.accent}06` : "transparent" }}
          transition={{ duration: 0.6 }}
          style={{
            order: isEven ? 1 : 0,
            padding: "clamp(1.8rem, 4vw, 3.5rem)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            position: "relative", zIndex: 1,
            borderLeft: isEven ? `1px solid ${C.tan}44` : "none",
            borderRight: isEven ? "none" : `1px solid ${C.tan}44`,
          }}>

          {/* Tag line */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <motion.div
              animate={{ width: hov ? 36 : 20 }}
              transition={{ duration: 0.3 }}
              style={{ height: 0.5, background: p.accent, transition: "width 0.3s" }}
            />
            <span style={{
              fontFamily: F.mono, fontSize: 8,
              fontWeight: 700, letterSpacing: "0.2em",
              textTransform: "uppercase", color: p.accent,
            }}>{p.tag}</span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: F.cormorant, fontWeight: 600,
            fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)",
            color: C.cafe, lineHeight: 1.1,
            marginBottom: 14, letterSpacing: "-0.01em",
          }}>
            <SplitReveal text={p.title} delay={0.1} stagger={0.04}/>
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: F.manrope, fontSize: 13,
            lineHeight: 1.95, color: C.bistre,
            opacity: 0.82, marginBottom: 22,
            maxWidth: 340,
          }}>{p.desc}</p>

          {/* Stack tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            {p.stack.map(t => (
              <span key={t} style={{
                fontFamily: F.mono, fontSize: 8,
                fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "4px 10px",
                border: `1px solid ${p.accent}55`,
                color: p.accent,
                background: `${p.accent}10`,
                borderRadius: 0,
              }}>{t}</span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 10 }}>
            {p.github && (
              <Magnetic>
                <a href={p.github} target="_blank" rel="noreferrer"
                  style={{
                    fontFamily: F.mono, fontSize: 9,
                    fontWeight: 700, letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.cafe,
                    border: `1px solid ${C.tan}`,
                    padding: "7px 16px", display: "inline-block",
                    borderRadius: 0, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.cafe; e.currentTarget.style.color = C.ivory }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.cafe }}
                >CODE ↗</a>
              </Magnetic>
            )}
            {p.demo && (
              <Magnetic>
                <a href={p.demo} target="_blank" rel="noreferrer"
                  style={{
                    fontFamily: F.mono, fontSize: 9,
                    fontWeight: 700, letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: C.ivory,
                    border: `1px solid ${p.accent}`,
                    background: p.accent,
                    padding: "7px 16px", display: "inline-block",
                    borderRadius: 0, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.8" }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1" }}
                >LIVE ↗</a>
              </Magnetic>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [navSolid, setNavSolid] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 30 })

  const { mx, my } = useMouseParallax()
  const p1x = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 55, damping: 18 })
  const p1y = useSpring(useTransform(my, [-1, 1], [-10, 10]), { stiffness: 55, damping: 18 })
  const p2x = useSpring(useTransform(mx, [-1, 1], [-8, 8]),   { stiffness: 55, damping: 18 })
  const p2y = useSpring(useTransform(my, [-1, 1], [-5, 5]),   { stiffness: 55, damping: 18 })
  const p3x = useSpring(useTransform(mx, [-1, 1], [-4, 4]),   { stiffness: 55, damping: 18 })
  const p3y = useSpring(useTransform(my, [-1, 1], [-2, 2]),   { stiffness: 55, damping: 18 })

  const heroRef = useRef(null)
  const { scrollYProgress: hSP } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY  = useTransform(hSP, [0, 1], [0, 140])
  const heroOp = useTransform(hSP, [0, 0.85], [1, 0])

  useEffect(() => {
    const unsub = scrollYProgress.on("change", v => setNavSolid(v > 0.03))
    return unsub
  }, [])

  const handleSubmit = async e => {
    e.preventDefault(); setSending(true)
    const r = await fetch("https://formspree.io/f/xqegvqvz", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    setSending(false)
    if (r.ok) setSent(true)
  }

  return (
    <div style={{
      background: C.ivory,
      color: C.cafe,
      minHeight: "100vh",
      fontFamily: F.manrope,
      overflowX: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; cursor: none; overflow-x: hidden; }
        * { cursor: none !important; }
        a, button { color: inherit; text-decoration: none; }
        input, textarea, button { font-family: inherit; }

        ::selection { background: ${C.peach}; color: ${C.ivory}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bone}; }
        ::-webkit-scrollbar-thumb { background: ${C.bistre}55; border-radius: 2px; }

        .nav-link {
          font-family: ${F.mono}; font-size: 9px; font-weight: 700;
          letter-spacing: .24em; text-transform: uppercase;
          color: ${C.cafe}; opacity: 0.5; transition: opacity 0.2s, color 0.2s;
        }
        .nav-link:hover { opacity: 1; color: ${C.peach}; }

        @keyframes pulse3 {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0.2; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @media (max-width: 768px) {
          .proj-grid { display: flex !important; flex-direction: column !important; }
          .proj-grid > div { order: unset !important; }
          .about-cols { flex-direction: column !important; }
          .contact-cols { flex-direction: column !important; }
          .hide-mob { display: none !important; }
          .nav-links { display: none !important; }
          .menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .menu-btn { display: none !important; }
        }
      `}</style>

      <Cursor />
      <Grain />

      {/* Progress bar */}
      <motion.div style={{
        scaleX, transformOrigin: "0%",
        position: "fixed", top: 0, left: 0, right: 0, height: 1.5,
        background: `linear-gradient(90deg, ${C.peach}, ${C.moss}, ${C.bistre})`,
        zIndex: 500,
      }}/>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <motion.nav
        animate={{
          background: navSolid ? `${C.ivory}ee` : "transparent",
          borderBottomColor: navSolid ? `${C.tan}44` : "transparent",
        }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(1.25rem,5vw,3.5rem)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid transparent",
        }}
      >
        <a href="#" style={{
          fontFamily: F.playfair, fontWeight: 700,
          fontSize: 19, letterSpacing: "-0.02em", color: C.cafe,
        }}>
          M<span style={{ color: C.peach, fontStyle: "italic" }}>.</span>
        </a>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[["#work","Work"],["#about","About"],["#contact","Contact"]].map(([h, l]) => (
            <a key={h} href={h} className="nav-link">{l}</a>
          ))}
        </div>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", color: C.cafe, padding: 4 }} aria-label="menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="17" x2="21" y2="17"/></>}
          </svg>
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 56, left: 0, right: 0, zIndex: 290,
              background: `${C.ivory}f5`, backdropFilter: "blur(20px)",
              borderBottom: `1px solid ${C.tan}`,
              padding: "2rem clamp(1.25rem,5vw,3.5rem)",
              display: "flex", flexDirection: "column", gap: 28,
            }}>
            {[["#work","Work"],["#about","About"],["#contact","Contact"]].map(([h, l]) => (
              <a key={h} href={h} onClick={() => setMenuOpen(false)} style={{
                fontFamily: F.mono, fontSize: 13, fontWeight: 700,
                letterSpacing: ".2em", textTransform: "uppercase", color: C.cafe,
              }}>{l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section ref={heroRef} style={{
        paddingTop: 56, minHeight: "100vh",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        background: C.ivory,
      }}>

        {/* Ruled lines background */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", left: 0, right: 0,
              top: `${(i + 1) * 5.5}%`,
              height: "0.5px", background: C.tan, opacity: 0.12,
            }}/>
          ))}
          {/* Margin red line */}
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: "clamp(40px, 5vw, 70px)",
            width: 1.5, background: C.peach, opacity: 0.2,
          }}/>

          {/* Ghost watermark M. */}
          <motion.div aria-hidden style={{
            position: "absolute", top: "6%", right: "-3%",
            fontFamily: F.playfair,
            fontSize: "clamp(12rem, 28vw, 26rem)",
            fontWeight: 900, color: C.cafe, opacity: 0.04,
            lineHeight: 1, userSelect: "none", letterSpacing: "-0.04em",
            x: p1x, y: p1y,
          }}>M.</motion.div>

          {/* Year watermark */}
          <motion.div aria-hidden style={{
            position: "absolute", bottom: "12%", right: "2%",
            fontFamily: F.mono,
            fontSize: "clamp(4rem, 9vw, 8rem)",
            fontWeight: 700, color: C.cafe, opacity: 0.09,
            lineHeight: 1, userSelect: "none",
            x: p2x, y: p2y,
          }}>2026</motion.div>

          {/* Warm blob */}
          <motion.div style={{ position: "absolute", top: "-10%", right: "-5%", x: p3x, y: p3y }} aria-hidden>
            <div style={{
              width: 480, height: 480, borderRadius: "50%",
              background: `radial-gradient(circle, ${C.peach}18 0%, transparent 70%)`,
              filter: "blur(70px)",
            }}/>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div style={{ position: "absolute", top: "18%", right: "clamp(2rem,4vw,4rem)", x: p2x, y: p2y }} className="hide-mob" aria-hidden>
          <Star size={50} color={C.peach} duration={18} opacity={0.22}/>
        </motion.div>
        <motion.div style={{ position: "absolute", bottom: "22%", right: "clamp(1rem,3vw,3rem)", x: p3x, y: p3y }} aria-hidden>
          <DashedCircle size={60} color={C.bistre} opacity={0.28} duration={20} reverse/>
        </motion.div>

        <Cross x={14} y={31} color={C.peach} opacity={0.16}/>
        <Cross x={86} y={55} color={C.peach} opacity={0.14}/>
        <Cross x={70} y={18} color={C.bistre} opacity={0.12}/>

        {/* Stars small */}
        <motion.div style={{ position: "absolute", top: "42%", left: "7%", x: p3x }} aria-hidden>
          <Star size={12} color={C.bistre} duration={30} opacity={0.3}/>
        </motion.div>
        <motion.div style={{ position: "absolute", top: "28%", right: "22%", x: p2x }} aria-hidden>
          <Star size={22} color={C.peach} duration={22} opacity={0.28}/>
        </motion.div>

        {/* OPEN TO WORK badge — top right */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hide-mob"
          style={{
            position: "absolute",
            top: "clamp(5rem,10vh,8rem)",
            right: "clamp(2rem,4vw,4rem)",
            border: `1.5px solid ${C.cafe}`,
            padding: "16px 28px",
            fontFamily: F.mono, fontSize: 11,
            fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: C.cafe,
            background: "transparent", zIndex: 10,
          }}>
          OPEN TO WORK
          <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 7 }}>
            {[0, 0.3, 0.6].map((d, i) => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: "50%",
                background: C.peach,
                animation: `pulse3 1.2s ease-in-out ${d}s infinite`,
              }}/>
            ))}
          </div>
        </motion.div>

        {/* Vertical text */}
        <div className="hide-mob" style={{
          position: "absolute", top: "40%", right: "clamp(0.5rem,1.5vw,1.5rem)",
          writingMode: "vertical-rl",
          fontFamily: F.mono, fontSize: 8,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: C.cafe, opacity: 0.26,
          userSelect: "none",
        }}>Bandung · Indonesia · 2026</div>

        {/* Hero content */}
        <motion.div style={{ y: heroY, opacity: heroOp }}>
          <div style={{
            position: "relative", zIndex: 2,
            padding: "0 clamp(1.25rem,6vw,5rem)",
            paddingBottom: "clamp(2.5rem,6vh,5rem)",
          }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 0.5, background: C.peach }}/>
              <span style={{
                fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: "0.26em", textTransform: "uppercase", color: C.peach,
              }}>JUNIOR FRONTEND DEVELOPER · BANDUNG, INDONESIA</span>
            </motion.div>

            {/* Name */}
            <div style={{ lineHeight: 0.86, overflow: "hidden" }}>
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.33, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: F.playfair, fontWeight: 900,
                    fontSize: "clamp(4rem, 11vw, 9.5rem)",
                    color: C.cafe,
                    letterSpacing: "-0.04em", lineHeight: 0.88,
                    display: "block",
                  }}>HI! I'M MUDITHA</motion.div>
              </div>
              <div style={{ overflow: "hidden", marginLeft: "clamp(0.5rem, 8vw, 8vw)" }}>
                <motion.div
                  initial={{ y: "108%" }} animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: F.playfair, fontWeight: 900, fontStyle: "italic",
                    fontSize: "clamp(3.8rem, 10.5vw, 9rem)",
                    color: C.peach,
                    letterSpacing: "-0.03em", lineHeight: 0.88,
                    display: "block",
                  }}>PARAMITHA</motion.div>
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
                color: C.bistre, opacity: 0.72,
                maxWidth: 400, marginTop: "clamp(1rem, 2.5vh, 2rem)",
                lineHeight: 1.8,
              }}>
              "Informatics student at Universitas Nurtanio Bandung — building clean and user-friendly web interfaces."
            </motion.p>

            {/* Bottom strip */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              style={{
                marginTop: "clamp(2rem,4vh,3.5rem)",
                paddingTop: "1.2rem",
                borderTop: `0.5px solid ${C.tan}55`,
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: 16,
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontFamily: F.mono, fontSize: 8,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: C.bistre, opacity: 0.65,
                }}>INFORMATICS STUDENT · UNIVERSITAS NURTANIO BANDUNG</span>
                <span style={{
                  fontFamily: F.mono, fontSize: 7,
                  border: `1px solid ${C.moss}55`, color: C.moss,
                  padding: "2px 8px", letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  transform: "rotate(-1.5deg)", display: "inline-block",
                }}>OPEN</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Magnetic>
                  <a href="#work" style={{
                    fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    background: C.cafe, color: C.ivory,
                    padding: "12px 28px", display: "inline-block",
                    borderRadius: 0, transition: "all 0.2s",
                    border: `1.5px solid ${C.cafe}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.kombu; e.currentTarget.style.borderColor = C.kombu }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.cafe; e.currentTarget.style.borderColor = C.cafe }}
                  >VIEW WORK</a>
                </Magnetic>
                <Magnetic>
                  <a href="#contact" style={{
                    fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: C.cafe,
                    padding: "12px 28px", display: "inline-block",
                    border: `1.5px solid ${C.tan}`,
                    borderRadius: 0, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.tan; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >SAY HELLO</a>
                </Magnetic>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE 1 ─────────────────────────────────────────── */}
      <MarqueeStrip items={[
        "HTML & CSS","JAVASCRIPT","REACT","TAILWIND CSS","UI DESIGN",
        "FRAMER MOTION","FIGMA","RESPONSIVE DESIGN","GIT","VISUAL DESIGN",
      ]} speed={38}/>

      {/* ══ WORK ═════════════════════════════════════════════════ */}
      <section id="work" style={{
        padding: "clamp(4rem,8vw,9rem) clamp(1.25rem,4vw,3.5rem)",
        position: "relative", overflow: "hidden",
        background: C.ivory,
      }}>

        {/* Ghost watermark */}
        <div aria-hidden style={{
          position: "absolute", top: "3%", left: "-3%",
          fontFamily: F.playfair, fontSize: "clamp(10rem, 22vw, 18rem)",
          fontWeight: 900, color: C.cafe, opacity: 0.04,
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>01</div>

        {/* Spoke ornament */}
        <motion.div style={{ position: "absolute", top: "10%", right: "3%", x: p2x, y: p2y }} aria-hidden>
          <Spoke size={88} spokes={12} color={C.bistre} opacity={0.22} duration={28}/>
        </motion.div>

        {/* Stars scattered */}
        <motion.div style={{ position: "absolute", bottom: "8%", left: "5%", x: p3x }} aria-hidden>
          <Star size={14} color={C.moss} duration={35} opacity={0.28}/>
        </motion.div>

        {/* Section header */}
        <div style={{
          marginBottom: "clamp(2.5rem,5vw,5rem)",
          position: "relative", zIndex: 2,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <span style={{
              fontFamily: F.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: "0.24em", textTransform: "uppercase",
              color: C.peach, display: "block", marginBottom: 14,
            }}>Selected Work</span>
            <h2 style={{
              fontFamily: F.cormorant, fontWeight: 500,
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              letterSpacing: "-0.01em", lineHeight: 1.0,
              color: C.cafe,
            }}>Projects</h2>
            <div style={{
              fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
              color: C.bistre, opacity: 0.65, lineHeight: 1.2,
            }}>frontend design &amp; development.</div>
          </motion.div>
        </div>

        {/* Project cards */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: "clamp(1.8rem, 3.5vw, 3rem)",
          position: "relative", zIndex: 2,
        }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} index={i}/>)}
        </div>

        {/* Closing poem */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: "clamp(4rem,7vw,7rem)", position: "relative", zIndex: 2 }}>
          <p style={{
            fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1rem, 1.8vw, 1.5rem)",
            color: C.bistre, opacity: 0.5, lineHeight: 1.7,
          }}>
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 16 }}>
            {[C.peach, C.moss, C.tan].map((c, i) => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: "50%",
                background: c,
                animation: `pulse3 1.4s ease-in-out ${i * 0.25}s infinite`,
              }}/>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE 2 ─────────────────────────────────────────── */}
      <MarqueeStrip items={[
        "handcrafted","poetic code","visual stories","quiet interfaces",
        "soft motion","earthy palette","editorial type","organic design",
        "tender details","layered worlds",
      ]} speed={42} reverse/>

      {/* ══ ABOUT ════════════════════════════════════════════════ */}
      <section id="about" style={{
        position: "relative", overflow: "hidden",
        padding: "clamp(5rem,10vw,10rem) clamp(1.25rem,5vw,4rem)",
        background: C.bone,
      }}>

        {/* Ghost letter */}
        <motion.div aria-hidden style={{
          position: "absolute", top: "50%", left: "-5%",
          translateY: "-50%",
          fontFamily: F.playfair,
          fontSize: "clamp(15rem, 32vw, 30rem)",
          fontWeight: 600, color: C.tan, opacity: 0.055,
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          x: p3x, y: p3y,
        }}>M.</motion.div>

        {/* Ornament top right */}
        <motion.div style={{ position: "absolute", top: "6%", right: "4%", x: p2x, y: p2y }} aria-hidden>
          <div style={{ position: "relative" }}>
            <Spoke size={72} spokes={8} color={C.bistre} opacity={0.14} duration={30}/>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DashedCircle size={72} color={C.bistre} opacity={0.12} duration={25} reverse/>
            </div>
          </div>
        </motion.div>

        {/* Stars */}
        <motion.div style={{ position: "absolute", bottom: "15%", right: "8%", x: p3x }} aria-hidden>
          <Star size={18} color={C.peach} duration={20} opacity={0.3}/>
        </motion.div>
        <motion.div style={{ position: "absolute", top: "25%", left: "4%", x: p3x }} aria-hidden>
          <Star size={10} color={C.bistre} duration={40} opacity={0.22}/>
        </motion.div>

        <div className="about-cols" style={{
          display: "flex", gap: "clamp(3rem, 7vw, 9rem)",
          alignItems: "flex-start", position: "relative", zIndex: 1,
        }}>

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ flexShrink: 0, width: "clamp(260px, 35vw, 420px)", position: "relative" }}>

            {/* Polaroid */}
            <div style={{ position: "relative" }}>
              <Tape w={62} h={17} rotate={8}/>
              <div style={{
                background: C.ivory,
                padding: "clamp(14px,184vw,20px) clamp(8px,1.4vw,14px) clamp(36px,5vw,52px)",
                border: `0.5px solid ${C.tan}`,
                boxShadow: `4px 6px 24px ${C.bistre}18`,
                transform: "rotate(-2.5deg)",
                position: "relative", zIndex: 2,
                transition: "transform 0.4s, box-shadow 0.4s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "rotate(0deg) scale(1.02) translateY(-4px)"; e.currentTarget.style.boxShadow = `6px 10px 32px ${C.bistre}28` }}
              onMouseLeave={e => { e.currentTarget.style.transform = "rotate(-2.5deg)"; e.currentTarget.style.boxShadow = `4px 6px 24px ${C.bistre}18` }}
              >
                <div style={{
                  overflow: "visible", aspectRatio: "3/4",
                  background: C.tan,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img src="/me.jpg" alt="Muditha Paramitha"
                     style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "sepia(0.06) contrast(1.02)",
                     }}
                    onError={e => { e.target.style.display = "none" }}
                  />
                </div>
                <p style={{
                  textAlign: "center", marginTop: 10,
                  fontFamily: F.mono, fontSize: 12,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: C.cafe, opacity: 0.38,
                }}>Muditha · 2026</p>
              </div>

              {/* Mini spinning flower card */}
              <div style={{
                position: "absolute", bottom: "-1.8rem", right: "-1.3rem",
                width: "clamp(72px, 11vw, 102px)",
                background: C.ivory,
                padding: 8,
                border: `0.5px solid ${C.tan}`,
                boxShadow: `2px 3px 10px ${C.bistre}14`,
                transform: "rotate(7deg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 3,
              }}>
                <Spoke size={52} spokes={6} color={C.peach} opacity={0.5} duration={14}/>
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { l: "ROLE", v: "Frontend Developer" },
                { l: "STACK", v: "React · Tailwind · JS" },
                { l: "BASED", v: "Bandung, Indonesia" },
                { l: "STATUS", v: "Open to opportunities" },
              ].map(({ l, v }, i) => (
                <motion.div key={l}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.07 }}
                  style={{
                    paddingBottom: 8,
                    borderBottom: `0.5px solid ${C.tan}55`,
                    display: "flex", alignItems: "baseline", gap: 10,
                  }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: 7, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: C.bistre, opacity: 0.38, minWidth: 50,
                  }}>{l}</span>
                  <span style={{
                    fontFamily: F.manrope, fontSize: 12, fontWeight: 500,
                    color: C.cafe,
                  }}>{v}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: 1, paddingTop: "clamp(0.5rem,3vw,3rem)" }}>

            {/* Label */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: C.peach,
                animation: "pulse3 1.6s ease-in-out infinite",
              }}/>
              <span style={{
                fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                letterSpacing: "0.26em", textTransform: "uppercase", color: C.peach,
              }}>About</span>
            </div>

            {/* Quote */}
            <blockquote style={{
              fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(1.45rem, 2.7vw, 2.4rem)",
              color: C.cafe, lineHeight: 1.4,
              borderLeft: `2px solid ${C.peach}55`,
              paddingLeft: "clamp(0.7rem, 1.8vw, 1.3rem)",
              marginBottom: 28,
            }}>
              I'm Muditha — an Informatics student and frontend developer who enjoys building clean, thoughtful, and user-friendly web experiences.
              <span style={{
                textDecoration: "underline wavy", textDecorationColor: `${C.peach}55`,
                textUnderlineOffset: "5px",
              }}></span>
            </blockquote>

            {/* Prose */}
            <p style={{
              fontFamily: F.manrope, fontSize: 15, lineHeight: 2.0,
              color: C.bistre, opacity: 0.85, marginBottom: 14,
            }}>
            </p>
            <p style={{
              fontFamily: F.manrope, fontSize: 14, lineHeight: 2.0,
              color: C.bistre, opacity: 0.7, marginBottom: 32,
            }}>
              I’m especially interested in frontend development, interface design, and creating clean, user-friendly web experiences. Currently working with React, Tailwind CSS, and JavaScript while continuously improving through hands-on projects and real-world practice.
            </p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: 42, height: 0.5, background: C.peach,
                transformOrigin: "left", marginBottom: 24,
              }}/>

            {/* Skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 36 }}>
              {SKILLS.map((s, i) => {
                const variants = [
                  { bg: `${C.peach}12`, border: `${C.peach}45`, color: C.peach },
                  { bg: `${C.moss}12`, border: `${C.moss}45`, color: C.moss },
                  { bg: `${C.bistre}10`, border: `${C.bistre}45`, color: C.bistre },
                  { bg: `${C.codium}10`, border: `${C.codium}45`, color: C.codium },
                ]
                const v = variants[i % 4]
                return (
                  <motion.span key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    whileHover={{ scale: 1.07, y: -2 }}
                    style={{
                      display: "inline-block",
                      fontFamily: F.mono, fontSize: 8, fontWeight: 700,
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      padding: "5px 12px", borderRadius: 0,
                      background: v.bg,
                      border: `1px solid ${v.border}`,
                      color: v.color,
                      transform: `rotate(${((i % 3) - 1) * 0.65}deg)`,
                    }}
                  >{s}</motion.span>
                )
              })}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { l: "GitHub ↗", h: "https://github.com/MudithaParamitha" },
                { l: "LinkedIn ↗", h: "https://www.linkedin.com/in/muditha-paramitha-tunggal-42095721b" },
              ].map(({ l, h }) => (
                <Magnetic key={l}>
                  <a href={h} target="_blank" rel="noreferrer"
                    style={{
                      fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: C.cafe,
                      border: `1px solid ${C.tan}`,
                      padding: "10px 20px", display: "inline-block",
                      borderRadius: 0, transition: "all 0.25s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.cafe; e.currentTarget.style.background = `${C.tan}25` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.tan; e.currentTarget.style.background = "transparent" }}
                  >{l}</a>
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE 3 ─────────────────────────────────────────── */}
      <MarqueeStrip items={[
        "let's create together","reach out","say hello",
        "open for collaboration","freelance available",
        "new projects welcome","creative conversations",
      ]} speed={40}/>

      {/* ══ CONTACT ══════════════════════════════════════════════ */}
      <section id="contact" style={{
        position: "relative", overflow: "hidden",
        padding: "clamp(5rem,9vw,10rem) clamp(1.25rem,5vw,4rem)",
        background: C.kombu,
      }}>

        {/* Ghost "hello." */}
        <div aria-hidden style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: F.playfair, fontWeight: 900,
          fontSize: "clamp(8rem, 22vw, 22rem)",
          color: C.ivory, opacity: 0.048,
          whiteSpace: "nowrap", pointerEvents: "none",
          letterSpacing: "-0.05em", lineHeight: 1, userSelect: "none",
        }}>hello.</div>

        {/* Ornaments */}
        <motion.div style={{ position: "absolute", top: "8%", right: "4%", x: p2x, y: p2y }} aria-hidden>
          <Spoke size={80} spokes={10} color={C.ivory} opacity={0.08} duration={30}/>
        </motion.div>
        <motion.div style={{ position: "absolute", bottom: "10%", left: "3%", x: p3x }} aria-hidden>
          <Star size={22} color={C.peach} duration={25} opacity={0.25}/>
        </motion.div>

        {/* OrbitDot */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <OrbitDot cx={80} cy={80} rx={40} ry={25} duration={5000} color={C.peach} size={5}/>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(3rem,6vw,6rem)", position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            {[0, 0.25].map((d, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: C.peach,
                animation: `pulse3 1.3s ease-in-out ${d}s infinite`,
              }}/>
            ))}
            <span style={{
              fontFamily: F.mono, fontSize: 9, fontWeight: 700,
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: C.peach,
            }}>LET'S CONNECT</span>
            {[0.5, 0.75].map((d, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: C.peach,
                animation: `pulse3 1.3s ease-in-out ${d}s infinite`,
              }}/>
            ))}
          </div>
          <h2 style={{
            fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
            color: C.ivory, lineHeight: 1.15,
          }}>Have something in mind?</h2>
          <div style={{
            fontFamily: F.cormorant, fontWeight: 300,
            fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
            color: C.ivory, opacity: 0.7,
          }}>I'd love to hear it.</div>
        </motion.div>

        {/* Two columns */}
        <div className="contact-cols" style={{
          display: "flex", gap: "clamp(2rem,5vw,5rem)",
          alignItems: "flex-start", maxWidth: 960,
          margin: "0 auto", position: "relative", zIndex: 1,
        }}>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            style={{ flex: "0 0 clamp(175px, 27vw, 255px)" }}>

            {[
              { l: "Email", v: "mudithaparamitha666@gmail.com", h: "mailto:mudithaparamitha666@gmail.com" },
              { l: "GitHub", v: "MudithaParamitha", h: "https://github.com/MudithaParamitha" },
            ].map(({ l, v, h }, i) => (
              <motion.div key={l}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.12 }}
                style={{ marginBottom: 16, position: "relative" }}>
                <Tape w={48} h={14} rotate={i % 2 === 0 ? 4 : -3}/>
                <div style={{
                  background: C.ivory, border: `0.5px solid ${C.tan}`,
                  padding: "1rem 1.2rem",
                  boxShadow: `2px 3px 10px ${C.bistre}14`,
                  transform: `rotate(${i % 2 === 0 ? "-1.2deg" : "0.8deg"})`,
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "rotate(0deg) translateY(-2px)"; e.currentTarget.style.boxShadow = `4px 6px 18px ${C.bistre}22` }}
                onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${i % 2 === 0 ? "-1.2deg" : "0.8deg"})`; e.currentTarget.style.boxShadow = `2px 3px 10px ${C.bistre}14` }}
                >
                  <p style={{
                    fontFamily: F.mono, fontSize: 7, fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.bistre, opacity: 0.38, marginBottom: 6,
                  }}>{l}</p>
                  <a href={h} target="_blank" rel="noreferrer" style={{
                    fontFamily: F.manrope, fontSize: 11, fontWeight: 500,
                    color: C.cafe, wordBreak: "break-all", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.peach}
                  onMouseLeave={e => e.currentTarget.style.color = C.cafe}
                  >{v}</a>
                </div>
              </motion.div>
            ))}

            <p style={{
              fontFamily: F.cormorant, fontStyle: "italic", fontWeight: 300,
              fontSize: 14, color: C.ivory, opacity: 0.55,
              lineHeight: 1.85, marginTop: 20,
            }}>Open to freelance work, collaborations, and creative conversations.</p>

            <div style={{ marginTop: 20, display: "flex", gap: 6 }}>
              {["✦","✦","✦"].map((s, i) => (
                <span key={i} style={{ color: C.peach, opacity: 0.32, fontSize: 14 }}>{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, delay: 0.15 }}
            style={{
              flex: 1, position: "relative",
              background: C.ivory,
              padding: "clamp(1.8rem, 4vw, 3rem)",
              border: `0.5px solid ${C.tan}`,
              boxShadow: `3px 5px 22px ${C.bistre}18`,
            }}>
            <Tape w={64} h={16} rotate={-4} left="78%" top={-9}/>

            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <Spoke size={48} spokes={8} color={C.peach} opacity={0.6} duration={8}
                  style={{ margin: "0 auto 18px" }}/>
                <h3 style={{
                  fontFamily: F.cormorant, fontStyle: "italic",
                  fontSize: 28, color: C.cafe, marginBottom: 10,
                }}>Message received.</h3>
                <p style={{ fontFamily: F.manrope, fontSize: 13, color: C.bistre, lineHeight: 1.8, opacity: 0.7 }}>
                  I'll get back to you soon. Thank you.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { k: "name", t: "text", l: "Your Name", ph: "Muditha" },
                  { k: "email", t: "email", l: "Email Address", ph: "hello@you.com" },
                ].map(({ k, t, l, ph }) => (
                  <div key={k} style={{ borderBottom: `0.5px solid ${C.tan}80` }}>
                    <label style={{
                      display: "block", fontFamily: F.mono, fontSize: 7,
                      fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                      color: C.bistre, opacity: 0.38, marginTop: 22, marginBottom: 8,
                    }}>{l}</label>
                    <input type={t} placeholder={ph} required
                      value={formData[k]}
                      onChange={e => setFormData({ ...formData, [k]: e.target.value })}
                      style={{
                        width: "100%", paddingBottom: 10,
                        background: "none", border: "none", outline: "none",
                        fontFamily: F.manrope, fontSize: 15, color: C.cafe,
                        caretColor: C.peach,
                      }}/>
                  </div>
                ))}
                <div style={{ borderBottom: `0.5px solid ${C.tan}80` }}>
                  <label style={{
                    display: "block", fontFamily: F.mono, fontSize: 7,
                    fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.bistre, opacity: 0.38, marginTop: 22, marginBottom: 8,
                  }}>Your Message</label>
                  <textarea placeholder="What's on your mind?" required rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: "100%", paddingBottom: 10,
                      background: "none", border: "none", outline: "none",
                      resize: "none", fontFamily: F.manrope, fontSize: 15,
                      color: C.cafe, caretColor: C.peach,
                    }}/>
                </div>
                <Magnetic style={{ alignSelf: "flex-start", marginTop: 24 }}>
                  <motion.button type="submit" disabled={sending}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      fontFamily: F.mono, fontSize: 9, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: C.ivory, background: C.cafe,
                      padding: "13px 32px", border: "none", borderRadius: 0,
                      opacity: sending ? 0.65 : 1, transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (!sending) e.currentTarget.style.background = C.kombu }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.cafe }}
                  >{sending ? "Sending…" : "Send Message →"}</motion.button>
                </Magnetic>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{
        background: C.bone,
        borderTop: `0.5px solid ${C.tan}55`,
        padding: "1.5rem clamp(1.25rem,5vw,4rem)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: F.cormorant, fontStyle: "italic",
          fontSize: 13, color: C.cafe, opacity: 0.36,
        }}>
          © {new Date().getFullYear()} Muditha Paramitha Tunggal
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Spoke size={18} spokes={5} color={C.peach} opacity={0.4} duration={12}/>
          <span style={{
            fontFamily: F.mono, fontSize: 8, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: C.bistre, opacity: 0.27,
          }}>React · Framer Motion · Handcrafted ✦</span>
        </div>
      </footer>
    </div>
  )
}