import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Eye, Users, FileText, Download, ArrowUp, ArrowDown, BarChart2, Globe, Clock, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'
import { contentAPI, publicationsAPI, careersAPI, mediaAPI } from '../../utils/api'

export default function CMSAnalytics() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [range, setRange]     = useState('6mo')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [contentRes, pubRes, careerRes, mediaRes] = await Promise.all([
        contentAPI.getAll({ limit: 100 }),
        publicationsAPI.getAll({ limit: 100 }),
        careersAPI.getAll({ limit: 100 }),
        mediaAPI.getAll({ limit: 100 }),
      ])

      const content = contentRes.data || []
      const pubs    = pubRes.data    || []
      const jobs    = careerRes.data || []
      const media   = mediaRes.data  || []

      const published   = content.filter(c => c.status === 'published').length
      const inReview    = content.filter(c => c.status === 'in_review').length
      const drafts      = content.filter(c => c.status === 'draft').length
      const totalDl     = pubs.reduce((s, p) => s + (p.downloads || 0), 0)
      const openJobs    = jobs.filter(j => j.status === 'open').length

      // Top publications by downloads
      const topPubs = [...pubs].sort((a,b) => (b.downloads||0) - (a.downloads||0)).slice(0,5)

      // Content by type
      const byType = {}
      content.forEach(c => { byType[c.type] = (byType[c.type] || 0) + 1 })

      setStats({ published, inReview, drafts, totalDl, openJobs, topPubs, byType, mediaCount: media.length, totalContent: contentRes.total, totalPubs: pubRes.total })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const maxType = stats ? Math.max(...Object.values(stats.byType)) : 1
  const TRAFFIC_SOURCES = [
    { source: 'Direct',          pct: 38, color: '#1A56A5' },
    { source: 'Search (Google)', pct: 31, color: '#2E87D4' },
    { source: 'Social Media',    pct: 14, color: '#C8922A' },
    { source: 'Referral',        pct: 11, color: '#F0B849' },
    { source: 'Email',           pct:  6, color: '#5A6070' },
  ]

  return (
    <CMSLayout
      title="Analytics"
      subtitle="Live data from the API"
      action={
        <button onClick={load} className="btn-outline text-xs py-2">
          <RefreshCw size={13} className={loading?'animate-spin':''}/> Refresh
        </button>
      }
    >
      {/* Range selector */}
      <div className="flex gap-2 mb-5">
        {['7d','30d','6mo','1yr'].map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={`text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors
              ${range===r?'bg-ngc-blue text-white border-ngc-blue':'bg-white text-ngc-muted border-gray-200 hover:border-ngc-blue hover:text-ngc-blue'}`}>
            {r==='7d'?'Last 7 days':r==='30d'?'Last 30 days':r==='6mo'?'Last 6 months':'Last year'}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 text-red-600 text-xs">
          <AlertCircle size={14}/> {error}
          <button onClick={load} className="ml-auto flex items-center gap-1 hover:underline"><RefreshCw size={12}/> Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-ngc-muted text-sm">
          <Loader2 size={18} className="animate-spin text-ngc-blue"/> Loading analytics…
        </div>
      ) : stats && (
        <>
          {/* KPI cards — live from API */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Published Content', value: stats.published, sub: `of ${stats.totalContent} total`,   up: true,  Icon: FileText },
              { label: 'In Review',         value: stats.inReview,  sub: `+ ${stats.drafts} drafts`,         up: false, Icon: Clock   },
              { label: 'Total Downloads',   value: stats.totalDl,   sub: `across ${stats.totalPubs} pubs`,   up: true,  Icon: Download },
              { label: 'Media Files',       value: stats.mediaCount,sub: 'photos, videos & docs',            up: true,  Icon: Eye     },
            ].map(({ label, value, sub, up, Icon }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-ngc-muted">{label}</p>
                  <Icon size={15} className="text-ngc-blue"/>
                </div>
                <p className="text-2xl font-bold text-ngc-navy font-display">{value?.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-[11px] mt-1 font-medium ${up?'text-green-600':'text-amber-500'}`}>
                  {up?<ArrowUp size={10}/>:<ArrowDown size={10}/>} {sub}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Content by type bar chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2 text-sm">
                <BarChart2 size={14} className="text-ngc-blue"/> Content by Type (Live)
              </h3>
              <div className="space-y-2.5">
                {Object.entries(stats.byType).sort((a,b)=>b[1]-a[1]).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-ngc-muted capitalize">{type.replace('_',' ')}</span>
                      <span className="text-xs font-semibold text-ngc-navy">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-ngc-blue transition-all" style={{width:`${(count/maxType)*100}%`}}/>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.byType).length === 0 && <p className="text-xs text-ngc-muted text-center py-4">No content data yet.</p>}
              </div>
            </div>

            {/* Traffic sources */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-ngc-navy mb-4 flex items-center gap-2 text-sm">
                <Globe size={14} className="text-ngc-blue"/> Traffic Sources
              </h3>
              <p className="text-[10px] text-ngc-muted mb-3">Estimated — integrate Google Analytics for live data</p>
              <div className="space-y-3">
                {TRAFFIC_SOURCES.map(({ source, pct, color }) => (
                  <div key={source}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-ngc-muted">{source}</span>
                      <span className="text-xs font-semibold text-ngc-navy">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${pct}%`,background:color}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top publications by downloads — live */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-ngc-navy text-sm flex items-center gap-2">
                <TrendingUp size={14} className="text-ngc-blue"/> Top Publications by Downloads (Live)
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {stats.topPubs.length === 0 && <p className="px-5 py-6 text-center text-ngc-muted text-xs">No publications yet.</p>}
              {stats.topPubs.map(pub => (
                <div key={pub.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ngc-navy truncate">{pub.title}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{pub.category}</span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-ngc-navy font-display">{(pub.downloads||0).toLocaleString()}</p>
                    <p className="text-[10px] text-ngc-muted">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </CMSLayout>
  )
}
