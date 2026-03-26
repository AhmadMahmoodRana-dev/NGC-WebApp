import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Share2, Rss, Video, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ngc-navy text-white/80">
      {/* Top CTA Strip */}
      <div className="bg-ngc-blue py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white font-medium text-sm">
            Stay informed — subscribe to NGC's latest news and publications.
          </p>
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded text-sm text-gray-800 bg-white w-56 focus:outline-none focus:ring-2 focus:ring-ngc-gold"
            />
            <button type="submit" className="bg-ngc-gold hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
                  <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="12" r="3" fill="#F0B849"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-white text-lg font-bold tracking-widest">NGC</div>
                <div className="text-[9px] text-white/50 tracking-widest uppercase">National Grid Company</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-5">
              Building Pakistan's power future through reliable, efficient and sustainable grid transmission infrastructure.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Share2, href: '#', label: 'Facebook' },
                { Icon: Rss,    href: '#', label: 'Twitter'  },
                { Icon: Video,   href: '#', label: 'LinkedIn' },
                { Icon: Video,  href: '#', label: 'YouTube'  },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded bg-white/10 hover:bg-ngc-blue flex items-center justify-center transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'About NGC',          href: '/about'                      },
                { label: 'Leadership',          href: '/about/leadership'           },
                { label: 'Transmission Projects',href:'/operations/projects'        },
                { label: 'Press Releases',      href: '/media/press-releases'       },
                { label: 'Annual Reports',      href: '/publications/annual-reports'},
                { label: 'Current Tenders',     href: '/publications/tenders'       },
                { label: 'Career Opportunities',href: '/careers'                    },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-white/60 hover:text-ngc-gold-light transition-colors flex items-center gap-1 group">
                    <span className="w-1 h-1 rounded-full bg-ngc-gold/40 group-hover:bg-ngc-gold transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
              Resources
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy',      href: '/privacy-policy'   },
                { label: 'Cookie Policy',       href: '/cookie-policy'    },
                { label: 'Disclaimer',          href: '/disclaimer'       },
                { label: 'Accessibility',       href: '/accessibility'    },
                { label: 'Sitemap',             href: '/sitemap'          },
                { label: 'Staff Portal',        href: '/cms/login'        },
                { label: 'WAPDA',               href: 'https://wapda.gov.pk', external: true },
                { label: 'NEPRA',               href: 'https://nepra.org.pk', external: true },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    to={!l.external ? l.href : '#'}
                    onClick={l.external ? () => window.open(l.href, '_blank') : undefined}
                    className="text-sm text-white/60 hover:text-ngc-gold-light transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-ngc-gold/40 group-hover:bg-ngc-gold transition-colors" />
                    {l.label}
                    {l.external && <ArrowUpRight size={10} className="opacity-50" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-white/60">
                <MapPin size={14} className="text-ngc-gold flex-shrink-0 mt-0.5" />
                <span>NGC House, Shahrah-e-Quaid-e-Azam, Lahore, Pakistan</span>
              </li>
              <li>
                <a href="tel:+924235205001" className="flex gap-3 text-sm text-white/60 hover:text-ngc-gold-light transition-colors">
                  <Phone size={14} className="text-ngc-gold flex-shrink-0 mt-0.5" />
                  +92-42-3520-5001
                </a>
              </li>
              <li>
                <a href="mailto:info@ngc.gov.pk" className="flex gap-3 text-sm text-white/60 hover:text-ngc-gold-light transition-colors">
                  <Mail size={14} className="text-ngc-gold flex-shrink-0 mt-0.5" />
                  info@ngc.gov.pk
                </a>
              </li>
            </ul>
            <div className="mt-5 p-3 bg-white/5 border border-white/10 rounded text-xs text-white/50">
              <p className="font-medium text-white/70 mb-1">Emergency Control Room</p>
              <p>24/7 Helpline: +92-42-3520-5009</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40">
          <p>© {year} National Grid Company (NGC). All rights reserved. Government of Pakistan.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-white/70 transition-colors">Cookies</Link>
            <Link to="/accessibility" className="hover:text-white/70 transition-colors">Accessibility</Link>
            <Link to="/sitemap" className="hover:text-white/70 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
