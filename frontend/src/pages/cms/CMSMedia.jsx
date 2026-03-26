import { useState, useEffect, useCallback } from 'react'
import { Upload, Search, Image, Film, FileText, Folder, Download, Trash2, Eye, Grid, List, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'
import { mediaAPI } from '../../utils/api'

const TYPE_ICONS = {
  photo:   { icon: Image,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
  video:   { icon: Film,     color: 'text-purple-500', bg: 'bg-purple-50' },
  document:{ icon: FileText, color: 'text-red-400',    bg: 'bg-red-50'    },
  other:   { icon: Folder,   color: 'text-gray-500',   bg: 'bg-gray-100'  },
}

export default function CMSMedia() {
  const [items, setItems]       = useState([])
  const [categories, setCats]   = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('')
  const [catFilter, setCat]     = useState('')
  const [view, setView]         = useState('grid')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { limit: 24 }
      if (typeFilter) params.type = typeFilter
      if (catFilter)  params.category = catFilter
      if (search)     params.search = search
      const data = await mediaAPI.getAll(params)
      setItems(data.data)
      setTotal(data.total)
      if (data.categories) setCats(['All', ...data.categories])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, catFilter, search])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!confirm('Delete this media item?')) return
    try {
      await mediaAPI.delete(id)
      setItems(prev => prev.filter(m => m.id !== id))
    } catch (err) { alert(err.message) }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setUploadProgress(`Uploading ${files.length} file(s)…`)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', 'General')
        await mediaAPI.upload(fd)
      }
      setUploadProgress('Upload complete!')
      setTimeout(() => setUploadProgress(''), 2000)
      load()
    } catch (err) {
      setUploadProgress('')
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—'

  return (
    <CMSLayout
      title="Media Library"
      subtitle={loading ? 'Loading…' : `${total} files`}
      action={
        <label className="btn-primary text-xs py-2 cursor-pointer">
          <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload Files'}
          <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.pptx" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      }
    >
      {/* Upload progress */}
      {uploadProgress && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-xs text-blue-700 font-medium flex items-center gap-2">
          {uploading && <Loader2 size={12} className="animate-spin" />}
          {uploadProgress}
        </div>
      )}

      {/* Drop zone */}
      <label className="border-2 border-dashed border-gray-200 rounded-xl bg-white p-6 mb-5 text-center hover:border-ngc-blue transition-colors group cursor-pointer block">
        <Upload size={20} className="mx-auto text-gray-300 group-hover:text-ngc-blue mb-2 transition-colors" />
        <p className="text-xs text-ngc-muted">Drag & drop or <span className="text-ngc-blue font-medium">browse</span></p>
        <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, PDF, MP4 — Max 100 MB</p>
        <input type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['', 'photo', 'video', 'document'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
                ${typeFilter === t ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
              {t === '' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1) + 's'}
            </button>
          ))}
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c === 'All' ? '' : c)}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
                ${catFilter === (c === 'All' ? '' : c) ? 'bg-ngc-navy text-white border-ngc-navy' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-8 py-1.5 text-xs w-44" placeholder="Search files…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-1.5 ${view==='grid'?'bg-ngc-blue text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}><Grid size={14}/></button>
            <button onClick={() => setView('list')} className={`p-1.5 ${view==='list'?'bg-ngc-blue text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}><List size={14}/></button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-red-600 text-xs">
          <AlertCircle size={14}/> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-ngc-muted text-sm">
          <Loader2 size={18} className="animate-spin text-ngc-blue"/> Loading media…
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {items.map(item => {
            const { icon: TypeIcon, color, bg } = TYPE_ICONS[item.type] || TYPE_ICONS.other
            return (
              <div key={item.id} className="bg-white rounded-lg border-2 border-gray-100 hover:border-gray-300 transition-all group overflow-hidden">
                {item.thumbnail ? (
                  <div className="h-24 bg-gray-100 overflow-hidden">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
                  </div>
                ) : (
                  <div className={`h-24 flex items-center justify-center ${bg}`}>
                    <TypeIcon size={24} className={color} />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[10px] font-medium text-ngc-navy truncate">{item.title}</p>
                  <p className="text-[9px] text-ngc-muted">{item.size || item.type}</p>
                  <div className="flex gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-ngc-blue hover:text-ngc-navy" title="Preview"><Eye size={11}/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={11}/></button>
                  </div>
                </div>
              </div>
            )
          })}
          {items.length === 0 && <p className="col-span-full text-center text-ngc-muted text-xs py-10">No media found.</p>}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Size</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Uploaded</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-ngc-muted text-xs">No media found.</td></tr>}
              {items.map(item => {
                const { icon: TypeIcon, color } = TYPE_ICONS[item.type] || TYPE_ICONS.other
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 group">
                    <td className="px-5 py-3 flex items-center gap-2.5">
                      <TypeIcon size={14} className={color}/>
                      <span className="text-xs font-medium text-ngc-navy truncate max-w-[180px]">{item.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ngc-muted hidden md:table-cell">{item.size || '—'}</td>
                    <td className="px-4 py-3 text-xs text-ngc-muted hidden md:table-cell">{formatDate(item.uploadedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100">
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Preview"><Eye size={13}/></button>
                        <a href={item.url} download className="text-ngc-blue hover:text-ngc-navy" title="Download"><Download size={13}/></a>
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </CMSLayout>
  )
}
