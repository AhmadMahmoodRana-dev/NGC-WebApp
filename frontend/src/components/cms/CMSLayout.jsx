import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Image, Bell, Users, Settings,
  LogOut, BarChart2, Menu,
} from 'lucide-react'

const USER = { name: 'Khalid Mehmood', role: 'Editor — PR Department', dept: 'PR', initials: 'KM' }

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/cms/dashboard'    },
  { icon: FileText,        label: 'Content',       href: '/cms/content'      },
  { icon: Image,           label: 'Media Library', href: '/cms/media'        },
  { icon: Bell,            label: 'Announcements', href: '/cms/announcements'},
  { icon: Users,           label: 'Users & Roles', href: '/cms/users'        },
  { icon: BarChart2,       label: 'Analytics',     href: '/cms/analytics'    },
  { icon: Settings,        label: 'Settings',      href: '/cms/settings'     },
]

export default function CMSLayout({ children, title, subtitle, action }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex font-body text-sm">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-ngc-navy flex flex-col transition-all duration-300 flex-shrink-0 min-h-screen`}>
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
              <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round"/>
              <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="12" r="3" fill="#F0B849"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm tracking-widest font-display">NGC</div>
              <div className="text-white/40 text-[9px] uppercase tracking-wider">CMS Portal</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = location.pathname === href
            return (
              <Link key={href} to={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative
                  ${active ? 'bg-ngc-blue text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={16} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-xs font-medium">{label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-16 bg-ngc-navy text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 shadow-lg">
                    {label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`border-t border-white/10 p-3 flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-ngc-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{USER.initials}</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{USER.name}</p>
              <p className="text-white/40 text-[10px] truncate">{USER.role}</p>
            </div>
          )}
          {sidebarOpen && (
            <Link to="/cms/login" className="text-white/40 hover:text-white transition-colors">
              <LogOut size={13} />
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(s => !s)} className="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-gray-100">
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-semibold text-ngc-navy text-base">{title}</h1>
              {subtitle && <p className="text-xs text-ngc-muted">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs bg-ngc-blue/10 text-ngc-blue px-2.5 py-1 rounded-full font-medium">
              {USER.dept} Department
            </span>
            {action}
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
