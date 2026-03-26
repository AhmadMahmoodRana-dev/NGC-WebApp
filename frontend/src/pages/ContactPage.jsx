import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'

const INQUIRY_TYPES = [
  { value: 'general',    label: 'General Inquiry'     },
  { value: 'media',      label: 'Media / Press'        },
  { value: 'investor',   label: 'Investor Relations'   },
  { value: 'tender',     label: 'Tender Information'   },
  { value: 'hr',         label: 'HR / Careers'         },
  { value: 'complaint',  label: 'Complaint / Feedback' },
  { value: 'government', label: 'Government / Regulatory' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'general', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      // Demo: show success regardless
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-body">
      {/* Breadcrumb */}
      <div className="bg-ngc-navy py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-white/50 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-br from-ngc-navy to-ngc-blue py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-ngc-gold-light text-xs uppercase tracking-widest font-semibold mb-2">Get In Touch</p>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Contact NGC</h1>
          <p className="text-white/70 text-base max-w-xl">Reach out to the right department — we respond to all inquiries within 2 business days.</p>
        </div>
      </div>

      <section className="py-16 bg-ngc-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-lg">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded bg-ngc-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-ngc-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-ngc-muted uppercase tracking-wider font-medium mb-0.5">Head Office</p>
                    <p className="text-sm text-gray-700">NGC House, Shahrah-e-Quaid-e-Azam, Lahore, Punjab 54000, Pakistan</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded bg-ngc-blue/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-ngc-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-ngc-muted uppercase tracking-wider font-medium mb-0.5">Telephone</p>
                    <a href="tel:+924235205001" className="text-sm text-gray-700 hover:text-ngc-blue transition-colors">+92-42-3520-5001</a>
                    <p className="text-xs text-ngc-muted mt-0.5">Emergency: +92-42-3520-5009 (24/7)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded bg-ngc-blue/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-ngc-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-ngc-muted uppercase tracking-wider font-medium mb-0.5">Email</p>
                    <a href="mailto:info@ngc.gov.pk" className="text-sm text-gray-700 hover:text-ngc-blue transition-colors">info@ngc.gov.pk</a>
                    <p className="text-xs text-ngc-muted mt-0.5">Media: pr@ngc.gov.pk</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-ngc-navy rounded-xl p-5 text-white">
              <h4 className="font-semibold mb-2 text-sm">Departmental Contacts</h4>
              <ul className="space-y-2 text-xs text-white/70">
                {[
                  { dept: 'HR & Careers',    email: 'hr@ngc.gov.pk'        },
                  { dept: 'Procurement',     email: 'tenders@ngc.gov.pk'   },
                  { dept: 'Media & PR',      email: 'pr@ngc.gov.pk'        },
                  { dept: 'IT Support',      email: 'itsupport@ngc.gov.pk' },
                  { dept: 'Investor Rel.',   email: 'ir@ngc.gov.pk'        },
                ].map(({ dept, email }) => (
                  <li key={dept} className="flex justify-between items-center border-b border-white/10 pb-1.5 last:border-0 last:pb-0">
                    <span>{dept}</span>
                    <a href={`mailto:${email}`} className="text-ngc-sky hover:text-ngc-gold-light transition-colors">{email}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-ngc-navy">Message Sent!</h3>
                <p className="text-ngc-muted text-sm max-w-sm">Thank you for contacting NGC. Our team will respond to your inquiry within 2 business days.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name:'',email:'',phone:'',type:'general',subject:'',message:'' }) }}
                  className="btn-outline text-xs mt-2">Send Another Message</button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-ngc-navy text-lg mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required
                        className="input-field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        className="input-field" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        className="input-field" placeholder="+92 300 000 0000" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Inquiry Type *</label>
                      <select name="type" value={form.type} onChange={handleChange} required className="input-field">
                        {INQUIRY_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Subject *</label>
                    <input name="subject" value={form.subject} onChange={handleChange} required
                      className="input-field" placeholder="Brief subject of your inquiry" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="input-field resize-none" placeholder="Describe your inquiry in detail..." />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                      {loading ? 'Sending...' : <><Send size={14} /> Send Message</>}
                    </button>
                    <p className="text-xs text-ngc-muted">* Required fields</p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
