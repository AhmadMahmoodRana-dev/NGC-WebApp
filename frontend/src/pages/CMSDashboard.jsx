import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Image, Bell, Users, Settings,
  LogOut, PlusCircle, Eye, Edit2, Trash2, CheckCircle,
  Clock, AlertCircle, BarChart2, TrendingUp, Activity,
  ChevronRight, Menu, X,
} from 'lucide-react'

const USER = { name: 'Khalid Mehmood', role: 'Editor — PR Department', dept: 'PR', initials: 'KM' }

const CONTENT_ITEMS = [
  { id: 1, title: 'Q2 FY2026 Performance Report',          type: 'Report',       status: 'Published',  date: '20 Mar 2026', author: 'Khalid M.' },
  { id: 2, title: 'NGC Signs MOU with Chinese Partners',   type: 'Press Release',status: 'Published',  date: '18 Mar 2026', author: 'Sadia N.'  },
  { id: 3, title: '500kV Corridor — Photo Gallery Update', type: 'Gallery',      status: 'In Review',  date: '17 Mar 2026', author: 'Tariq S.'  },
  { id: 4, title: 'Tarbela–Peshawar Tender NGC/2026/T-041',type: 'Tender',       status: 'Draft',      date: '16 Mar 2026', author: 'Asim R.'   },
  { id: 5, title: 'Annual Report 2024-25 — Final',         type: 'Report',       status: 'Pending Approval', date: '14 Mar 2026', author: 'Nadia A.' },
]

const STATUS_COLORS = {
  'Published':       'bg-green-100 text-green-700',
  'In Review':       'bg-blue-100 text-blue-700',
  'Draft':           'bg-gray-100 text-gray-600',
  'Pending Approval':'bg-amber-100 text-amber-700',
}

const WORKFLOW_STEPS = ['Draft', 'In Review', 'Pending Approval', 'Published']

const STATS_CARDS = [
  { label: 'Published Items',   value: '142',  change: '+8 this month',  Icon: CheckCircle, color: 'text-green-500'  },
  { label: 'Pending Review',    value: '7',    change: '3 urgent',       Icon: Clock,       color: 'text-amber-500' },
  { label: 'Draft Items',       value: '12',   change: '4 by you',       Icon: Edit2,       color: 'text-blue-500'  },
  { label: 'Media Files',       value: '380+', change: '+24 this week',  Icon: Image,       color: 'text-purple-500'},
]

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   href: '/cms/dashboard', active: true  },
  { icon: FileText,        label: 'Content',      href: '/cms/content'                  },
  { icon: Image,           label: 'Media Library',href: '/cms/media'                    },
  { icon: Bell,            label: 'Announcements',href: '/cms/announcements'            },
  { icon: Users,           label: 'Users & Roles',href: '/cms/users'                    },
  { icon: BarChart2,       label: 'Analytics',    href: '/cms/analytics'                },
  { icon: Settings,        label: 'Settings',     href: '/cms/settings'                 },
]

export default function CMSDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem]   = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 flex font-body text-sm">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-ngc-navy flex flex-col transition-all duration-300 flex-shrink-0 min-h-screen`}>
        {/* Logo */}
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

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                ${active ? 'bg-ngc-blue text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-xs font-medium">{label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-16 bg-ngc-navy text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 shadow-lg">
                  {label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User */}
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

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(s => !s)} className="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-gray-100">
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-semibold text-ngc-navy text-base">Dashboard</h1>
              <p className="text-xs text-ngc-muted">Welcome back, {USER.name.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs bg-ngc-blue/10 text-ngc-blue px-2.5 py-1 rounded-full font-medium">
              {USER.dept} Department
            </span>
            <Link to="/cms/content/new" className="btn-primary text-xs py-2">
              <PlusCircle size={13} /> New Content
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS_CARDS.map(({ label, value, change, Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-ngc-muted">{label}</p>
                  <Icon size={16} className={color} />
                </div>
                <p className="text-2xl font-bold text-ngc-navy font-display">{value}</p>
                <p className="text-xs text-ngc-muted mt-1">{change}</p>
              </div>
            ))}
          </div>

          {/* Workflow overview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2">
              <Activity size={15} className="text-ngc-blue" /> Content Workflow Pipeline
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`rounded-lg px-4 py-3 text-xs font-medium border-2 min-w-[120px] text-center
                    ${i === 0 ? 'border-gray-200 bg-gray-50 text-gray-600'
                    : i === 1 ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : i === 2 ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-green-200 bg-green-50 text-green-700'}`}>
                    {step}
                    <div className="text-[10px] font-normal mt-0.5 opacity-70">
                      {i === 0 ? '4 items' : i === 1 ? '3 items' : i === 2 ? '2 items' : '142 items'}
                    </div>
                  </div>
                  {i < WORKFLOW_STEPS.length - 1 && <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-ngc-navy flex items-center gap-2">
                <FileText size={15} className="text-ngc-blue" /> Recent Content
              </h3>
              <Link to="/cms/content" className="text-xs text-ngc-blue hover:underline flex items-center gap-1">
                View All <ChevronRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Author</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {CONTENT_ITEMS.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-3.5 text-xs font-medium text-ngc-navy max-w-[200px] truncate">{item.title}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`badge text-[10px] ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{item.date}</td>
                      <td className="px-4 py-3.5 text-xs text-ngc-muted hidden lg:table-cell">{item.author}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="text-ngc-blue hover:text-ngc-navy transition-colors" title="View">
                            <Eye size={13} />
                          </button>
                          <button className="text-ngc-blue hover:text-ngc-navy transition-colors" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2">
              <AlertCircle size={15} className="text-ngc-blue" /> Recent Audit Log
            </h3>
            <div className="space-y-2">
              {[
                { action: 'Published', item: 'Q2 FY2026 Performance Report', user: 'Khalid M.', time: '2 hours ago', color: 'bg-green-500' },
                { action: 'Approved',  item: 'MOU Press Release',            user: 'CEO Office', time: '4 hours ago', color: 'bg-blue-500'  },
                { action: 'Uploaded',  item: '500kV Corridor Photos (12)',    user: 'Tariq S.',   time: 'Yesterday',   color: 'bg-purple-500'},
                { action: 'Draft',     item: 'Tender NGC/2026/T-041',         user: 'Asim R.',    time: 'Yesterday',   color: 'bg-gray-400'  },
              ].map(({ action, item, user, time, color }) => (
                <div key={item} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${color} bg-opacity-10 text-gray-700`}>{action}</span>
                  <span className="text-xs text-ngc-navy flex-1 truncate">{item}</span>
                  <span className="text-[10px] text-ngc-muted hidden sm:inline">{user}</span>
                  <span className="text-[10px] text-ngc-muted flex-shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
