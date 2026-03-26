import { useState, useEffect, useCallback } from 'react'
import { UserPlus, Search, Edit2, Trash2, Shield, Check, X, Mail, Eye, Lock, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'
import { authAPI, getUser } from '../../utils/api'

const ROLES = [
  { name: 'admin',       label: 'Admin',       color: 'bg-purple-100 text-purple-700', perms: ['Create','Edit','Delete','Publish','Manage Users','Settings'] },
  { name: 'reviewer',    label: 'Approver',    color: 'bg-amber-100 text-amber-700',   perms: ['Edit','Approve','Publish'] },
  { name: 'editor',      label: 'Editor',      color: 'bg-blue-100 text-blue-700',     perms: ['Create','Edit','Submit for Review'] },
  { name: 'author',      label: 'Contributor', color: 'bg-green-100 text-green-700',   perms: ['Create','Edit Own','Submit for Review'] },
  { name: 'viewer',      label: 'Viewer',      color: 'bg-gray-100 text-gray-600',     perms: ['View Only'] },
]

const ROLE_COLORS = { admin:'bg-purple-100 text-purple-700', reviewer:'bg-amber-100 text-amber-700', editor:'bg-blue-100 text-blue-700', author:'bg-green-100 text-green-700', viewer:'bg-gray-100 text-gray-600' }

const ALL_PERMS = ['Create','Edit','Edit Own','Delete','Approve','Publish','Submit for Review','View Only','Manage Users','Settings']

export default function CMSUsers() {
  const [auditLog, setAuditLog] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState('users')
  const [showModal, setModal]   = useState(false)
  const currentUser = getUser()

  // Audit log is our window into real user data
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await authAPI.auditLog()
      setAuditLog(data.data || [])
    } catch (err) {
      // Non-admins get 403; show placeholder
      if (err.status === 403) {
        setAuditLog([])
        setError('Admin access required to view audit log.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Derive unique users from audit log
  const derivedUsers = []
  const seen = new Set()
  auditLog.forEach(entry => {
    if (entry.userId && !seen.has(entry.userId)) {
      seen.add(entry.userId)
      derivedUsers.push({ id: entry.userId, lastAction: entry.action, lastSeen: entry.timestamp })
    }
  })

  // Show current logged-in user at top
  const displayUsers = currentUser ? [
    { id: currentUser.id, name: currentUser.name, email: currentUser.email, role: currentUser.role, dept: currentUser.department, status: 'Active', initials: currentUser.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || 'U', color: '#1A56A5', lastLogin: 'Now' },
  ] : []

  const filteredUsers = displayUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <CMSLayout
      title="Users & Roles"
      subtitle="Manage staff access and permissions"
      action={
        <button onClick={() => setModal(true)} className="btn-primary text-xs py-2">
          <UserPlus size={13}/> Invite User
        </button>
      }
    >
      <div className="flex border-b border-gray-200 mb-5">
        {['users','roles','audit'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px
              ${tab===t?'border-ngc-blue text-ngc-blue':'border-transparent text-ngc-muted hover:text-ngc-navy'}`}>
            {t === 'audit' ? 'Audit Log' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && tab !== 'audit' && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-amber-700 text-xs">
          <AlertCircle size={14}/> {error}
        </div>
      )}

      {tab === 'users' && (
        <>
          <div className="relative max-w-sm mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input className="input-field pl-9 py-2 text-xs" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] text-ngc-muted uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Last Login</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-ngc-muted text-xs">
                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin text-ngc-blue"/>Loading…</span> : 'No users found.'}
                  </td></tr>
                )}
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{background: user.color}}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-ngc-navy">{user.name}</p>
                          <p className="text-[10px] text-ngc-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`badge text-[10px] ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{user.dept}</td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden lg:table-cell">{user.lastLogin}</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-[10px] ${user.status==='Active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100">
                        <button className="text-ngc-blue hover:text-ngc-navy" title="View"><Eye size={13}/></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Edit"><Edit2 size={13}/></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Reset password"><Lock size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-ngc-muted mt-3 text-center">Full user management is admin-only. Contact your system administrator to add or remove users.</p>
        </>
      )}

      {tab === 'roles' && (
        <div className="grid gap-4">
          {ROLES.map(role => (
            <div key={role.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-ngc-blue"/>
                <span className={`badge ${role.color}`}>{role.label}</span>
                <span className="text-[10px] text-ngc-muted font-mono bg-gray-100 px-1.5 py-0.5 rounded">{role.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_PERMS.map(perm => {
                  const has = role.perms.includes(perm)
                  return (
                    <span key={perm} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium
                      ${has?'bg-green-50 text-green-700 border-green-200':'bg-gray-50 text-gray-300 border-gray-100'}`}>
                      {has?<Check size={9}/>:<X size={9}/>} {perm}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-ngc-navy text-sm">Audit Log</h3>
            <button onClick={load} className="text-xs text-ngc-blue hover:underline flex items-center gap-1"><RefreshCw size={11}/> Refresh</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-ngc-muted text-sm">
              <Loader2 size={16} className="animate-spin text-ngc-blue"/> Loading…
            </div>
          ) : error ? (
            <div className="px-5 py-8 text-center text-ngc-muted text-xs">{error}</div>
          ) : auditLog.length === 0 ? (
            <div className="px-5 py-8 text-center text-ngc-muted text-xs">No audit entries yet.</div>
          ) : (
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {auditLog.map((entry, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${entry.action?.includes('LOGIN_SUCCESS')?'bg-green-400':entry.action?.includes('FAIL')?'bg-red-400':'bg-blue-400'}`}/>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ngc-muted min-w-[100px]">{entry.action}</span>
                  <span className="text-xs text-ngc-navy flex-1 truncate">{entry.detail}</span>
                  <span className="text-[10px] text-ngc-muted flex-shrink-0">{entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ngc-navy text-base">Invite New User</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mb-4">
              User creation is handled by the system administrator via the backend. Contact IT to provision new accounts.
            </div>
            <div className="space-y-3 opacity-60 pointer-events-none">
              <div><label className="block text-xs font-medium text-ngc-muted mb-1">Full Name</label><input className="input-field text-xs py-2" placeholder="e.g. Ahmed Khan" disabled/></div>
              <div><label className="block text-xs font-medium text-ngc-muted mb-1">Email Address</label><input type="email" className="input-field text-xs py-2" placeholder="user@ngc.gov.pk" disabled/></div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setModal(false)} className="btn-primary text-xs py-1.5 px-4"><Mail size={12}/> Contact IT Admin</button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
