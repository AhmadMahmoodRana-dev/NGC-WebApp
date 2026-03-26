import { Link } from 'react-router-dom'
import { Calendar, Download, ArrowRight, Image, Video, FileArchive } from 'lucide-react'

const PRESS_RELEASES = [
  { id: 1, date: 'March 20, 2026', title: 'NGC Signs MOU with Chinese Energy Partners for HVDC Technology Transfer', category: 'MOU / Agreements' },
  { id: 2, date: 'March 15, 2026', title: 'Q2 FY2026 System Performance Report Released',                          category: 'Corporate'         },
  { id: 3, date: 'March 10, 2026', title: '500kV Lahore–Islamabad Corridor Fully Energised',                       category: 'Operations'        },
  { id: 4, date: 'February 25, 2026', title: 'NGC Launches Smart Grid Modernisation Programme Phase I',            category: 'Technology'        },
  { id: 5, date: 'February 18, 2026', title: 'NGC Annual Report 2024-25 Published',                                category: 'Corporate'         },
]

export default function MediaPage() {
  return (
    <div className="font-body">
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-white/50 flex items-center gap-2">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span><span className="text-white">Media & PR</span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">Media Centre</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Media & Communications</h1>
          <p className="text-white/70 text-base max-w-xl">Press releases, photo & video gallery, downloadable media kits, and crisis updates.</p>
        </div>
      </div>

      {/* Quick nav tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {['Press Releases', 'Photo Gallery', 'Videos', 'Media Kits', 'Announcements'].map(tab => (
            <button key={tab} className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-ngc-muted hover:text-ngc-blue border-b-2 border-transparent hover:border-ngc-blue transition-colors first:text-ngc-blue first:border-ngc-blue">
              {tab}
            </button>
          ))}
        </div>
      </div>

      <section className="py-14 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Press Releases */}
          <div className="lg:col-span-2">
            <h2 className="section-title mb-6">Press Releases</h2>
            <div className="space-y-4">
              {PRESS_RELEASES.map(pr => (
                <div key={pr.id} className="card p-5 flex gap-4 group cursor-pointer hover:border-ngc-blue/30">
                  <div className="flex-shrink-0 text-center w-14">
                    <div className="bg-ngc-navy text-white rounded-t px-2 py-1 text-[9px] uppercase tracking-wider">
                      {pr.date.split(' ')[0]}
                    </div>
                    <div className="bg-ngc-blue text-white rounded-b px-2 py-1 font-bold text-sm">
                      {pr.date.split(' ')[1].replace(',', '')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="badge bg-blue-50 text-blue-700 mb-1.5">{pr.category}</span>
                    <h3 className="text-sm font-semibold text-ngc-navy group-hover:text-ngc-blue transition-colors leading-snug">{pr.title}</h3>
                  </div>
                  <ArrowRight size={14} className="text-ngc-muted group-hover:text-ngc-blue transition-colors flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Media Kits & Gallery sidebar */}
          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-ngc-navy mb-4">Media Kits</h3>
              <ul className="space-y-3">
                {[
                  { label: 'NGC Corporate Profile 2025',       size: '3.4 MB' },
                  { label: 'Logo & Brand Assets Pack',         size: '18 MB'  },
                  { label: 'Fact Sheet — Grid Statistics',     size: '0.8 MB' },
                  { label: 'Executive Headshots (Hi-Res)',     size: '24 MB'  },
                ].map(({ label, size }) => (
                  <li key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <FileArchive size={14} className="text-ngc-blue flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ngc-navy truncate">{label}</p>
                      <p className="text-[10px] text-ngc-muted">{size}</p>
                    </div>
                    <button className="text-ngc-blue hover:text-ngc-navy transition-colors">
                      <Download size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-ngc-navy mb-3">Media Contact</h3>
              <div className="text-sm space-y-1.5 text-ngc-muted">
                <p className="font-medium text-ngc-navy">Director, Public Relations</p>
                <p>National Grid Company, Lahore</p>
                <a href="mailto:pr@ngc.gov.pk" className="text-ngc-blue hover:underline block">pr@ngc.gov.pk</a>
                <a href="tel:+924235205005" className="text-ngc-blue hover:underline block">+92-42-3520-5005</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
