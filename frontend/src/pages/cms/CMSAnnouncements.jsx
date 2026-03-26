import { useState, useEffect, useCallback } from 'react'
import { Bell, PlusCircle, Edit2, Trash2, Eye, AlertTriangle, Info, CheckCircle, Megaphone, X, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'
import { contentAPI } from '../../utils/api'

const TYPE_STYLES = {
  Urgent: { bg:'bg-red-50',   text:'text-red-600',   border:'border-red-200',  Icon:AlertTriangle },
  Event:  { bg:'bg-blue-50',  text:'text-blue-600',  border:'border-blue-200', Icon:Megaphone    },
  Info:   { bg:'bg-gray-50',  text:'text-gray-600',  border:'border-gray-200', Icon:Info          },
  Public: { bg:'bg-green-50', text:'text-green-600', border:'border-green-200',Icon:CheckCircle  },
}

function detectType(item) {
  if (item.type === 'announcement') return 'Info'
  if (item.tags?.includes('urgent')) return 'Urgent'
  if (item.type === 'press_release') return 'Public'
  if (item.tags?.includes('event')) return 'Event'
  return 'Info'
}

export default function CMSAnnouncements() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [showModal, setModal]   = useState(false)
  const [creating, setCreating] = useState(false)
  const [newAnn, setNewAnn]     = useState({ title:'', type:'announcement', department:'PR', excerpt:'', body:'', tags:[] })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch announcements and press releases from content API
      const [annRes, prRes] = await Promise.all([
        contentAPI.getAll({ type: 'announcement', limit: 50 }),
        contentAPI.getAll({ type: 'press_release', limit: 20 }),
      ])
      const combined = [...(annRes.data||[]), ...(prRes.data||[])]
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      setItems(combined)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return
    try {
      await contentAPI.delete(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err) { alert(err.message) }
  }

  const handleCreate = async () => {
    if (!newAnn.title.trim()) return
    setCreating(true)
    try {
      const data = await contentAPI.create(newAnn)
      setItems(prev => [data.data, ...prev])
      setModal(false)
      setNewAnn({ title:'', type:'announcement', department:'PR', excerpt:'', body:'', tags:[] })
    } catch (err) { alert(err.message) }
    finally { setCreating(false) }
  }

  const activeCount    = items.filter(i => i.status === 'published').length
  const pendingCount   = items.filter(i => ['draft','in_review','approved'].includes(i.status)).length
  const urgentCount    = items.filter(i => i.tags?.includes('urgent') && i.status === 'published').length

  const filtered = filter === 'All' ? items : items.filter(i => detectType(i) === filter)

  return (
    <CMSLayout
      title="Announcements"
      subtitle="Manage internal and public announcements"
      action={
        <button onClick={() => setModal(true)} className="btn-primary text-xs py-2">
          <PlusCircle size={13}/> New Announcement
        </button>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label:'Published', value:activeCount,  color:'text-green-500' },
          { label:'Pending',   value:pendingCount,  color:'text-amber-500' },
          { label:'Urgent',    value:urgentCount,   color:'text-red-500'   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-ngc-muted mb-1">{label}</p>
            <p className={`text-2xl font-bold font-display ${color}`}>{loading ? '…' : value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {['All','Urgent','Event','Info','Public'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
              ${filter===f?'bg-ngc-blue text-white border-ngc-blue':'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
            {f}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-[11px] text-ngc-blue flex items-center gap-1 hover:underline">
          <RefreshCw size={11}/> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-red-600 text-xs">
          <AlertCircle size={14}/> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-ngc-muted text-sm">
          <Loader2 size={18} className="animate-spin text-ngc-blue"/> Loading announcements…
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-center text-ngc-muted text-xs py-10">No announcements found.</p>}
          {filtered.map(item => {
            const annType = detectType(item)
            const { bg, text, border, Icon } = TYPE_STYLES[annType] || TYPE_STYLES.Info
            const isOpen = expanded === item.id
            return (
              <div key={item.id} className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden ${border}`}>
                <div className="px-5 py-4 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon size={14} className={text}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-ngc-navy truncate flex-1">{item.title}</p>
                      <span className={`badge text-[10px] ${item.status==='published'?'bg-green-100 text-green-700':item.status==='draft'?'bg-gray-100 text-gray-600':'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${bg} ${text}`}>{annType}</span>
                    </div>
                    <div className="flex gap-3 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-ngc-muted">Dept: {item.department}</span>
                      <span className="text-[11px] text-ngc-muted">By: {item.author}</span>
                      <span className="text-[11px] text-ngc-muted">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : ''}</span>
                    </div>
                    {isOpen && item.excerpt && (
                      <p className="mt-3 text-xs text-ngc-muted leading-relaxed border-t border-gray-100 pt-3">{item.excerpt}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpanded(isOpen ? null : item.id)} className="text-ngc-blue hover:text-ngc-navy" title="Preview"><Eye size={14}/></button>
                    <button className="text-ngc-blue hover:text-ngc-navy" title="Edit"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ngc-navy text-base">New Announcement</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-ngc-muted mb-1">Title *</label>
                <input className="input-field text-xs py-2" placeholder="Announcement title…" value={newAnn.title} onChange={e=>setNewAnn(p=>({...p,title:e.target.value}))}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-ngc-muted mb-1">Type</label>
                  <select className="input-field text-xs py-2" value={newAnn.type} onChange={e=>setNewAnn(p=>({...p,type:e.target.value}))}>
                    <option value="announcement">Announcement</option><option value="press_release">Press Release</option><option value="news">News</option>
                  </select></div>
                <div><label className="block text-xs font-medium text-ngc-muted mb-1">Department</label>
                  <select className="input-field text-xs py-2" value={newAnn.department} onChange={e=>setNewAnn(p=>({...p,department:e.target.value}))}>
                    <option>PR</option><option>Operations</option><option>Finance</option><option>CEO Office</option>
                  </select></div>
              </div>
              <div><label className="block text-xs font-medium text-ngc-muted mb-1">Summary</label>
                <textarea className="input-field text-xs py-2 h-20 resize-none" placeholder="Brief description…" value={newAnn.excerpt} onChange={e=>setNewAnn(p=>({...p,excerpt:e.target.value}))}/></div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setModal(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
              <button onClick={handleCreate} disabled={creating||!newAnn.title.trim()} className="btn-primary text-xs py-1.5 px-4 disabled:opacity-60">
                {creating?<><Loader2 size={12} className="animate-spin"/>Creating…</>:'Create Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
