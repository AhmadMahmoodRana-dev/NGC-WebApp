import { Link } from 'react-router-dom'
import {
  FileText, Briefcase, Image, BarChart2, Users, ShieldCheck,
  Download, Bell, ArrowRight,
} from 'lucide-react'

const QUICK_LINKS = [
  { icon: FileText,   label: 'Tenders',         sub: 'Active procurement',    href: '/publications/tenders',       color: 'bg-amber-50 text-amber-600 border-amber-100'  },
  { icon: Download,   label: 'Annual Reports',  sub: 'FY 2025–26 & archive',  href: '/publications/annual-reports', color: 'bg-blue-50 text-blue-600 border-blue-100'     },
  { icon: Briefcase,  label: 'Careers',         sub: 'Job openings',          href: '/careers',                     color: 'bg-green-50 text-green-600 border-green-100'  },
  { icon: Image,      label: 'Media Gallery',   sub: 'Photos & videos',       href: '/media/gallery',               color: 'bg-purple-50 text-purple-600 border-purple-100'},
  { icon: BarChart2,  label: 'Performance',     sub: 'System statistics',     href: '/operations/grid',             color: 'bg-sky-50 text-sky-600 border-sky-100'        },
  { icon: Users,      label: 'Stakeholders',    sub: 'Inquiry & feedback',    href: '/contact',                     color: 'bg-indigo-50 text-indigo-600 border-indigo-100'},
  { icon: ShieldCheck,label: 'Governance',      sub: 'Policies & compliance', href: '/about/governance',            color: 'bg-red-50 text-red-600 border-red-100'        },
  { icon: Bell,       label: 'Alerts',          sub: 'Crisis & updates',      href: '/media/announcements',         color: 'bg-orange-50 text-orange-600 border-orange-100'},
]

export default function QuickAccess() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-1">Navigate Quickly</p>
            <h2 className="section-title">Key Resources & Services</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {QUICK_LINKS.map(({ icon: Icon, label, sub, href, color }) => (
            <Link
              key={href}
              to={href}
              className={`card flex flex-col items-center text-center p-4 gap-2 border rounded-lg hover:shadow-md transition-all duration-200 group ${color}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/70 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800 leading-tight">{label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 hidden sm:block">{sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
