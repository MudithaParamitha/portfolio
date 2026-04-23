import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { TypeAnimation } from 'react-type-animation'
import Particles from 'react-particles'
import { loadSlim } from 'tsparticles-slim'

const projects = [
  {
    id: "pomodoro",
    title: "Pomodoro Timer",
    desc: "A simple Pomodoro timer designed to help users stay focused and productive. Implemented timer logic and session tracking. Designed a clean and distraction-free interface  ",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "/pomodoro.jpeg",
    github: "https://github.com/MudithaParamitha/pomodoro-timer",
    demo: "https://mudithaparamitha.github.io/pomodoro-timer"
  },
  {
    id: "dispatch",
    title: "Dispatch Letter Validation System",
    desc: "A web-based internal dashboard for validating dispatch letters. Developed login authentication system. Built data table and status tracking features. Focused on usability and clear data presentation.",
    tech: ["HTML", "Bootstrap", "JavaScript"],
    image: "/login.jpeg",
    github: "https://github.com/MudithaParamitha/dispatch-system",
    demo: "https://mudithaparamitha.github.io/dispatch-system/"
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    desc: "A personal portfolio website showcasing my projects and skills. Built using React and Tailwind CSS. Implemented dark mode and smooth animations. Designed with a clean and modern UI approach.",
    tech: ["React", "Tailwind"],
    github: "https://github.com/MudithaParamitha",
    demo: "#"
  }
]

const allTech = ["All", "HTML", "CSS", "JavaScript", "React", "Tailwind", "Bootstrap"]

const skills = [
  { name: "JavaScript", level: 70, label: "Intermediate" },
  { name: "React", level: 65, label: "Intermediate" },
  { name: "Tailwind CSS", level: 75, label: "Intermediate" },
  { name: "HTML & CSS", level: 85, label: "Strong" },
  { name: "Kotlin", level: 50, label: "Basic" },
  { name: "Git", level: 60, label: "Familiar" },
]

function App() {
  const [dark, setDark] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorEnlarged, setCursorEnlarged] = useState(false)
  const [filter, setFilter] = useState("All")
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  // scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setScroll((window.scrollY / total) * 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // cursor tracker
  useEffect(() => {
    const moveCursor = (e) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", moveCursor)
    return () => window.removeEventListener("mousemove", moveCursor)
  }, [])

  // active nav section highlight
  useEffect(() => {
    const sections = ["about", "skills", "experience", "projects", "contact"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    const res = await fetch("https://formspree.io/f/xqegvqvz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    setSending(false)
    if (res.ok) setSent(true)
  }

  const navLink = (href, label) => {
    const id = href.replace("#", "")
    const isActive = activeSection === id
    return (
      <a
        href={href}
        className={`transition font-medium ${
          isActive ? "text-[#839958]" : "hover:text-[#839958] opacity-80"
        }`}
      >
        {label}
      </a>
    )
  }

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.tech.includes(filter))

  return (
    <div
      className={
        dark
          ? "bg-[#0A3323] text-white min-h-screen"
          : "animated-bg text-[#0A3323] min-h-screen"
      }
    >
      {/* particles */}
      <Particles
        key={dark ? "dark" : "light"}
        init={particlesInit}
        options={{
          particles: {
            number: { value: 35 },
            color: { value: dark ? "#ffffff" : "#839958" },
            opacity: { value: 0.15 },
            size: { value: 2.5 },
            move: { enable: true, speed: 0.8 },
            links: {
              enable: true,
              color: dark ? "#ffffff" : "#839958",
              opacity: 0.08,
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
          },
        }}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
      />

      {/* scroll progress bar */}
      <div
        style={{ width: scroll + "%" }}
        className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-[#839958] to-[#d293a8] z-[100] transition-all"
      />

      {/* navbar */}
      <nav
        className={`flex justify-between items-center px-6 md:px-16 py-5 sticky top-0 z-50 ${
          dark
            ? "bg-[#0A3323]/80 backdrop-blur-xl border-b border-white/10"
            : "bg-white/40 backdrop-blur-xl border-b border-black/10"
        }`}
      >
        <h2 className="text-xl font-bold tracking-tight">Muditha</h2>

        <div className="flex items-center gap-6 text-sm">
          {navLink("#about", "About")}
          {navLink("#skills", "Skills")}
          {navLink("#experience", "Experience")}
          {navLink("#projects", "Projects")}
          {navLink("#contact", "Contact")}

          <a
            href="https://www.linkedin.com/in/muditha-paramitha-tunggal-42095721b"
            target="_blank"
            rel="noreferrer"
            className="opacity-70 hover:opacity-100 transition"
            title="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          <button
            onClick={() => setDark(!dark)}
            className="opacity-70 hover:opacity-100 transition text-base"
            title="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 min-h-[80vh] md:h-[90vh] flex flex-col justify-center items-center text-center px-6 md:px-12">
        <div className="absolute w-72 h-72 bg-[#d293a8]/20 blur-3xl rounded-full top-10 left-10 pointer-events-none" />
        <div className="absolute w-72 h-72 bg-[#839958]/20 blur-3xl rounded-full bottom-10 right-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-bold leading-tight"
        >
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-[#839958] to-[#d293a8] bg-clip-text text-transparent">
              Muditha
            </span>{" "}
            👋
          </p>
          <TypeAnimation
            sequence={[
              "Junior Frontend Developer", 2000,
              "UI Enthusiast", 2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-xl sm:text-2xl md:text-3xl text-[#839958]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-5 text-base md:text-lg max-w-xl opacity-75 leading-relaxed"
        >
          Informatics student at Universitas Nurtanio Bandung — building clean and user-friendly web interfaces.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex gap-4 mt-8 flex-wrap justify-center"
        >
          <a
            href="#projects"
            onMouseEnter={() => setCursorEnlarged(true)}
            onMouseLeave={() => setCursorEnlarged(false)}
            className="bg-[#839958] text-white px-6 py-3 rounded-lg hover:scale-105 transition duration-300"
          >
            View My Work
          </a>
          <a
            href="/CV_Muditha.pdf"
            download
            onMouseEnter={() => setCursorEnlarged(true)}
            onMouseLeave={() => setCursorEnlarged(false)}
            className={`px-6 py-3 rounded-lg border border-[#839958] text-[#839958] hover:bg-[#839958] hover:text-white transition duration-300`}
          >
            Download CV
          </a>
        </motion.div>
      </section>

      {/* about */}
      <motion.section
  id="about"
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="relative z-10 px-6 md:px-16 py-16 md:py-20"
>
  <h2 className="text-4xl font-bold mb-12 text-center">About Me</h2>

  <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">

    {/* foto profil */}
<div className="flex-shrink-0 relative flex items-center justify-center">
  
  {/* ring gradient berputar */}
  <div
    className="absolute rounded-full"
    style={{
      width: "220px",
      height: "220px",
      background: "conic-gradient(from 0deg, #839958, #d293a8, #aeb080, #d293a8, #839958)",
      animation: "spinRing 3s linear infinite",
      padding: "3px",
    }}
  />

  {/* ring putih pemisah */}
  <div
    className={`absolute rounded-full z-10 ${dark ? "bg-[#0A3323]" : "bg-[#f0efdc]"}`}
    style={{ width: "210px", height: "210px" }}
  />

  {/* foto */}
  <div className="relative z-20 w-48 h-48 md:w-52 md:h-52 rounded-full overflow-hidden">
    <img
      src="/me.jpg"
      alt="Muditha Paramitha"
      className="w-full h-full object-cover"
      onError={(e) => console.log("Foto gagal load:", e.target.src)}
    />
  </div>

</div>

    {/* teks */}
    <div className="text-center md:text-left">
      <p className="text-base md:text-lg mb-4">
        I'm <strong>Muditha Paramitha Tunggal</strong>, an Informatics student
        at Universitas Nurtanio Bandung with a strong interest in building
        interactive and clean web experiences.
      </p>

      <ul className="text-base md:text-lg space-y-2 mb-4 opacity-80">
        <li>• Focused on building responsive and user-friendly interfaces</li>
        <li>• Working with React, Tailwind CSS, and JavaScript</li>
        <li>• Interested in clean design and intuitive user experience</li>
        <li>• Continuously improving through hands-on projects</li>
        <li>• Currently balancing full-time work and academic life</li>
      </ul>

      <p className="opacity-80">
        I enjoy turning ideas into simple, functional, and visually appealing web applications.
      </p>
    </div>

  </div>
</motion.section>

      {/* skills */}
      <section id="skills" className="relative z-10 px-8 md:px-16 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
        <div className="max-w-xl md:max-w-2xl mx-auto space-y-6">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="opacity-50 text-sm">{skill.label}</span>
              </div>
              <div
                className={`w-full h-2 rounded-full ${
                  dark ? "bg-white/10" : "bg-black/10"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="h-2 rounded-full bg-gradient-to-r from-[#839958] to-[#d293a8]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* experience */}
<section className="relative z-10 px-6 md:px-16 py-16 md:py-20">
  <h2 className="text-4xl font-bold mb-16 text-center">Experience</h2>

  <div className="max-w-2xl mx-auto relative">

    {/* garis vertikal */}
    <div className={`absolute left-6 top-0 bottom-0 w-[2px] ${
      dark ? "bg-white/10" : "bg-black/10"
    }`} />

    {[
      {
        role: "Receptionist & Admin Staff",
        place: "Latihan Mengemudi Santa",
        period: "Jan 2023 – Present",
        desc: [
          "Handled scheduling, appointments, and internal communication",
          "Managed daily administrative tasks including data entry and document filing",
          "Prepared reports and assisted with basic accounting tasks",
        ],
        icon: "💼",
        current: true,
      },
      {
        role: "Divisi Publikasi & Dokumentasi",
        place: "PMK Universitas Nurtanio",
        period: "Oct 2024 – Present",
        desc: [
          "Created visual content and event documentation",
          "Handled internal communication and design materials",
        ],
        icon: "🎨",
        current: true,
      },
      {
        role: "Mitra Waralaba",
        place: "Teh Iketan",
        period: "Jan 2025 – Apr 2025",
        desc: [
          "Managed daily operations of a small beverage business",
          "Handled inventory, finances, and stock control",
          "Balanced entrepreneurial responsibilities with work and academic commitments",
        ],
        icon: "🍵",
        current: false,
      },
      {
        role: "Junior Cook",
        place: "Belva Huis — Hotel, Restaurant & Coffee Shop",
        period: "Feb 2022 – Dec 2022",
        desc: [
          "Conducted daily, weekly, and monthly stock checks",
          "Maintained food safety and kitchen hygiene standards",
          "Assisted in translating orders for international guests",
        ],
        icon: "👨‍🍳",
        current: false,
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: i * 0.1 }}
        viewport={{ once: true }}
        className="relative pl-16 mb-12 last:mb-0"
      >
        {/* icon bulat */}
        <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 ${
          dark ? "bg-[#1a4a32] border-2 border-[#839958]/40" : "bg-white border-2 border-[#839958]/40"
        }`}>
          {item.icon}
        </div>

        {/* card */}
        <div className={`rounded-xl p-5 ${
          dark
            ? "bg-[#123c2c]/60 backdrop-blur-md border border-white/10"
            : "bg-white/70 backdrop-blur-md border border-white/40"
        }`}>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base">{item.role}</h3>
            {item.current && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Current
              </span>
            )}
          </div>

          <p className="text-sm text-[#839958] font-medium mb-1">{item.place}</p>
          <p className="text-xs opacity-50 mb-3">{item.period}</p>

          <ul className="space-y-1">
            {item.desc.map((d, j) => (
              <li key={j} className="text-sm opacity-70 flex gap-2">
                <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full bg-[#839958] block" style={{marginTop: "7px"}}/>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* projects */}
      <section id="projects" className="relative z-10 px-8 md:px-16 py-20">
        <h2 className="text-4xl font-bold mb-8 text-center">My Projects</h2>

        {/* filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allTech.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              onMouseEnter={() => setCursorEnlarged(true)}
              onMouseLeave={() => setCursorEnlarged(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                filter === tech
                  ? "bg-[#839958] text-white"
                  : dark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-black/10 text-[#0A3323] hover:bg-black/20"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              whileHover={{ scale: 1.03, y: -6 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setCursorEnlarged(true)}
              onMouseLeave={() => setCursorEnlarged(false)}
              className={`rounded-xl overflow-hidden ${
                dark
                  ? "bg-[#123c2c]/60 backdrop-blur-md border border-white/10"
                  : "bg-white/70 backdrop-blur-md border border-white/40"
              }`}
            >
              <div className="relative overflow-hidden h-48 bg-black/10">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30 text-4xl">
                    🖥️
                  </div>
                )}
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-base md:text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed mb-4">{project.desc}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#839958] font-medium hover:underline"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.demo && project.demo !== "#" && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#839958] font-medium hover:underline"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="relative z-10 px-8 md:px-16 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">Contact Me</h2>
        <p className="opacity-60 mb-10 text-sm">
          Available for freelance and small projects.
          If you're looking for a clean and user-friendly website, feel free to reach out — I'd love to help bring your ideas to life.
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[#839958] text-base md:text-lg font-medium"
          >
            Message sent! Thanks for getting in touch — I’ll get back to you soon.
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md md:max-w-lg mx-auto space-y-4 text-left"
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-[#839958] transition ${
                dark
                  ? "bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  : "bg-white/70 border-black/15 placeholder:text-black/30"
              }`}
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-[#839958] transition ${
                dark
                  ? "bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  : "bg-white/70 border-black/15 placeholder:text-black/30"
              }`}
            />
            <textarea
              placeholder="Your Message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border outline-none focus:border-[#839958] transition resize-none ${
                dark
                  ? "bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  : "bg-white/70 border-black/15 placeholder:text-black/30"
              }`}
            />
            <button
              type="submit"
              disabled={sending}
              onMouseEnter={() => setCursorEnlarged(true)}
              onMouseLeave={() => setCursorEnlarged(false)}
              className="w-full bg-[#839958] text-white py-3 rounded-lg hover:scale-[1.02] transition duration-300 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-60 text-sm">
          <a
            href="https://mail.google.com/mail/?view=cm&to=mudithaparamitha666@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#839958] hover:opacity-100 transition"
          >
            mudithaparamitha666@gmail.com
          </a>
          <a
            href="https://github.com/MudithaParamitha"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#839958] hover:opacity-100 transition"
          >
            github.com/MudithaParamitha
          </a>
          <a
            href="https://www.linkedin.com/in/muditha-paramitha-tunggal-42095721b"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#839958] hover:opacity-100 transition"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* footer */}
      <footer
        className={`relative z-10 text-center py-6 text-sm opacity-40 border-t ${
          dark ? "border-white/10" : "border-black/10"
        }`}
      >
        © {new Date().getFullYear()} Muditha Paramitha Tunggal · Built with React & Tailwind CSS
      </footer>

      {/* custom cursor */}
      <div
        className="custom-cursor"
        style={{
          left: cursor.x,
          top: cursor.y,
          width: cursorEnlarged ? "44px" : "20px",
          height: cursorEnlarged ? "44px" : "20px",
          opacity: cursorEnlarged ? 0.4 : 1,
          transition: "width 0.2s ease, height 0.2s ease, opacity 0.2s ease",
        }}
      />
      <div
        style={{
          left: cursor.x,
          top: cursor.y,
          width: "6px",
          height: "6px",
          background: "#839958",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      />
    </div>
  )
}

export default App