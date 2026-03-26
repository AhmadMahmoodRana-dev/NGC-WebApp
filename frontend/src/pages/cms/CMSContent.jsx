import { useState, useEffect, useCallback } from 'react'
import { PlusCircle, Search, Eye, Edit2, Trash2, ChevronRight, Loader2, AlertCircle, X, RefreshCw } from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'
import { contentAPI, getUser } from '../../utils/api'

const STATUS_COLORS = {
  published:        'bg-green-100 text-green-700',
  in_review:        'bg-blue-100 text-blue-700',
  draft:            'bg-gray-100 text-gray-600',
  approved:         'bg-amber-100 text-amber-700',
  archived:         'bg-red-50 text-red-400',
}

const STATUS_LABELS = {
  published: 'Published', in_review: 'In Review',
  draft: 'Draft', approved: 'Approved', archived: 'Archived',
}

const WORKFLOW_NEXT = {
  draft: { label: 'Submit for Review', action: 'advance' },
  in_review: { label: 'Approve', action: 'advance' },
  approved: { label: 'Publish', action: 'advance' },
}

const TYPES = ['All','report','press_release','gallery','tender','news','announcement','policy','research']

export default function CMSContent() {
  const [items, setItems]       = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('All')
  const [page, setPage]         = useState(1)
  const [showModal, setModal]   = useState(false)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState({ title: '', type: 'report', department: 'PR', body: '' })
  const user = getUser()

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { page, limit: 15 }
      if (typeFilter !== 'All') params.type = typeFilter
      const data = await contentAPI.getAll(params)
      let filtered = data.data
      if (search) filtered = filtered.filter(i => i.title.toLowerCase().includes(search.toLowerCase()))
      setItems(filtered)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, typeFilter, search])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this content item?')) return
    try {
      await contentAPI.delete(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) { alert(err.message) }
  }

  const handleWorkflow = async (id, action) => {
    try {
      const data = await contentAPI.workflow(id, action)
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: data.data.status } : i))
    } catch (err) { alert(err.message) }
  }

  const handleCreate = async () => {
    if (!newItem.title.trim()) return
    setCreating(true)
    try {
      const data = await contentAPI.create(newItem)
      setItems(prev => [data.data, ...prev])
      setModal(false)
      setNewItem({ title: '', type: 'report', department: 'PR', body: '' })
    } catch (err) { alert(err.message) }
    finally { setCreating(false) }
  }

  const pages = Math.ceil(total / 15)

  return (
    <CMSLayout
      title="Content Management"
      subtitle={loading ? 'Loading…' : `${total} total items`}
      action={
        <button onClick={() => setModal(true)} className="btn-primary text-xs py-2">
          <PlusCircle size={13} /> New Content
        </button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9 py-2 text-xs" placeholder="Search content…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1) }}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
                ${typeFilter === t ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
              {t === 'All' ? 'All' : t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-red-600 text-xs">
          <AlertCircle size={14} /> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 hover:underline"><RefreshCw size={12} /> Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-ngc-muted text-sm">
            <Loader2 size={18} className="animate-spin text-ngc-blue" /> Loading content…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Author</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Updated</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-ngc-muted text-xs">No content found.</td></tr>
                )}
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5 text-xs font-medium text-ngc-navy max-w-[220px] truncate">{item.title}</td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{item.type?.replace('_',' ')}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-[10px] ${STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{item.author}</td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {WORKFLOW_NEXT[item.status] && (
                          <button onClick={() => handleWorkflow(item.id, 'advance')}
                            className="text-[10px] text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 px-1.5 py-0.5 rounded transition-colors whitespace-nowrap">
                            {WORKFLOW_NEXT[item.status].label}
                          </button>
                        )}
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Preview"><Eye size={13} /></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Edit"><Edit2 size={13} /></button>
                        {['admin','superadmin'].includes(user?.role) && (
                          <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2 justify-end">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="text-xs px-3 py-1.5 rounded border border-gray-200 text-ngc-muted hover:border-ngc-blue hover:text-ngc-blue disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="text-xs text-ngc-muted">Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
              className="text-xs px-3 py-1.5 rounded border border-gray-200 text-ngc-muted hover:border-ngc-blue hover:text-ngc-blue disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        )}
      </div>

      {/* New Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ngc-navy text-base">Create New Content</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Title *</label>
                <input className="input-field text-xs py-2" placeholder="Enter content title…"
                  value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Content Type *</label>
                  <select className="input-field text-xs py-2" value={newItem.type}
                    onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}>
                    {TYPES.slice(1).map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Department *</label>
                  <select className="input-field text-xs py-2" value={newItem.department}
                    onChange={e => setNewItem(p => ({ ...p, department: e.target.value }))}>
                    <option>PR</option><option>Operations</option><option>Finance</option>
                    <option>CEO Office</option><option>Procurement</option><option>IT & Digital</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Excerpt / Summary</label>
                <textarea className="input-field text-xs py-2 h-20 resize-none" placeholder="Brief description…"
                  value={newItem.excerpt} onChange={e => setNewItem(p => ({ ...p, excerpt: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setModal(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
              <button onClick={handleCreate} disabled={creating || !newItem.title.trim()} className="btn-primary text-xs py-1.5 px-4 disabled:opacity-60">
                {creating ? <><Loader2 size={12} className="animate-spin" /> Creating…</> : 'Create Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
