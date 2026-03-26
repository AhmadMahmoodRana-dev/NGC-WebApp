import { Zap, Network, Globe, TrendingUp } from 'lucide-react'

const STATS = [
  { icon: Zap,        value: '22,000+', unit: 'MW',  label: 'Transmission Capacity',  color: 'text-ngc-gold'   },
  { icon: Network,    value: '8,200+',  unit: 'km',  label: 'Transmission Line Length',color: 'text-ngc-sky'    },
  { icon: Globe,      value: '1,100+',  unit: '',    label: 'Grid Stations Operated',  color: 'text-green-400'  },
  { icon: TrendingUp, value: '99.4',    unit: '%',   label: 'System Uptime Reliability',color:'text-ngc-gold-light'},
]

export default function StatsSection() {
  return (
    <section className="bg-ngc-navy py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
          {STATS.map(({ icon: Icon, value, unit, label, color }) => (
            <div key={label} className="bg-ngc-navy-mid p-6 lg:p-8 text-center group hover:bg-ngc-blue/30 transition-colors duration-300">
              <Icon size={24} className={`${color} mx-auto mb-3 opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className={`font-display text-3xl lg:text-4xl font-bold ${color}`}>{value}</span>
                {unit && <span className="text-white/50 text-sm font-medium">{unit}</span>}
              </div>
              <p className="text-white/60 text-xs uppercase tracking-wider font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
