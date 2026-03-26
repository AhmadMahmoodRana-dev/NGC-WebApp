import { Link } from 'react-router-dom'
import { Zap, Network, Activity, MapPin } from 'lucide-react'

export default function OperationsPage() {
  return (
    <div className="font-body">
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-white/50 flex items-center gap-2">
          <Link to="/" className="hover:text-white">Home</Link><span>/</span>
          <span className="text-white">Operations</span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">Grid & Infrastructure</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Operations & Projects</h1>
          <p className="text-white/70 text-base max-w-xl">Overseeing 8,200+ km of transmission lines and 1,100+ grid stations across Pakistan.</p>
        </div>
      </div>
      <section className="py-14 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap,      title: 'Grid Network',          desc: 'National high-voltage transmission infrastructure across all provinces.', href: '/operations/grid'    },
              { icon: Network,  title: 'Transmission Projects', desc: 'Ongoing and planned capital projects to expand and modernise the grid.',   href: '/operations/projects'},
              { icon: Activity, title: 'System Control',        desc: 'Real-time load dispatch and system control from national control centres.',href: '/operations/system-control'},
            ].map(({ icon: Icon, title, desc, href }) => (
              <Link key={title} to={href} className="card p-6 group hover:border-ngc-blue/30">
                <div className="w-12 h-12 rounded-lg bg-ngc-blue/10 flex items-center justify-center mb-4 group-hover:bg-ngc-blue/20 transition-colors">
                  <Icon size={22} className="text-ngc-blue" />
                </div>
                <h3 className="font-semibold text-ngc-navy mb-2 group-hover:text-ngc-blue transition-colors">{title}</h3>
                <p className="text-sm text-ngc-muted leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
