import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Search, Menu, X, ChevronDown, Globe, Bell, Phone,
  Mail, ExternalLink,
} from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'About NGC',
    href: '/about',
    children: [
      { label: 'Overview & Mission',    href: '/about' },
      { label: 'Leadership & Board',    href: '/about/leadership' },
      { label: 'Organizational Chart',  href: '/about/org-chart' },
      { label: 'Corporate Governance',  href: '/about/governance' },
      { label: 'History & Milestones',  href: '/about/history' },
    ],
  },
  {
    label: 'Operations',
    href: '/operations',
    children: [
      { label: 'Grid Network',          href: '/operations/grid' },
      { label: 'Transmission Projects', href: '/operations/projects' },
      { label: 'System Control',        href: '/operations/system-control' },
      { label: 'Load Dispatch',         href: '/operations/dispatch' },
    ],
  },
  {
    label: 'Media & PR',
    href: '/media',
    children: [
      { label: 'Press Releases',        href: '/media/press-releases' },
      { label: 'Photo Gallery',         href: '/media/gallery' },
      { label: 'Videos',                href: '/media/videos' },
      { label: 'Media Kits',            href: '/media/kits' },
      { label: 'Announcements',         href: '/media/announcements' },
    ],
  },
  {
    label: 'Publications',
    href: '/publications',
    children: [
      { label: 'Annual Reports',        href: '/publications/annual-reports' },
      { label: 'Policies & Regulations',href: '/publications/policies' },
      { label: 'Tenders',               href: '/publications/tenders' },
      { label: 'Research Papers',       href: '/publications/research' },
    ],
  },
  { label: 'Careers',     href: '/careers' },
  { label: 'Contact',     href: '/contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeDropdown, setActive]   = useState(null)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lang, setLang]               = useState('EN')
  const searchRef = useRef(null)
  const navigate  = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (!e.target.closest('.nav-dropdown-area')) setActive(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = e => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* ── Utility Bar ── */}
      <div className="bg-ngc-navy border-b-2 border-ngc-gold text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-1.5 flex-wrap gap-2">
          <div className="flex items-center gap-4 text-white/70">
            <a href="tel:+924235205001" className="flex items-center gap-1.5 hover:text-ngc-gold-light transition-colors">
              <Phone size={11} /> +92-42-3520-5001
            </a>
            <a href="mailto:info@ngc.gov.pk" className="flex items-center gap-1.5 hover:text-ngc-gold-light transition-colors">
              <Mail size={11} /> info@ngc.gov.pk
            </a>
          </div>
          <div className="flex items-center gap-3 text-white/70">
            <Link to="/media/announcements" className="flex items-center gap-1 hover:text-ngc-gold-light transition-colors">
              <Bell size={11} /> Alerts
            </Link>
            <Link to="/cms/login" className="hover:text-ngc-gold-light transition-colors">Staff Portal</Link>
            <button
              onClick={() => setLang(l => l === 'EN' ? 'UR' : 'EN')}
              className="flex items-center gap-1 border border-white/20 rounded px-2 py-0.5 hover:border-ngc-gold/60 hover:text-ngc-gold-light transition-colors"
            >
              <Globe size={11} />
              {lang === 'EN' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-12 h-12 bg-ngc-navy rounded flex items-center justify-center overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-ngc-gold" />
              <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
                <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="12" r="3" fill="#F0B849"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl font-bold text-ngc-navy tracking-widest">NGC</div>
              <div className="text-[9px] font-medium text-ngc-muted tracking-widest uppercase">National Grid Company</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 nav-dropdown-area">
            {NAV_ITEMS.map(item => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setActive(activeDropdown === item.label ? null : item.label)}
                      className={`nav-link flex items-center gap-1 ${activeDropdown === item.label ? 'text-ngc-blue bg-blue-50' : ''}`}
                    >
                      {item.label}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 border-t-2 border-t-ngc-blue shadow-xl rounded-b-lg overflow-hidden animate-slide-down z-50">
                        {item.children.map(child => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            onClick={() => setActive(null)}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm border-b border-gray-50 last:border-0 transition-colors
                               ${isActive ? 'text-ngc-blue bg-blue-50 font-medium' : 'text-gray-700 hover:text-ngc-blue hover:bg-blue-50'}`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'text-ngc-blue bg-blue-50 font-semibold' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search NGC..."
                  className="border border-gray-200 rounded-l px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-ngc-sky"
                />
                <button type="submit" className="bg-ngc-blue text-white px-3 py-1.5 rounded-r hover:bg-ngc-navy transition-colors">
                  <Search size={14} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 text-gray-400 hover:text-gray-700">
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 text-sm text-ngc-muted bg-gray-50 border border-gray-200 rounded px-3 py-1.5 hover:border-ngc-sky transition-colors"
              >
                <Search size={14} /> Search
              </button>
            )}

            {/* Tenders CTA */}
            <Link
              to="/publications/tenders"
              className="hidden md:inline-flex btn-gold text-xs py-2 px-3"
            >
              <ExternalLink size={12} /> Tenders
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
            {NAV_ITEMS.map(item => (
              <div key={item.label}>
                {item.children ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 border-b border-gray-50 cursor-pointer list-none hover:bg-gray-50">
                      {item.label}
                      <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    {item.children.map(child => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block pl-8 pr-4 py-2.5 text-sm border-b border-gray-50
                           ${isActive ? 'text-ngc-blue font-medium' : 'text-gray-600 hover:text-ngc-blue'}`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </details>
                ) : (
                  <NavLink
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm font-medium border-b border-gray-50
                       ${isActive ? 'text-ngc-blue' : 'text-gray-800 hover:text-ngc-blue hover:bg-gray-50'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
            <div className="px-4 py-3 flex gap-2">
              <Link to="/publications/tenders" onClick={() => setMobileOpen(false)} className="btn-gold flex-1 justify-center text-xs">
                Current Tenders
              </Link>
              <Link to="/cms/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 justify-center text-xs">
                Staff Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
