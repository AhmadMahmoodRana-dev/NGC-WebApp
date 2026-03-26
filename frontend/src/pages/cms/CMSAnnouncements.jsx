import { useState } from 'react'
import {
  Bell, PlusCircle, Edit2, Trash2, Eye,
  AlertTriangle, Info, CheckCircle, Megaphone, X,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const ANNOUNCEMENTS = [
  { id: 1, title: 'NEPRA Grid Code Compliance Deadline — 31 March 2026',   type: 'Urgent',  status: 'Active',   audience: 'All Staff',           date: '20 Mar 2026', expiry: '31 Mar 2026', body: 'All operational teams must complete NEPRA grid code compliance documentation before the deadline.' },
  { id: 2, title: 'Q3 FY2026 Town Hall — 28 March, 10:00 AM',              type: 'Event',   status: 'Active',   audience: 'All Staff',           date: '18 Mar 2026', expiry: '28 Mar 2026', body: 'The quarterly town hall will be held in the main auditorium. Live stream available for regional offices.' },
  { id: 3, title: 'New Procurement Portal Launch',                          type: 'Info',    status: 'Active',   audience: 'Procurement & Finance',date: '15 Mar 2026', expiry: '15 Apr 2026', body: 'The upgraded e-procurement portal is now live. Training sessions are available on the intranet.' },
  { id: 4, title: 'Load Shedding Suspension — Eid Holidays',               type: 'Public',  status: 'Scheduled',audience: 'Public Website',      date: '12 Mar 2026', expiry: '05 Apr 2026', body: 'Load shedding will be suspended during Eid holidays in residential areas. Industrial zones retain normal schedules.' },
  { id: 5, title: 'IT System Maintenance — 22 March, 12:00–3:00 AM',       type: 'Urgent',  status: 'Expired',  audience: 'All Staff',           date: '10 Mar 2026', expiry: '22 Mar 2026', body: 'Planned maintenance window for SAP and email systems.' },
  { id: 6, title: 'Health & Safety Week — March 24–28',                    type: 'Event',   status: 'Active',   audience: 'All Staff',           date: '08 Mar 2026', expiry: '28 Mar 2026', body: 'Annual Health & Safety awareness week. Mandatory sessions listed on the HR portal.' },
  { id: 7, title: 'Tender Publication: NGC/2026/T-041',                    type: 'Public',  status: 'Active',   audience: 'Public Website',      date: '05 Mar 2026', expiry: '10 Apr 2026', body: 'Open tender for 500kV transformer procurement. Full details and bid documents on the Tenders page.' },
]

const TYPE_STYLES = {
  Urgent: { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200', Icon: AlertTriangle },
  Event:  { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200', Icon: Megaphone    },
  Info:   { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200', Icon: Info          },
  Public: { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200', Icon: CheckCircle  },
}

const STATUS_COLORS = {
  Active:    'bg-green-100 text-green-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Expired:   'bg-gray-100 text-gray-400',
}

export default function CMSAnnouncements() {
  const [items, setItems]         = useState(ANNOUNCEMENTS)
  const [filter, setFilter]       = useState('All')
  const [expanded, setExpanded]   = useState(null)
  const [showModal, setShowModal] = useState(false)

  const filters = ['All', 'Urgent', 'Event', 'Info', 'Public']
  const filtered = filter === 'All' ? items : items.filter(a => a.type === filter)

  const activeCount    = items.filter(a => a.status === 'Active').length
  const scheduledCount = items.filter(a => a.status === 'Scheduled').length
  const urgentCount    = items.filter(a => a.type === 'Urgent' && a.status === 'Active').length

  return (
    <CMSLayout
      title="Announcements"
      subtitle="Manage internal and public announcements"
      action={
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2">
          <PlusCircle size={13} /> New Announcement
        </button>
      }
    >
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Active',    value: activeCount,    color: 'text-green-500', bg: 'bg-green-50'  },
          { label: 'Scheduled', value: scheduledCount, color: 'text-blue-500',  bg: 'bg-blue-50'   },
          { label: 'Urgent',    value: urgentCount,    color: 'text-red-500',   bg: 'bg-red-50'    },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-ngc-muted mb-1">{label}</p>
            <p className={`text-2xl font-bold font-display ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
              ${filter === f ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map(item => {
          const { bg, text, border, Icon } = TYPE_STYLES[item.type] || TYPE_STYLES.Info
          const isOpen = expanded === item.id
          return (
            <div key={item.id} className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-all ${border}`}>
              <div className="px-5 py-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon size={14} className={text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-ngc-navy truncate flex-1">{item.title}</p>
                    <span className={`badge text-[10px] ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${bg} ${text}`}>{item.type}</span>
                  </div>
                  <div className="flex gap-3 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-ngc-muted">Posted: {item.date}</span>
                    <span className="text-[11px] text-ngc-muted">Expires: {item.expiry}</span>
                    <span className="text-[11px] text-ngc-blue font-medium">{item.audience}</span>
                  </div>
                  {isOpen && (
                    <p className="mt-3 text-xs text-ngc-muted leading-relaxed border-t border-gray-100 pt-3">{item.body}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setExpanded(isOpen ? null : item.id)}
                    className="text-ngc-blue hover:text-ngc-navy transition-colors" title="Preview">
                    <Eye size={14} />
                  </button>
                  <button className="text-ngc-blue hover:text-ngc-navy transition-colors" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setItems(prev => prev.filter(a => a.id !== item.id))}
                    className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ngc-navy text-base">New Announcement</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Title</label>
                <input className="input-field text-xs py-2" placeholder="Announcement title…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Type</label>
                  <select className="input-field text-xs py-2">
                    <option>Urgent</option><option>Event</option><option>Info</option><option>Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Audience</label>
                  <select className="input-field text-xs py-2">
                    <option>All Staff</option><option>Public Website</option><option>Management</option><option>Procurement & Finance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Message</label>
                <textarea className="input-field text-xs py-2 h-24 resize-none" placeholder="Announcement body…" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Publish Date</label>
                  <input type="date" className="input-field text-xs py-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Expiry Date</label>
                  <input type="date" className="input-field text-xs py-2" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary text-xs py-1.5 px-4">Publish</button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
