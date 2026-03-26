import { useState } from 'react'
import {
  UserPlus, Search, Edit2, Trash2, Shield,
  Check, X, Mail, Users, Lock, Eye,
} from 'lucide-react'
import CMSLayout from '../../components/cms/CMSLayout'

const USERS = [
  { id: 1, name: 'Khalid Mehmood',   email: 'k.mehmood@ngc.gov.pk',    role: 'Editor',      dept: 'PR',        status: 'Active',   lastLogin: '26 Mar 2026, 09:14', initials: 'KM', color: '#1A56A5' },
  { id: 2, name: 'Sadia Nawaz',      email: 's.nawaz@ngc.gov.pk',      role: 'Editor',      dept: 'PR',        status: 'Active',   lastLogin: '26 Mar 2026, 08:50', initials: 'SN', color: '#C8922A' },
  { id: 3, name: 'Tariq Saleem',     email: 't.saleem@ngc.gov.pk',     role: 'Contributor', dept: 'Operations',status: 'Active',   lastLogin: '25 Mar 2026, 17:30', initials: 'TS', color: '#2E87D4' },
  { id: 4, name: 'Asim Rafiq',       email: 'a.rafiq@ngc.gov.pk',      role: 'Contributor', dept: 'Procurement',status:'Active',   lastLogin: '25 Mar 2026, 14:00', initials: 'AR', color: '#0B1E3E' },
  { id: 5, name: 'Nadia Asghar',     email: 'n.asghar@ngc.gov.pk',     role: 'Approver',    dept: 'Finance',   status: 'Active',   lastLogin: '24 Mar 2026, 11:20', initials: 'NA', color: '#5A6070' },
  { id: 6, name: 'Imran Hussain',    email: 'i.hussain@ngc.gov.pk',    role: 'Admin',       dept: 'IT',        status: 'Active',   lastLogin: '26 Mar 2026, 07:55', initials: 'IH', color: '#122952' },
  { id: 7, name: 'Fatima Zahra',     email: 'f.zahra@ngc.gov.pk',      role: 'Viewer',      dept: 'CEO Office',status: 'Active',   lastLogin: '22 Mar 2026, 10:10', initials: 'FZ', color: '#F0B849' },
  { id: 8, name: 'Bilal Ahmed',      email: 'b.ahmed@ngc.gov.pk',      role: 'Contributor', dept: 'Grid Ops',  status: 'Inactive', lastLogin: '10 Mar 2026, 09:00', initials: 'BA', color: '#9CA3AF' },
]

const ROLES = [
  { name: 'Admin',       color: 'bg-purple-100 text-purple-700', perms: ['Create', 'Edit', 'Delete', 'Publish', 'Manage Users', 'Settings'] },
  { name: 'Approver',    color: 'bg-amber-100 text-amber-700',   perms: ['Edit', 'Approve', 'Publish'] },
  { name: 'Editor',      color: 'bg-blue-100 text-blue-700',     perms: ['Create', 'Edit', 'Submit for Review'] },
  { name: 'Contributor', color: 'bg-green-100 text-green-700',   perms: ['Create', 'Edit Own', 'Submit for Review'] },
  { name: 'Viewer',      color: 'bg-gray-100 text-gray-600',     perms: ['View Only'] },
]

const ROLE_COLORS = {
  Admin:       'bg-purple-100 text-purple-700',
  Approver:    'bg-amber-100 text-amber-700',
  Editor:      'bg-blue-100 text-blue-700',
  Contributor: 'bg-green-100 text-green-700',
  Viewer:      'bg-gray-100 text-gray-600',
}

export default function CMSUsers() {
  const [users, setUsers]       = useState(USERS)
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState('users')
  const [showModal, setShowModal] = useState(false)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.dept.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = users.filter(u => u.status === 'Active').length

  return (
    <CMSLayout
      title="Users & Roles"
      subtitle={`${activeCount} active users`}
      action={
        <button onClick={() => setShowModal(true)} className="btn-primary text-xs py-2">
          <UserPlus size={13} /> Invite User
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {['users', 'roles'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px
              ${tab === t ? 'border-ngc-blue text-ngc-blue' : 'border-transparent text-ngc-muted hover:text-ngc-navy'}`}>
            {t === 'users' ? `Users (${users.length})` : 'Role Matrix'}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <div className="relative max-w-sm mb-4">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 py-2 text-xs" placeholder="Search users…"
              value={search} onChange={e => setSearch(e.target.value)} />
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
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: user.color }}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-ngc-navy">{user.name}</p>
                          <p className="text-[10px] text-ngc-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`badge text-[10px] ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden md:table-cell">{user.dept}</td>
                    <td className="px-4 py-3.5 text-xs text-ngc-muted hidden lg:table-cell">{user.lastLogin}</td>
                    <td className="px-4 py-3.5">
                      <span className={`badge text-[10px] ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100">
                        <button className="text-ngc-blue hover:text-ngc-navy" title="View profile"><Eye size={13} /></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Edit"><Edit2 size={13} /></button>
                        <button className="text-ngc-blue hover:text-ngc-navy" title="Reset password"><Lock size={13} /></button>
                        <button onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                          className="text-red-400 hover:text-red-600" title="Remove"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'roles' && (
        <div className="grid gap-4">
          {ROLES.map(role => (
            <div key={role.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={16} className="text-ngc-blue" />
                <span className={`badge ${role.color}`}>{role.name}</span>
                <span className="text-xs text-ngc-muted">
                  {users.filter(u => u.role === role.name).length} user{users.filter(u => u.role === role.name).length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Create', 'Edit', 'Edit Own', 'Delete', 'Approve', 'Publish', 'Submit for Review', 'View Only', 'Manage Users', 'Settings'].map(perm => {
                  const has = role.perms.includes(perm)
                  return (
                    <span key={perm}
                      className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium
                        ${has ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>
                      {has ? <Check size={9} /> : <X size={9} />}
                      {perm}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ngc-navy text-base">Invite New User</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Full Name</label>
                <input className="input-field text-xs py-2" placeholder="e.g. Ahmed Khan" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ngc-muted mb-1">Email Address</label>
                <input type="email" className="input-field text-xs py-2" placeholder="user@ngc.gov.pk" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Role</label>
                  <select className="input-field text-xs py-2">
                    {ROLES.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ngc-muted mb-1">Department</label>
                  <select className="input-field text-xs py-2">
                    <option>PR</option><option>Operations</option><option>Finance</option>
                    <option>IT</option><option>CEO Office</option><option>Procurement</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-outline text-xs py-1.5 px-4">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary text-xs py-1.5 px-4">
                <Mail size={12} /> Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </CMSLayout>
  )
}
