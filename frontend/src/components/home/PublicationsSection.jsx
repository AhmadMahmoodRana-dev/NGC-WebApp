import { Link } from 'react-router-dom'
import { ArrowRight, Download, FileText, BookOpen, Gavel } from 'lucide-react'

const DOCS = [
  { icon: BookOpen,  label: 'Annual Report 2024–25',          category: 'Annual Report', size: '4.2 MB', href: '/publications/annual-reports' },
  { icon: FileText,  label: 'Grid Expansion Policy 2025',      category: 'Policy',        size: '1.8 MB', href: '/publications/policies'        },
  { icon: Gavel,     label: 'Tender NGC/2026/T-041 — Multan', category: 'Tender',        size: '0.9 MB', href: '/publications/tenders'         },
  { icon: FileText,  label: 'System Performance Report Q2',    category: 'Report',        size: '2.1 MB', href: '/publications/annual-reports'  },
  { icon: BookOpen,  label: 'Corporate Governance Code 2025',  category: 'Policy',        size: '1.2 MB', href: '/publications/policies'        },
  { icon: Gavel,     label: 'Tender NGC/2026/T-039 — Karachi',category: 'Tender',        size: '0.7 MB', href: '/publications/tenders'         },
]

const CATEGORY_COLORS = {
  'Annual Report': 'bg-blue-50 text-blue-700',
  'Policy':        'bg-green-50 text-green-700',
  'Tender':        'bg-amber-50 text-amber-700',
  'Report':        'bg-purple-50 text-purple-700',
}

export default function PublicationsSection() {
  return (
    <section className="py-16 bg-ngc-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-1">Document Repository</p>
            <h2 className="section-title">Publications & Reports</h2>
          </div>
          <Link to="/publications" className="btn-outline text-xs py-2">
            Full Repository <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOCS.map(({ icon: Icon, label, category, size, href }) => (
            <Link key={label} to={href} className="card p-4 flex items-center gap-4 group hover:border-ngc-blue/30">
              <div className="w-10 h-10 rounded bg-ngc-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-ngc-blue/10 transition-colors">
                <Icon size={18} className="text-ngc-navy group-hover:text-ngc-blue transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`badge ${CATEGORY_COLORS[category]}`}>{category}</span>
                  <span className="text-xs text-ngc-muted">{size}</span>
                </div>
                <p className="text-sm font-medium text-ngc-navy group-hover:text-ngc-blue transition-colors truncate">{label}</p>
              </div>
              <Download size={14} className="text-ngc-muted group-hover:text-ngc-blue transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
