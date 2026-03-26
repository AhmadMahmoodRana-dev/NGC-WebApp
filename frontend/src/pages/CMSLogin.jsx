import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { authAPI, setTokens, setUser } from '../utils/api'

export default function CMSLogin() {
  const [step, setStep]       = useState('login')
  const [form, setForm]       = useState({ username: '', password: '' })
  const [mfaCode, setMfaCode] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate              = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authAPI.login(form.username, form.password)
      if (data.success && data.requiresMFA) setStep('mfa')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMFA = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authAPI.verifyMFA(form.username, form.password, mfaCode)
      if (data.success) {
        setTokens(data.accessToken, data.refreshToken)
        setUser(data.user)
        navigate('/cms/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid MFA code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ngc-navy via-ngc-navy-mid to-ngc-blue flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',backgroundSize:'50px 50px'}} />
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-ngc-navy px-8 py-6 text-center border-b-4 border-ngc-gold">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
                  <path d="M8 36 L24 12 L40 36" stroke="#2E87D4" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M14 28 L34 28" stroke="#C8922A" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="24" cy="12" r="3" fill="#F0B849"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="font-display text-white text-lg font-bold tracking-widest">NGC</div>
                <div className="text-[9px] text-white/50 tracking-widest uppercase">National Grid Company</div>
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 text-white">
              <Shield size={16} className="text-ngc-gold" />
              <span className="text-sm font-medium">Staff Portal — Secure Login</span>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-7">
              <div className={`flex items-center gap-2 text-xs font-medium ${step==='login'?'text-ngc-blue':'text-green-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${step==='login'?'bg-ngc-blue':'bg-green-500'}`}>{step==='mfa'?'✓':'1'}</div>
                Credentials
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 text-xs font-medium ${step==='mfa'?'text-ngc-blue':'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step==='mfa'?'bg-ngc-blue text-white':'bg-gray-200 text-gray-500'}`}>2</div>
                MFA Verification
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded px-3 py-2.5 mb-5 text-red-600 text-sm">
                <AlertCircle size={14}/> {error}
              </div>
            )}

            {step === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Username / Employee ID</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.username} required autoComplete="username"
                      onChange={e=>setForm(f=>({...f,username:e.target.value}))}
                      className="input-field pl-9" placeholder="Enter your username" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs text-ngc-blue hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPw?'text':'password'} value={form.password} required autoComplete="current-password"
                      onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                      className="input-field pl-9 pr-10" placeholder="Enter your password" />
                    <button type="button" onClick={()=>setShowPw(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading?<><Loader2 size={14} className="animate-spin"/>Signing In…</>:<>Continue <ArrowRight size={14}/></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMFA} className="space-y-5">
                <div className="text-center py-2">
                  <div className="w-14 h-14 bg-ngc-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield size={26} className="text-ngc-blue" />
                  </div>
                  <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                  <p className="text-xs text-ngc-muted mt-1">Enter the 6-digit code from your Authenticator app for <strong>NGC Staff Portal</strong>.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 text-center">Authentication Code</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code"
                    value={mfaCode} onChange={e=>setMfaCode(e.target.value.replace(/\D/g,''))} required
                    className="input-field text-center text-2xl tracking-[0.5em] font-mono" placeholder="000000" />
                </div>
                <button type="submit" disabled={loading||mfaCode.length<6} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading?<><Loader2 size={14} className="animate-spin"/>Verifying…</>:<>Verify & Login <ArrowRight size={14}/></>}
                </button>
                <button type="button" onClick={()=>{setStep('login');setError('')}} className="w-full text-center text-xs text-ngc-muted hover:text-ngc-blue transition-colors">
                  ← Back to credentials
                </button>
              </form>
            )}
          </div>
          <div className="px-8 pb-6 text-center">
            <p className="text-[10px] text-gray-400">This portal is restricted to authorised NGC personnel only.</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-white/60 text-xs hover:text-white/90 transition-colors">← Return to NGC Website</Link>
        </div>
      </div>
    </div>
  )
}
