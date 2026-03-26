import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    title: '500kV Lahore–Islamabad HVDC Link',
    location: 'Punjab Corridor',
    status: 'Completed',
    statusColor: 'text-green-600 bg-green-50',
    StatusIcon: CheckCircle,
    progress: 100,
    progressColor: 'bg-green-500',
    desc: 'High-voltage direct current transmission line spanning 380km, commissioned Q4 2025.',
    href: '/operations/projects/1',
  },
  {
    id: 2,
    title: 'Tarbela–Peshawar 500kV Transmission Spine',
    location: 'KPK Region',
    status: 'In Progress',
    statusColor: 'text-blue-600 bg-blue-50',
    StatusIcon: Clock,
    progress: 62,
    progressColor: 'bg-ngc-blue',
    desc: 'Northern transmission backbone expansion to support hydropower evacuation from Tarbela.',
    href: '/operations/projects/2',
  },
  {
    id: 3,
    title: 'Karachi Grid Reinforcement Project',
    location: 'Sindh',
    status: 'In Progress',
    statusColor: 'text-blue-600 bg-blue-50',
    StatusIcon: Clock,
    progress: 38,
    progressColor: 'bg-ngc-sky',
    desc: 'Reinforcement of the Karachi metropolitan area grid to support industrial and residential load growth.',
    href: '/operations/projects/3',
  },
  {
    id: 4,
    title: 'Smart Substation Automation — Phase I',
    location: 'Nationwide (47 sites)',
    status: 'Procurement',
    statusColor: 'text-amber-600 bg-amber-50',
    StatusIcon: AlertCircle,
    progress: 15,
    progressColor: 'bg-amber-400',
    desc: 'SCADA and digital automation upgrades across 47 grid stations under the Smart Grid Modernisation Programme.',
    href: '/operations/projects/4',
  },
]

export default function ProjectsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-1">Infrastructure</p>
            <h2 className="section-title">Projects & Operations</h2>
          </div>
          <Link to="/operations/projects" className="btn-outline text-xs py-2">
            All Projects <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROJECTS.map(({ id, title, location, status, statusColor, StatusIcon, progress, progressColor, desc, href }) => (
            <Link key={id} to={href} className="card p-5 flex flex-col gap-3 group">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`badge ${statusColor} flex items-center gap-1`}>
                  <StatusIcon size={10} /> {status}
                </span>
                <span className="text-xs text-ngc-muted flex items-center gap-1">
                  <MapPin size={10} /> {location}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-ngc-navy leading-snug group-hover:text-ngc-blue transition-colors">
                {title}
              </h3>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-ngc-muted mb-1">
                  <span>Completion</span>
                  <span className="font-semibold text-gray-700">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressColor} rounded-full transition-all duration-700`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Desc */}
              <p className="text-xs text-ngc-muted leading-relaxed flex-1">{desc}</p>

              <div className="text-ngc-blue text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
