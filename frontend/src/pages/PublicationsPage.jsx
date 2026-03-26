import { Link } from 'react-router-dom'
import { Download, Filter, Search, BookOpen, FileText, Gavel, ChevronDown } from 'lucide-react'
import { useState } from 'react'

const DOCS = [
  { id:1, title:'Annual Report 2024-25',           category:'Annual Report', date:'Mar 2026', size:'4.2 MB', dept:'Corporate'  },
  { id:2, title:'Annual Report 2023-24',           category:'Annual Report', date:'Apr 2025', size:'3.8 MB', dept:'Corporate'  },
  { id:3, title:'Grid Expansion Policy 2025',      category:'Policy',        date:'Jan 2026', size:'1.8 MB', dept:'Operations' },
  { id:4, title:'Corporate Governance Code',       category:'Policy',        date:'Dec 2025', size:'1.2 MB', dept:'Corporate'  },
  { id:5, title:'Tender NGC/2026/T-041 — Multan',  category:'Tender',        date:'Mar 2026', size:'0.9 MB', dept:'Procurement'},
  { id:6, title:'Tender NGC/2026/T-039 — Karachi', category:'Tender',        date:'Mar 2026', size:'0.7 MB', dept:'Procurement'},
  { id:7, title:'System Performance Report Q2',    category:'Report',        date:'Mar 2026', size:'2.1 MB', dept:'Operations' },
  { id:8, title:'Environmental Policy Statement',  category:'Policy',        date:'Nov 2025', size:'0.6 MB', dept:'Corporate'  },
]

const CAT_COLORS = {
  'Annual Report':'bg-blue-50 text-blue-700',
  'Policy':       'bg-green-50 text-green-700',
  'Tender':       'bg-amber-50 text-amber-700',
  'Report':       'bg-purple-50 text-purple-700',
}

export default function PublicationsPage() {
  const [filter, setFilter] = useState('All')
  const [query,  setQuery]  = useState('')
  const cats = ['All', 'Annual Report', 'Policy', 'Tender', 'Report']

  const filtered = DOCS.filter(d => {
    const matchCat = filter === 'All' || d.category === filter
    const matchQ   = !query || d.title.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="font-body">
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-white/50 flex items-center gap-2">
          <Link to="/" className="hover:text-white">Home</Link><span>/</span>
          <span className="text-white">Publications</span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">Document Repository</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Publications & Reports</h1>
          <p className="text-white/70 text-base max-w-xl">Centralised access to annual reports, policies, tenders, and research publications.</p>
        </div>
      </div>

      <section className="py-12 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                className="input-field pl-9 bg-white" placeholder="Search publications..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              {cats.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors
                    ${filter === c ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-medium">Document Title</th>
                  <th className="px-4 py-3.5 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3.5 font-medium hidden md:table-cell">Date</th>
                  <th className="px-4 py-3.5 font-medium hidden lg:table-cell">Size</th>
                  <th className="px-4 py-3.5 font-medium">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-4 flex items-center gap-3">
                      <FileText size={15} className="text-ngc-blue flex-shrink-0" />
                      <span className="text-sm font-medium text-ngc-navy group-hover:text-ngc-blue transition-colors">{doc.title}</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`badge text-[10px] ${CAT_COLORS[doc.category]}`}>{doc.category}</span>
                    </td>
                    <td className="px-4 py-4 text-xs text-ngc-muted hidden md:table-cell">{doc.date}</td>
                    <td className="px-4 py-4 text-xs text-ngc-muted hidden lg:table-cell">{doc.size}</td>
                    <td className="px-4 py-4">
                      <button className="flex items-center gap-1.5 text-xs text-ngc-blue hover:text-ngc-navy font-medium transition-colors">
                        <Download size={13} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-ngc-muted text-sm">No documents found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
