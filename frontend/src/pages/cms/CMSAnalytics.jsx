import { useState } from 'react'
import {
  TrendingUp, Eye, Users, FileText, Download,
  ArrowUp, ArrowDown, BarChart2, Globe, Clock,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const MONTHLY = [
  { month: 'Oct', views: 42000, visitors: 18000, downloads: 1200 },
  { month: 'Nov', views: 48000, visitors: 21000, downloads: 1450 },
  { month: 'Dec', views: 39000, visitors: 16500, downloads: 980  },
  { month: 'Jan', views: 51000, visitors: 23000, downloads: 1680 },
  { month: 'Feb', views: 56000, visitors: 25500, downloads: 1920 },
  { month: 'Mar', views: 61000, visitors: 28000, downloads: 2100 },
]

const TOP_PAGES = [
  { path: '/publications/tenders',           title: 'Tenders',              views: 14200, change: +12 },
  { path: '/media/press-releases',           title: 'Press Releases',        views: 11800, change: +8  },
  { path: '/',                               title: 'Home',                  views: 10500, change: +5  },
  { path: '/publications/annual-reports',    title: 'Annual Reports',        views: 8900,  change: -3  },
  { path: '/about',                          title: 'About NGC',             views: 7600,  change: +2  },
  { path: '/careers',                        title: 'Careers',               views: 6400,  change: +18 },
  { path: '/operations/projects',            title: 'Transmission Projects', views: 5100,  change: +6  },
  { path: '/contact',                        title: 'Contact',               views: 4200,  change: -1  },
]

const TOP_CONTENT = [
  { title: 'Load Shedding Schedule Update – March', type: 'Announcement',  views: 8760 },
  { title: 'CEO Message — National Energy Day',      type: 'Press Release', views: 5200 },
  { title: 'NGC Signs MOU with Chinese Partners',    type: 'Press Release', views: 3810 },
  { title: 'Grid Expansion — Multan–Lahore Corridor',type: 'News',          views: 2100 },
  { title: 'Q2 FY2026 Performance Report',           type: 'Report',        views: 1420 },
]

const TRAFFIC_SOURCES = [
  { source: 'Direct',         pct: 38, color: '#1A56A5' },
  { source: 'Search (Google)',pct: 31, color: '#2E87D4' },
  { source: 'Social Media',   pct: 14, color: '#C8922A' },
  { source: 'Referral',       pct: 11, color: '#F0B849' },
  { source: 'Email',          pct:  6, color: '#5A6070' },
]

const maxViews = Math.max(...MONTHLY.map(m => m.views))

export default function CMSAnalytics() {
  const [range, setRange] = useState('6mo')

  return (
    <CMSLayout
      title="Analytics"
      subtitle="Website performance overview"
      action={
        <button className="btn-outline text-xs py-2">
          <Download size={13} /> Export Report
        </button>
      }
    >
      {/* Date range */}
      <div className="flex gap-2 mb-5">
        {['7d', '30d', '6mo', '1yr'].map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
              ${range === r ? 'bg-ngc-blue text-white border-ngc-blue' : 'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
            {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : r === '6mo' ? 'Last 6 months' : 'Last year'}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Page Views',    value: '61,000', change: '+9%',  up: true,  Icon: Eye         },
          { label: 'Unique Visitors',     value: '28,000', change: '+10%', up: true,  Icon: Users       },
          { label: 'Content Published',   value: '142',    change: '+8',   up: true,  Icon: FileText    },
          { label: 'Avg. Session (min)',   value: '4:32',   change: '+0:18',up: true,  Icon: Clock       },
        ].map(({ label, value, change, up, Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ngc-muted">{label}</p>
              <Icon size={15} className="text-ngc-blue" />
            </div>
            <p className="text-2xl font-bold text-ngc-navy font-display">{value}</p>
            <div className={`flex items-center gap-1 text-[11px] mt-1 font-medium ${up ? 'text-green-600' : 'text-red-500'}`}>
              {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {change} vs last period
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2 text-sm">
            <BarChart2 size={14} className="text-ngc-blue" /> Monthly Page Views
          </h3>
          <div className="flex items-end gap-3 h-36">
            {MONTHLY.map(({ month, views }) => {
              const h = Math.round((views / maxViews) * 100)
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-ngc-muted">{(views / 1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t-md bg-ngc-blue/15 hover:bg-ngc-blue/25 transition-colors relative overflow-hidden"
                    style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-ngc-blue rounded-t-md" style={{ height: '100%' }} />
                  </div>
                  <span className="text-[9px] text-ngc-muted">{month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2 text-sm">
            <Globe size={14} className="text-ngc-blue" /> Traffic Sources
          </h3>
          <div className="space-y-3">
            {TRAFFIC_SOURCES.map(({ source, pct, color }) => (
              <div key={source}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-ngc-muted">{source}</span>
                  <span className="text-xs font-semibold text-ngc-navy">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top pages */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-ngc-navy text-sm flex items-center gap-2">
              <TrendingUp size={14} className="text-ngc-blue" /> Top Pages
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_PAGES.map(({ title, views, change }) => (
              <div key={title} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50">
                <span className="text-xs font-medium text-ngc-navy truncate flex-1">{title}</span>
                <span className="text-xs text-ngc-muted mx-4">{views.toLocaleString()}</span>
                <span className={`text-[11px] font-semibold flex items-center gap-0.5 ${change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {change > 0 ? <ArrowUp size={9} /> : <ArrowDown size={9} />}{Math.abs(change)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-ngc-navy text-sm flex items-center gap-2">
              <FileText size={14} className="text-ngc-blue" /> Top Content This Month
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_CONTENT.map(({ title, type, views }) => (
              <div key={title} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-ngc-navy truncate">{title}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{type}</span>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-ngc-navy font-display">{views.toLocaleString()}</p>
                  <p className="text-[10px] text-ngc-muted">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CMSLayout>
  )
}
