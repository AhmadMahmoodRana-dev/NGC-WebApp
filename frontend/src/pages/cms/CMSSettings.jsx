import { useState } from 'react'
import {
  Settings, Globe, Bell, Shield, Mail, Database,
  Save, RefreshCw, Check, AlertTriangle, Eye, EyeOff,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const SECTIONS = [
  { id: 'general',  label: 'General',       Icon: Globe   },
  { id: 'notif',    label: 'Notifications', Icon: Bell    },
  { id: 'security', label: 'Security',      Icon: Shield  },
  { id: 'email',    label: 'Email / SMTP',  Icon: Mail    },
  { id: 'backup',   label: 'Backup & Data', Icon: Database},
]

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-ngc-blue' : 'bg-gray-200'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-4' : 'left-0.5'}`} />
    </button>
  )
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-ngc-navy">{label}</p>
        {desc && <p className="text-[11px] text-ngc-muted mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0 flex items-center">{children}</div>
    </div>
  )
}

export default function CMSSettings() {
  const [section, setSection]     = useState('general')
  const [saved, setSaved]         = useState(false)
  const [showPass, setShowPass]   = useState(false)

  // General
  const [siteName, setSiteName]   = useState('National Grid Company of Pakistan')
  const [tagline, setTagline]     = useState('Connecting Pakistan, Powering Progress')
  const [maintenance, setMaint]   = useState(false)
  const [lang, setLang]           = useState('en')

  // Notifications
  const [emailNotif, setEmailNotif]     = useState(true)
  const [reviewAlert, setReviewAlert]   = useState(true)
  const [publishAlert, setPublishAlert] = useState(true)
  const [digestFreq, setDigestFreq]     = useState('daily')

  // Security
  const [twoFA, setTwoFA]             = useState(true)
  const [sessionTimeout, setSession]  = useState('60')
  const [loginAttempts, setAttempts]  = useState('5')
  const [auditLog, setAuditLog]       = useState(true)

  // Email
  const [smtpHost, setSmtpHost]   = useState('smtp.ngc.gov.pk')
  const [smtpPort, setSmtpPort]   = useState('587')
  const [smtpUser, setSmtpUser]   = useState('cms-noreply@ngc.gov.pk')
  const [smtpPass, setSmtpPass]   = useState('••••••••••••')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <CMSLayout
      title="Settings"
      subtitle="System configuration & preferences"
      action={
        <button onClick={handleSave} className="btn-primary text-xs py-2">
          {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
        </button>
      }
    >
      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2 text-xs text-green-700 font-medium">
          <Check size={13} /> Settings saved successfully.
        </div>
      )}

      <div className="flex gap-5">
        {/* Sidebar nav */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-0.5 bg-white rounded-xl border border-gray-100 shadow-sm p-2">
            {SECTIONS.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition-colors
                  ${section === id ? 'bg-ngc-blue text-white' : 'text-ngc-muted hover:bg-gray-100 hover:text-ngc-navy'}`}>
                <Icon size={13} className="flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">

          {section === 'general' && (
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-sm flex items-center gap-2"><Globe size={14} className="text-ngc-blue" /> General Settings</h3>
              <SettingRow label="Site Name" desc="Displayed in browser tab and email footers.">
                <input value={siteName} onChange={e => setSiteName(e.target.value)} className="input-field text-xs py-1.5 w-64" />
              </SettingRow>
              <SettingRow label="Tagline" desc="Short description shown in metadata.">
                <input value={tagline} onChange={e => setTagline(e.target.value)} className="input-field text-xs py-1.5 w-64" />
              </SettingRow>
              <SettingRow label="Default Language">
                <select value={lang} onChange={e => setLang(e.target.value)} className="input-field text-xs py-1.5 w-32">
                  <option value="en">English</option>
                  <option value="ur">اردو (Urdu)</option>
                </select>
              </SettingRow>
              <SettingRow label="Maintenance Mode" desc="When enabled, the public website shows a maintenance notice.">
                <div className="flex items-center gap-2">
                  <Toggle on={maintenance} onChange={setMaint} />
                  {maintenance && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
                      <AlertTriangle size={10} /> Site is offline to public
                    </span>
                  )}
                </div>
              </SettingRow>
            </div>
          )}

          {section === 'notif' && (
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-sm flex items-center gap-2"><Bell size={14} className="text-ngc-blue" /> Notification Settings</h3>
              <SettingRow label="Email Notifications" desc="Receive email alerts for CMS activity.">
                <Toggle on={emailNotif} onChange={setEmailNotif} />
              </SettingRow>
              <SettingRow label="Content Review Alerts" desc="Notify when content is submitted for review.">
                <Toggle on={reviewAlert} onChange={setReviewAlert} />
              </SettingRow>
              <SettingRow label="Publish Alerts" desc="Notify when content is approved and published.">
                <Toggle on={publishAlert} onChange={setPublishAlert} />
              </SettingRow>
              <SettingRow label="Digest Frequency" desc="How often to send activity digest emails.">
                <select value={digestFreq} onChange={e => setDigestFreq(e.target.value)} className="input-field text-xs py-1.5 w-32">
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="none">Off</option>
                </select>
              </SettingRow>
            </div>
          )}

          {section === 'security' && (
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-sm flex items-center gap-2"><Shield size={14} className="text-ngc-blue" /> Security</h3>
              <SettingRow label="Two-Factor Authentication" desc="Require 2FA for all CMS users.">
                <Toggle on={twoFA} onChange={setTwoFA} />
              </SettingRow>
              <SettingRow label="Session Timeout (minutes)" desc="Automatically log out inactive users.">
                <select value={sessionTimeout} onChange={e => setSession(e.target.value)} className="input-field text-xs py-1.5 w-28">
                  <option value="30">30 min</option><option value="60">60 min</option>
                  <option value="120">2 hours</option><option value="480">8 hours</option>
                </select>
              </SettingRow>
              <SettingRow label="Max Login Attempts" desc="Lock account after this many failed attempts.">
                <select value={loginAttempts} onChange={e => setAttempts(e.target.value)} className="input-field text-xs py-1.5 w-28">
                  <option value="3">3</option><option value="5">5</option><option value="10">10</option>
                </select>
              </SettingRow>
              <SettingRow label="Audit Logging" desc="Log all user actions for compliance review.">
                <Toggle on={auditLog} onChange={setAuditLog} />
              </SettingRow>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <button className="btn-outline text-xs py-1.5 px-4 text-red-500 border-red-200 hover:bg-red-500 hover:border-red-500 hover:text-white">
                  Force Logout All Users
                </button>
              </div>
            </div>
          )}

          {section === 'email' && (
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-sm flex items-center gap-2"><Mail size={14} className="text-ngc-blue" /> Email / SMTP Configuration</h3>
              <SettingRow label="SMTP Host">
                <input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} className="input-field text-xs py-1.5 w-56" />
              </SettingRow>
              <SettingRow label="SMTP Port">
                <input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} className="input-field text-xs py-1.5 w-24" />
              </SettingRow>
              <SettingRow label="SMTP Username">
                <input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} className="input-field text-xs py-1.5 w-56" />
              </SettingRow>
              <SettingRow label="SMTP Password">
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={smtpPass}
                    onChange={e => setSmtpPass(e.target.value)} className="input-field text-xs py-1.5 w-56 pr-8" />
                  <button onClick={() => setShowPass(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </SettingRow>
              <div className="pt-4 mt-2 border-t border-gray-100">
                <button className="btn-outline text-xs py-1.5 px-4">
                  <RefreshCw size={12} /> Test Connection
                </button>
              </div>
            </div>
          )}

          {section === 'backup' && (
            <div>
              <h3 className="font-semibold text-ngc-navy mb-4 text-sm flex items-center gap-2"><Database size={14} className="text-ngc-blue" /> Backup & Data</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-xs text-ngc-muted">
                Last backup: <span className="font-semibold text-ngc-navy">25 Mar 2026, 02:00 AM</span> &nbsp;·&nbsp; Size: <span className="font-semibold text-ngc-navy">2.4 GB</span> &nbsp;·&nbsp; Status: <span className="text-green-600 font-semibold">Success</span>
              </div>
              <SettingRow label="Automatic Backups" desc="Schedule daily backups of the database and media.">
                <Toggle on={true} onChange={() => {}} />
              </SettingRow>
              <SettingRow label="Backup Frequency">
                <select className="input-field text-xs py-1.5 w-32">
                  <option>Daily</option><option>Weekly</option>
                </select>
              </SettingRow>
              <SettingRow label="Retention Period" desc="How long to keep backup files.">
                <select className="input-field text-xs py-1.5 w-32">
                  <option>7 days</option><option>30 days</option><option>90 days</option>
                </select>
              </SettingRow>
              <div className="pt-4 mt-2 border-t border-gray-100 flex gap-2">
                <button className="btn-primary text-xs py-1.5 px-4"><Database size={12} /> Run Backup Now</button>
                <button className="btn-outline text-xs py-1.5 px-4">Download Latest</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </CMSLayout>
  )
}
