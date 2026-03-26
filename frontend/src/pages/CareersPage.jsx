import { Link } from 'react-router-dom'
import { MapPin, Clock, ArrowRight, Briefcase } from 'lucide-react'

const JOBS = [
  { id:1, title:'Senior Transmission Engineer',  dept:'Operations',  location:'Lahore',    type:'Full-time',  deadline:'Apr 30, 2026' },
  { id:2, title:'Grid Control System Analyst',   dept:'IT & Digital', location:'Islamabad', type:'Full-time',  deadline:'Apr 20, 2026' },
  { id:3, title:'Financial Analyst',             dept:'Finance',     location:'Lahore',    type:'Full-time',  deadline:'Apr 25, 2026' },
  { id:4, title:'Legal Counsel',                 dept:'Legal',       location:'Lahore',    type:'Full-time',  deadline:'Apr 15, 2026' },
  { id:5, title:'Communication Officer',         dept:'PR',          location:'Lahore',    type:'Full-time',  deadline:'May 5, 2026'  },
  { id:6, title:'Graduate Trainee Engineer',     dept:'Operations',  location:'Multiple',  type:'Trainee',    deadline:'Apr 30, 2026' },
]

export default function CareersPage() {
  return (
    <div className="font-body">
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-white/50 flex items-center gap-2">
          <Link to="/" className="hover:text-white">Home</Link><span>/</span>
          <span className="text-white">Careers</span>
        </div>
      </div>
      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">Join Our Team</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Careers at NGC</h1>
          <p className="text-white/70 text-base max-w-xl">Shape the future of Pakistan's power grid. Explore opportunities across engineering, technology, finance, and more.</p>
        </div>
      </div>

      <section className="py-14 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="section-title mb-6">Current Openings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {JOBS.map(job => (
              <div key={job.id} className="card p-5 flex items-start gap-4 group hover:border-ngc-blue/30">
                <div className="w-10 h-10 rounded bg-ngc-blue/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={16} className="text-ngc-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ngc-navy group-hover:text-ngc-blue transition-colors text-sm">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-ngc-muted">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">{job.dept}</span>
                    <span className="flex items-center gap-1"><MapPin size={10}/>{job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={10}/>Deadline: {job.deadline}</span>
                  </div>
                </div>
                <button className="btn-outline text-xs py-1.5 flex-shrink-0">Apply</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
