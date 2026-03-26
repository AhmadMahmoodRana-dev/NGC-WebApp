import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, Zap } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    tag: 'Milestone',
    title: 'NGC Completes 500kV Transmission Corridor',
    subtitle: 'Lahore–Islamabad High-Voltage Direct Current Link',
    desc: 'A landmark achievement strengthening national grid reliability and reducing transmission losses by 18% across the northern corridor.',
    cta: 'Read More',
    ctaHref: '/operations/projects',
    img: 'bg-gradient-to-br from-ngc-navy via-ngc-navy-mid to-ngc-blue',
    accentColor: 'ngc-gold',
  },
  {
    id: 2,
    tag: 'Announcement',
    title: 'NGC Launches Smart Grid Modernisation Programme',
    subtitle: 'Phase I — Digital Substation Upgrades',
    desc: 'Integration of SCADA-enabled automation across 47 grid stations under a 3-year, PKR 28 billion modernisation initiative.',
    cta: 'View Projects',
    ctaHref: '/operations/grid',
    img: 'bg-gradient-to-br from-[#0a1628] via-ngc-navy to-[#0e2d5c]',
    accentColor: 'ngc-sky',
  },
  {
    id: 3,
    tag: 'Tenders',
    title: 'New Procurement Opportunities Now Open',
    subtitle: 'FY 2025–26 Capital Expenditure Programme',
    desc: 'Inviting qualified vendors and contractors for transmission line construction, transformer supply, and civil works contracts.',
    cta: 'View Tenders',
    ctaHref: '/publications/tenders',
    img: 'bg-gradient-to-br from-ngc-navy via-[#1a3a6b] to-ngc-navy-mid',
    accentColor: 'ngc-gold-light',
  },
]

const TICKER_ITEMS = [
  '⚡ 500kV Lahore–Faisalabad Transmission Line commissioned on schedule',
  '📢 Annual Report 2024–25 now available for download',
  '🏗️ Tender No. NGC/2026/T-041 — Grid Station Expansion, Multan',
  '🌐 NGC Website Launch — Your gateway to Pakistan\'s national grid',
  '📊 Q2 FY 2026 System Performance Report published',
  '🔔 NGC Scholarship Programme 2026 — Applications open until April 30',
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)
  const slide = SLIDES[current]

  return (
    <section className="relative">
      {/* ── Hero Carousel ── */}
      <div className={`relative ${slide.img} min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden transition-all duration-700`}>
        {/* Background grid lines */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Decorative power-line graphic */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-5">
          <svg viewBox="0 0 600 500" className="w-full h-full" fill="none">
            <line x1="50"  y1="50"  x2="550" y2="450" stroke="white" strokeWidth="1.5"/>
            <line x1="100" y1="0"   x2="600" y2="400" stroke="white" strokeWidth="1"/>
            <circle cx="300" cy="250" r="80" stroke="white" strokeWidth="1"/>
            <circle cx="300" cy="250" r="40" stroke="white" strokeWidth="0.5"/>
            {[0,72,144,216,288].map(a => (
              <circle key={a} cx={300+80*Math.cos(a*Math.PI/180)} cy={250+80*Math.sin(a*Math.PI/180)} r="6" fill="white" opacity="0.4"/>
            ))}
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-ngc-gold/20 border border-ngc-gold/40 text-ngc-gold-light rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-5 animate-fade-in">
              <Zap size={10} fill="currentColor" />
              {slide.tag}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 animate-fade-up">
              {slide.title}
            </h1>
            <p className="text-ngc-gold-light font-medium text-base mb-4 animate-fade-up">
              {slide.subtitle}
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg animate-fade-up">
              {slide.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fade-up">
              <Link to={slide.ctaHref} className="btn-gold">
                {slide.cta} <ArrowRight size={14} />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border border-white/30 text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-white/10 transition-colors">
                About NGC
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-ngc-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-20 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── News Ticker ── */}
      <div className="bg-ngc-blue/10 border-b border-ngc-blue/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 py-2.5 overflow-hidden">
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
            <AlertCircle size={11} /> LATEST
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-content gap-16">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="text-sm text-ngc-navy font-medium whitespace-nowrap px-4">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
