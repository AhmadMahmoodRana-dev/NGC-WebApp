import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag } from 'lucide-react'

const NEWS = [
  {
    id: 1,
    category: 'Press Release',
    categoryColor: 'bg-blue-100 text-blue-700',
    date: 'March 20, 2026',
    title: 'NGC Signs MOU with Chinese Energy Partners for HVDC Technology Transfer',
    excerpt: 'A landmark agreement to advance Pakistan\'s high-voltage direct current transmission capabilities through joint research and capacity building.',
    href: '/media/press-releases/1',
    featured: true,
  },
  {
    id: 2,
    category: 'Announcement',
    categoryColor: 'bg-amber-100 text-amber-700',
    date: 'March 15, 2026',
    title: 'Q2 FY2026 System Performance Report Released',
    excerpt: 'The second quarter report shows a 12% reduction in transmission losses and improved grid stability across the national network.',
    href: '/media/press-releases/2',
  },
  {
    id: 3,
    category: 'Operations',
    categoryColor: 'bg-green-100 text-green-700',
    date: 'March 10, 2026',
    title: '500kV Lahore–Islamabad Corridor Fully Energised',
    excerpt: 'The critical inter-regional transmission link is now fully operational, carrying over 3,000 MW of power between major load centres.',
    href: '/media/press-releases/3',
  },
  {
    id: 4,
    category: 'Tender',
    categoryColor: 'bg-purple-100 text-purple-700',
    date: 'March 5, 2026',
    title: 'NGC Invites Bids for Tarbela–Peshawar 500kV Line Works',
    excerpt: 'Pre-qualification notices issued for civil and electrical works on the northern transmission spine expansion project.',
    href: '/publications/tenders',
  },
]

export default function NewsSection() {
  const [featured, ...rest] = NEWS

  return (
    <section className="py-16 bg-ngc-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-1">Latest Updates</p>
            <h2 className="section-title">News & Press Releases</h2>
          </div>
          <Link to="/media/press-releases" className="btn-outline text-xs py-2">
            All News <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured */}
          <div className="lg:col-span-2">
            <Link to={featured.href} className="card flex flex-col h-full group overflow-hidden">
              {/* Placeholder image area */}
              <div className="h-48 bg-gradient-to-br from-ngc-navy to-ngc-blue relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 70%, #2E87D4 0%, transparent 50%)',
                }}/>
                <div className="absolute top-4 left-4">
                  <span className={`badge ${featured.categoryColor}`}>{featured.category}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mb-2">
                    <Calendar size={11} /> {featured.date}
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-ngc-navy text-lg leading-snug mb-2 group-hover:text-ngc-blue transition-colors">
                  {featured.title}
                </h3>
                <p className="text-ngc-muted text-sm leading-relaxed flex-1">{featured.excerpt}</p>
                <div className="mt-4 flex items-center text-ngc-blue text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                  Read Full Release <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>

          {/* Side list */}
          <div className="flex flex-col gap-4">
            {rest.map(item => (
              <Link key={item.id} to={item.href} className="card p-4 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${item.categoryColor}`}>{item.category}</span>
                  <span className="text-xs text-ngc-muted flex items-center gap-1">
                    <Calendar size={10} /> {item.date}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-ngc-navy leading-snug mb-1.5 group-hover:text-ngc-blue transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-ngc-muted line-clamp-2">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
