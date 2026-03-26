import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Shield, Zap } from 'lucide-react'

const VALUES = [
  { icon: Zap,    title: 'Reliability',   desc: 'Ensuring uninterrupted power transmission to sustain national economic activity.' },
  { icon: Shield, title: 'Integrity',     desc: 'Upholding the highest standards of governance, transparency, and accountability.' },
  { icon: Target, title: 'Excellence',    desc: 'Continuous improvement in operational efficiency and service delivery standards.' },
  { icon: Eye,    title: 'Transparency',  desc: 'Open communication with stakeholders, regulators, and the general public.' },
]

const LEADERSHIP = [
  { name: 'Dr. Arshad Iqbal',     title: 'Chairman, Board of Directors', dept: 'Board'       },
  { name: 'Engr. Khalid Mehmood', title: 'Chief Executive Officer',       dept: 'Management'  },
  { name: 'Ms. Sadia Nawaz',      title: 'Chief Financial Officer',        dept: 'Finance'     },
  { name: 'Engr. Tariq Sultan',   title: 'Chief Operating Officer',        dept: 'Operations'  },
  { name: 'Mr. Asim Raza',        title: 'Director HR & Admin',            dept: 'HR'          },
  { name: 'Ms. Nadia Aziz',       title: 'Director IT & Digital',          dept: 'IT'          },
]

export default function AboutPage() {
  return (
    <div className="font-body">
      {/* Breadcrumb */}
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-white/50 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About NGC</span>
          </nav>
        </div>
      </div>

      {/* Page Hero */}
      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">About Us</p>
          <h1 className="font-display text-4xl font-bold text-white mb-4">National Grid Company</h1>
          <p className="text-white/70 text-base max-w-2xl leading-relaxed">
            NGC is the custodian of Pakistan's national power transmission infrastructure — building, operating and maintaining the high-voltage grid that moves electricity from generators to distribution companies.
          </p>
        </div>
      </div>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-2">Our Story</p>
            <h2 className="section-title mb-4">Powering Pakistan Since Inception</h2>
            <p className="text-ngc-muted leading-relaxed mb-4">
              Established as part of Pakistan's energy sector restructuring, NGC was created to manage the national transmission grid with a mandate to ensure reliable, efficient, and equitable wheeling of electricity across the country.
            </p>
            <p className="text-ngc-muted leading-relaxed mb-6">
              Operating under the regulatory framework of NEPRA and the Ministry of Energy, NGC connects over 1,100 grid stations and maintains more than 8,200 kilometres of high-voltage transmission lines, carrying electricity from generation sources to distribution companies serving millions of Pakistanis.
            </p>
            <div className="flex gap-3">
              <Link to="/about/history" className="btn-primary">Our History <ArrowRight size={14} /></Link>
              <Link to="/about/governance" className="btn-outline">Governance</Link>
            </div>
          </div>
          {/* Visual placeholder */}
          <div className="bg-gradient-to-br from-ngc-navy/5 to-ngc-blue/10 rounded-2xl p-8 border border-ngc-blue/10 h-72 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-ngc-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                  <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="12" r="3" fill="#F0B849"/>
                </svg>
              </div>
              <p className="text-ngc-navy font-display font-bold text-xl tracking-widest">NGC</p>
              <p className="text-ngc-muted text-xs mt-1">National Grid Company</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-ngc-navy rounded-2xl p-8 text-white">
            <div className="w-10 h-10 rounded bg-ngc-blue/30 flex items-center justify-center mb-5">
              <Target size={20} className="text-ngc-sky" />
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-white/70 leading-relaxed">
              To develop, operate and maintain a safe, reliable, efficient and sustainable national electricity transmission system that supports the economic development of Pakistan and enables a cost-effective transition to a clean energy future.
            </p>
          </div>
          <div className="bg-ngc-blue rounded-2xl p-8 text-white">
            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center mb-5">
              <Eye size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-white/70 leading-relaxed">
              To be the backbone of a modern, resilient, and decarbonised power system in Pakistan — recognised for operational excellence, technological innovation, and a commitment to service that empowers every Pakistani.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:border-ngc-blue/30 group">
                <div className="w-12 h-12 rounded-full bg-ngc-blue/8 flex items-center justify-center mx-auto mb-4 group-hover:bg-ngc-blue/15 transition-colors">
                  <Icon size={20} className="text-ngc-blue" />
                </div>
                <h4 className="font-semibold text-ngc-navy mb-2">{title}</h4>
                <p className="text-ngc-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-1">People</p>
              <h2 className="section-title">Leadership Team</h2>
            </div>
            <Link to="/about/leadership" className="btn-outline text-xs py-2">Full Directory <ArrowRight size={13}/></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEADERSHIP.map(({ name, title, dept }) => (
              <div key={name} className="card p-4 text-center group">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ngc-navy to-ngc-blue flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                </div>
                <p className="text-xs font-semibold text-ngc-navy leading-snug">{name}</p>
                <p className="text-[10px] text-ngc-muted mt-1 leading-tight">{title}</p>
                <span className="mt-2 inline-block text-[9px] bg-ngc-blue/10 text-ngc-blue px-2 py-0.5 rounded-full font-medium">{dept}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
