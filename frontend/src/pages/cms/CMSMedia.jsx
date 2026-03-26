import { useState } from 'react'
import {
  Upload, Search, Image, Film, FileText, Folder,
  Download, Trash2, Eye, Grid, List, PlusCircle,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const MEDIA_ITEMS = [
  { id: 1,  name: '500kv-corridor-aerial.jpg',      type: 'image', size: '3.4 MB', date: '17 Mar 2026', folder: 'Photos',    thumb: '#1A56A5', dims: '4000×2667' },
  { id: 2,  name: 'tarbela-dam-station.jpg',         type: 'image', size: '2.1 MB', date: '15 Mar 2026', folder: 'Photos',    thumb: '#0B1E3E', dims: '3200×2133' },
  { id: 3,  name: 'annual-report-2024-25.pdf',       type: 'pdf',   size: '8.9 MB', date: '14 Mar 2026', folder: 'Documents', thumb: null,      dims: '42 pages'  },
  { id: 4,  name: 'grid-expansion-video.mp4',        type: 'video', size: '45.2 MB',date: '12 Mar 2026', folder: 'Videos',    thumb: '#C8922A', dims: '1920×1080' },
  { id: 5,  name: 'ceo-message-march.jpg',           type: 'image', size: '1.8 MB', date: '10 Mar 2026', folder: 'Photos',    thumb: '#122952', dims: '2400×1600' },
  { id: 6,  name: 'mou-ceremony-photos.zip',         type: 'archive',size:'18.7 MB',date: '08 Mar 2026', folder: 'Photos',    thumb: null,      dims: '14 files'  },
  { id: 7,  name: 'procurement-policy-2026.pdf',     type: 'pdf',   size: '1.2 MB', date: '05 Mar 2026', folder: 'Documents', thumb: null,      dims: '18 pages'  },
  { id: 8,  name: 'smart-grid-faisalabad.jpg',       type: 'image', size: '2.7 MB', date: '02 Mar 2026', folder: 'Photos',    thumb: '#2E87D4', dims: '3600×2400' },
  { id: 9,  name: 'infographic-national-grid.png',   type: 'image', size: '890 KB', date: '28 Feb 2026', folder: 'Graphics',  thumb: '#F0B849', dims: '1200×800'  },
  { id: 10, name: 'load-dispatch-presentation.pptx', type: 'doc',   size: '4.3 MB', date: '25 Feb 2026', folder: 'Documents', thumb: null,      dims: '28 slides' },
  { id: 11, name: 'transmission-towers-dusk.jpg',    type: 'image', size: '3.1 MB', date: '22 Feb 2026', folder: 'Photos',    thumb: '#5A6070', dims: '4000×2667' },
  { id: 12, name: 'employee-town-hall-clip.mp4',     type: 'video', size: '31.0 MB',date: '18 Feb 2026', folder: 'Videos',    thumb: '#1A56A5', dims: '1280×720'  },
]

const FOLDERS = ['All Files', 'Photos', 'Videos', 'Documents', 'Graphics']

const TYPE_ICONS = {
  image:   { icon: Image,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
  video:   { icon: Film,     color: 'text-purple-500', bg: 'bg-purple-50' },
  pdf:     { icon: FileText, color: 'text-red-400',    bg: 'bg-red-50'    },
  doc:     { icon: FileText, color: 'text-amber-500',  bg: 'bg-amber-50'  },
  archive: { icon: Folder,   color: 'text-gray-500',   bg: 'bg-gray-100'  },
}

export default function CMSMedia() {
  const [search, setSearch]     = useState('')
  const [folder, setFolder]     = useState('All Files')
  const [view, setView]         = useState('grid')
  const [selected, setSelected] = useState([])

  const filtered = MEDIA_ITEMS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchFolder = folder === 'All Files' || m.folder === folder
    return matchSearch && matchFolder
  })

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const totalSize = filtered.reduce((acc, m) => {
    const n = parseFloat(m.size)
    return acc + (m.size.includes('KB') ? n / 1024 : n)
  }, 0)

  return (
    <CMSLayout
      title="Media Library"
      subtitle={`${MEDIA_ITEMS.length} files · ${totalSize.toFixed(1)} MB shown`}
      action={
        <button className="btn-primary text-xs py-2">
          <Upload size={13} /> Upload Files
        </button>
      }
    >
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl bg-white p-6 mb-5 text-center hover:border-ngc-blue transition-colors group cursor-pointer">
        <Upload size={20} className="mx-auto text-gray-300 group-hover:text-ngc-blue mb-2 transition-colors" />
        <p className="text-xs text-ngc-muted">Drag & drop files here or <span className="text-ngc-blue font-medium hover:underline">browse</span></p>
        <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, PDF, MP4, PPTX — Max 50 MB per file</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FOLDERS.map(f => (
            <button key={f} onClick={() => setFolder(f)}
              className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
                ${folder === f ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
              {f}
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
            <button onClick={() => setView('grid')} className={`p-1.5 ${view === 'grid' ? 'bg-ngc-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
              <Grid size={14} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 ${view === 'list' ? 'bg-ngc-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-ngc-blue/5 border border-ngc-blue/20 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-3">
          <span className="text-xs text-ngc-blue font-medium">{selected.length} selected</span>
          <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={11} /> Delete</button>
          <button className="text-xs text-ngc-blue hover:text-ngc-navy flex items-center gap-1"><Download size={11} /> Download</button>
          <button onClick={() => setSelected([])} className="text-xs text-ngc-muted ml-auto">Clear</button>
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map(item => {
            const { icon: TypeIcon, color, bg } = TYPE_ICONS[item.type] || TYPE_ICONS.doc
            const isSelected = selected.includes(item.id)
            return (
              <div key={item.id} onClick={() => toggleSelect(item.id)}
                className={`bg-white rounded-lg border-2 transition-all cursor-pointer group overflow-hidden
                  ${isSelected ? 'border-ngc-blue shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                {item.type === 'image' ? (
                  <div className="h-24 flex items-center justify-center" style={{ background: item.thumb + '22' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: item.thumb + '44' }}>
                      <Image size={18} style={{ color: item.thumb }} />
                    </div>
                  </div>
                ) : item.type === 'video' ? (
                  <div className="h-24 flex items-center justify-center" style={{ background: item.thumb + '22' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/20">
                      <Film size={18} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className={`h-24 flex items-center justify-center ${bg}`}>
                    <TypeIcon size={24} className={color} />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[10px] font-medium text-ngc-navy truncate">{item.name}</p>
                  <p className="text-[9px] text-ngc-muted">{item.size}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Folder</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Size</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Dimensions</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => {
                const { icon: TypeIcon, color } = TYPE_ICONS[item.type] || TYPE_ICONS.doc
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3 flex items-center gap-2.5">
                      <TypeIcon size={14} className={color} />
                      <span className="text-xs font-medium text-ngc-navy truncate max-w-[180px]">{item.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.folder}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ngc-muted hidden md:table-cell">{item.size}</td>
                    <td className="px-4 py-3 text-xs text-ngc-muted hidden lg:table-cell">{item.dims}</td>
                    <td className="px-4 py-3 text-xs text-ngc-muted hidden md:table-cell">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100">
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Preview"><Eye size={13} /></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Download"><Download size={13} /></button>
                        <button className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={13} /></button>
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
