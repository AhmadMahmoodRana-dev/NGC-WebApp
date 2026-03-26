import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle, Search, Filter, Eye, Edit2, Trash2,
  ChevronDown, FileText, Download, MoreHorizontal,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const ALL_ITEMS = [
  { id: 1,  title: 'Q2 FY2026 Performance Report',              type: 'Report',        status: 'Published',        date: '20 Mar 2026', author: 'Khalid M.',  views: 1420 },
  { id: 2,  title: 'NGC Signs MOU with Chinese Partners',        type: 'Press Release', status: 'Published',        date: '18 Mar 2026', author: 'Sadia N.',   views: 3810 },
  { id: 3,  title: '500kV Corridor — Photo Gallery Update',      type: 'Gallery',       status: 'In Review',        date: '17 Mar 2026', author: 'Tariq S.',   views: 0    },
  { id: 4,  title: 'Tarbela–Peshawar Tender NGC/2026/T-041',     type: 'Tender',        status: 'Draft',            date: '16 Mar 2026', author: 'Asim R.',    views: 0    },
  { id: 5,  title: 'Annual Report 2024-25 — Final',              type: 'Report',        status: 'Pending Approval', date: '14 Mar 2026', author: 'Nadia A.',   views: 0    },
  { id: 6,  title: 'Grid Expansion — Multan–Lahore Corridor',    type: 'News',          status: 'Published',        date: '12 Mar 2026', author: 'Khalid M.',  views: 2100 },
  { id: 7,  title: 'Load Shedding Schedule Update – March',      type: 'Announcement',  status: 'Published',        date: '10 Mar 2026', author: 'Sadia N.',   views: 8760 },
  { id: 8,  title: 'CEO Message — National Energy Day',          type: 'Press Release', status: 'Published',        date: '07 Mar 2026', author: 'CEO Office', views: 5200 },
  { id: 9,  title: 'Procurement Policy Revision 2026',           type: 'Policy',        status: 'Draft',            date: '05 Mar 2026', author: 'Asim R.',    views: 0    },
  { id: 10, title: 'Research: Smart Grid Pilot — Faisalabad',    type: 'Research',      status: 'In Review',        date: '02 Mar 2026', author: 'Tariq S.',   views: 0    },
]

const STATUS_COLORS = {
  'Published':        'bg-green-100 text-green-700',
  'In Review':        'bg-blue-100 text-blue-700',
  'Draft':            'bg-gray-100 text-gray-600',
  'Pending Approval': 'bg-amber-100 text-amber-700',
}

const TYPES = ['All', 'Report', 'Press Release', 'Gallery', 'Tender', 'News', 'Announcement', 'Policy', 'Research']

export default function CMSContent() {
  const [search, setSearch]       = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [items, setItems]           = useState(ALL_ITEMS)
  const [showModal, setShowModal]   = useState(false)

  const filtered = items.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter === 'All' || i.type === typeFilter
    return matchSearch && matchType
  })

  const handleDelete = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <CMSLayout
      title="Content Management"
      subtitle={`${items.length} total items`}
      action={
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2">
          <PlusCircle size={13} /> New Content
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9 py-2 text-xs"
            placeholder="Search content…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
                ${typeFilter === t ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Author</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell text-right">Views</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-ngc-muted text-xs">No content matches your filters.</td></tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-3.5 text-xs font-medium text-ngc-navy max-w-[240px] truncate">{item.title}</td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{item.type}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`badge text-[10px] ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{item.date}</td>
                  <td className="px-4 py-3.5 text-xs text-ngc-muted hidden lg:table-cell">{item.author}</td>
                  <td className="px-4 py-3.5 text-xs text-ngc-muted hidden lg:table-cell text-right">
                    {item.views > 0 ? item.views.toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="text-ngc-blue hover:text-ngc-navy transition-colors" title="Preview"><Eye size={13} /></button>
                      <button className="text-ngc-blue hover:text-ngc-navy transition-colors" title="Edit"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-ngc-muted">Showing {filtered.length} of {items.length} items</p>
          <button className="text-xs text-ngc-blue hover:underline flex items-center gap-1">
            <Download size={11} /> Export CSV
          </button>
        </div>
      </div>

      {/* New Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-semibold text-ngc-navy mb-4 text-base">Create New Content</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Title</label>
                <input className="input-field text-xs py-2" placeholder="Enter content title…" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Content Type</label>
                <select className="input-field text-xs py-2">
                  {TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Department</label>
                <select className="input-field text-xs py-2">
                  <option>PR Department</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>CEO Office</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary text-xs py-1.5 px-4">Create Draft</button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
