import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Image, Bell, Users, Settings,
  LogOut, PlusCircle, Eye, Edit2, Trash2, CheckCircle,
  Clock, Edit2 as EditIcon, BarChart2, Activity,
  ChevronRight, Menu, AlertCircle, Loader2, RefreshCw,
} from 'lucide-react'
import { contentAPI, publicationsAPI, mediaAPI, authAPI, getUser, clearTokens } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const STATUS_COLORS = {
  published:        'bg-green-100 text-green-700',
  in_review:        'bg-blue-100 text-blue-700',
  draft:            'bg-gray-100 text-gray-600',
  approved:         'bg-amber-100 text-amber-700',
}
const STATUS_LABELS = { published:'Published', in_review:'In Review', draft:'Draft', approved:'Approved' }
const WORKFLOW_STEPS = ['draft','in_review','approved','published']
const WORKFLOW_LABELS = { draft:'Draft', in_review:'In Review', approved:'Approved', published:'Published' }

const NAV_ITEMS = [
  { icon: LayoutDashboard, label:'Dashboard',    href:'/cms/dashboard', active:true },
  { icon: FileText,        label:'Content',       href:'/cms/content'               },
  { icon: Image,           label:'Media Library', href:'/cms/media'                 },
  { icon: Bell,            label:'Announcements', href:'/cms/announcements'         },
  { icon: Users,           label:'Users & Roles', href:'/cms/users'                 },
  { icon: BarChart2,       label:'Analytics',     href:'/cms/analytics'             },
  { icon: Settings,        label:'Settings',      href:'/cms/settings'              },
]

export default function CMSDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [content, setContent]         = useState([])
  const [auditLog, setAuditLog]       = useState([])
  const [stats, setStats]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const user = getUser()
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [contentRes, pubRes, mediaRes] = await Promise.all([
          contentAPI.getAll({ limit: 5 }),
          publicationsAPI.getAll({ limit: 100 }),
          mediaAPI.getAll({ limit: 100 }),
        ])

        setContent(contentRes.data || [])

        const allContent = contentRes.data || []
        const published  = (contentRes.total || 0)
        const inReview   = allContent.filter(c => c.status === 'in_review').length
        const drafts     = allContent.filter(c => c.status === 'draft').length
        const mediaCount = mediaRes.total || 0

        setStats({ published, inReview, drafts, mediaCount })

        // Try audit log (admin only)
        try {
          const auditRes = await authAPI.auditLog()
          setAuditLog((auditRes.data || []).slice(0, 4))
        } catch { setAuditLog([]) }

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    clearTokens()
    navigate('/cms/login')
  }

  const USER_DISPLAY = user || { name: 'CMS User', role: 'editor', department: 'PR', initials: 'U' }
  const initials = USER_DISPLAY.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U'

  const workflowCounts = content.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 flex font-body text-sm">
      {/* Sidebar */}
      <aside className={`${sidebarOpen?'w-56':'w-16'} bg-ngc-navy flex flex-col transition-all duration-300 flex-shrink-0 min-h-screen`}>
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${sidebarOpen?'':'justify-center'}`}>
          <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
              <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round"/>
              <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="24" cy="12" r="3" fill="#F0B849"/>
            </svg>
          </div>
          {sidebarOpen && (<div><div className="text-white font-bold text-sm tracking-widest font-display">NGC</div><div className="text-white/40 text-[9px] uppercase tracking-wider">CMS Portal</div></div>)}
        </div>

        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link key={href} to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative
                ${active?'bg-ngc-blue text-white':'text-white/60 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={16} className="flex-shrink-0"/>
              {sidebarOpen && <span className="text-xs font-medium">{label}</span>}
              {!sidebarOpen && <div className="absolute left-16 bg-ngc-navy text-white text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50 shadow-lg">{label}</div>}
            </Link>
          ))}
        </nav>

        <div className={`border-t border-white/10 p-3 flex items-center gap-3 ${sidebarOpen?'':'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-ngc-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          {sidebarOpen && (<div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{USER_DISPLAY.name}</p><p className="text-white/40 text-[10px] truncate">{USER_DISPLAY.role} — {USER_DISPLAY.department}</p></div>)}
          {sidebarOpen && (<button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors"><LogOut size={13}/></button>)}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(s=>!s)} className="text-gray-500 hover:text-gray-800 p-1 rounded hover:bg-gray-100"><Menu size={18}/></button>
            <div>
              <h1 className="font-semibold text-ngc-navy text-base">Dashboard</h1>
              <p className="text-xs text-ngc-muted">Welcome back, {USER_DISPLAY.name?.split(' ')[0] || 'User'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs bg-ngc-blue/10 text-ngc-blue px-2.5 py-1 rounded-full font-medium">{USER_DISPLAY.department} Department</span>
            <Link to="/cms/content" className="btn-primary text-xs py-2"><PlusCircle size={13}/> New Content</Link>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-xs">
              <AlertCircle size={14}/> {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? Array(4).fill(0).map((_,i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded mb-3 w-2/3"/>
                <div className="h-7 bg-gray-100 rounded w-1/2"/>
              </div>
            )) : [
              { label:'Published',   value: stats?.published  ?? '…', Icon:CheckCircle, color:'text-green-500' },
              { label:'In Review',   value: stats?.inReview   ?? '…', Icon:Clock,       color:'text-amber-500' },
              { label:'Drafts',      value: stats?.drafts     ?? '…', Icon:EditIcon,    color:'text-blue-500'  },
              { label:'Media Files', value: stats?.mediaCount ?? '…', Icon:Image,       color:'text-purple-500'},
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-ngc-muted">{label}</p>
                  <Icon size={16} className={color}/>
                </div>
                <p className="text-2xl font-bold text-ngc-navy font-display">{value}</p>
              </div>
            ))}
          </div>

          {/* Workflow pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2">
              <Activity size={15} className="text-ngc-blue"/> Content Workflow Pipeline
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`rounded-lg px-4 py-3 text-xs font-medium border-2 min-w-[120px] text-center
                    ${i===0?'border-gray-200 bg-gray-50 text-gray-600':i===1?'border-blue-200 bg-blue-50 text-blue-700':i===2?'border-amber-200 bg-amber-50 text-amber-700':'border-green-200 bg-green-50 text-green-700'}`}>
                    {WORKFLOW_LABELS[step]}
                    <div className="text-[10px] font-normal mt-0.5 opacity-70">
                      {loading ? '…' : `${workflowCounts[step] || 0} item${workflowCounts[step]!==1?'s':''}`}
                    </div>
                  </div>
                  {i < WORKFLOW_STEPS.length-1 && <ChevronRight size={16} className="text-gray-300 flex-shrink-0"/>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-ngc-navy flex items-center gap-2"><FileText size={15} className="text-ngc-blue"/> Recent Content</h3>
              <Link to="/cms/content" className="text-xs text-ngc-blue hover:underline flex items-center gap-1">View All <ChevronRight size={12}/></Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-ngc-muted text-xs">
                <Loader2 size={14} className="animate-spin text-ngc-blue"/> Loading…
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100">
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium hidden md:table-cell">Author</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {content.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-ngc-muted text-xs">No content yet.</td></tr>}
                    {content.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50/50 group">
                        <td className="px-5 py-3.5 text-xs font-medium text-ngc-navy max-w-[200px] truncate">{item.title}</td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{item.type?.replace('_',' ')}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`badge text-[10px] ${STATUS_COLORS[item.status]||'bg-gray-100 text-gray-600'}`}>{STATUS_LABELS[item.status]||item.status}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{item.author}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100">
                            <button className="text-ngc-blue hover:text-ngc-navy" title="View"><Eye size={13}/></button>
                            <button className="text-ngc-blue hover:text-ngc-navy" title="Edit"><Edit2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Audit log */}
          {auditLog.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2">
                <AlertCircle size={15} className="text-ngc-blue"/> Recent Audit Log
              </h3>
              <div className="space-y-2">
                {auditLog.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.action?.includes('SUCCESS')?'bg-green-500':entry.action?.includes('FAIL')?'bg-red-400':'bg-blue-400'}`}/>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">{entry.action}</span>
                    <span className="text-xs text-ngc-navy flex-1 truncate">{entry.detail}</span>
                    <span className="text-[10px] text-ngc-muted flex-shrink-0">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
