import { Link } from 'react-router-dom'
import { ArrowRight, Users, Building2, Newspaper, TrendingUp } from 'lucide-react'

const AUDIENCES = [
  {
    icon: Users,
    title: 'General Public',
    desc: 'Learn how NGC powers Pakistan and find information about grid services, safety, and public initiatives.',
    cta: 'Public Information',
    href: '/about',
    color: 'border-ngc-sky hover:bg-ngc-sky/5',
    iconBg: 'bg-ngc-sky/10 text-ngc-sky',
  },
  {
    icon: Building2,
    title: 'Government & Regulators',
    desc: 'Access regulatory filings, compliance documents, governance reports, and stakeholder briefings.',
    cta: 'Governance Docs',
    href: '/about/governance',
    color: 'border-ngc-gold hover:bg-ngc-gold/5',
    iconBg: 'bg-ngc-gold/10 text-ngc-gold',
  },
  {
    icon: Newspaper,
    title: 'Media & Press',
    desc: 'Download media kits, request interviews, access high-resolution images, and find press contacts.',
    cta: 'Media Centre',
    href: '/media',
    color: 'border-purple-300 hover:bg-purple-50/50',
    iconBg: 'bg-purple-50 text-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Investors & Donors',
    desc: 'Review financial performance, investment opportunities, project portfolios, and corporate strategy.',
    cta: 'Investor Relations',
    href: '/contact',
    color: 'border-green-300 hover:bg-green-50/50',
    iconBg: 'bg-green-50 text-green-600',
  },
]

export default function StakeholderCTA() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-ngc-gold font-semibold text-xs uppercase tracking-widest mb-2">Stakeholder Gateway</p>
          <h2 className="section-title">Who Are You Looking For?</h2>
          <p className="text-ngc-muted text-sm mt-2 max-w-xl mx-auto">
            NGC serves diverse stakeholders. Find the information most relevant to you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AUDIENCES.map(({ icon: Icon, title, desc, cta, href, color, iconBg }) => (
            <div key={title} className={`rounded-xl border-2 p-6 flex flex-col gap-4 transition-colors duration-200 ${color}`}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ngc-navy text-base mb-2">{title}</h3>
                <p className="text-ngc-muted text-sm leading-relaxed">{desc}</p>
              </div>
              <Link to={href} className="flex items-center gap-1.5 text-sm font-medium text-ngc-blue hover:gap-2.5 transition-all">
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
