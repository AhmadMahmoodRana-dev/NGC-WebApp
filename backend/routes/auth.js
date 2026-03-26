const express   = require('express')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const pool = require('../db')

const router = express.Router()
const JWT_SECRET         = process.env.JWT_SECRET          || 'ngc-dev-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET  || 'ngc-refresh-secret-change-in-production'
const JWT_EXPIRES        = process.env.JWT_EXPIRES         || '8h'

// ── In-memory audit log (replace with DB table if needed) ──────────
const auditLog = []

function logAudit(action, userId, detail, ip) {
  auditLog.unshift({ action, userId, detail, ip, timestamp: new Date().toISOString() })
  if (auditLog.length > 1000) auditLog.pop()
}

// ── Helper: look up user from DB ───────────────────────────────────
async function findUser(usernameOrEmail) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [usernameOrEmail]
  )
  return rows[0] || null
}

// ── Helper: look up user by ID from DB ────────────────────────────
async function findUserById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  )
  return rows[0] || null
}

function generateTokens(user) {
  const payload = {
    id:         user.id,
    username:   user.username,
    role:       user.role,
    department: user.department,
    name:       user.name,
  }
  const accessToken  = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
  return { accessToken, refreshToken }
}

// ── POST /api/auth/login ───────────────────────────────────────────
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() })

    const { username, password } = req.body

    try {
      // ✅ FIX: query DB instead of in-memory USERS array
      const user = await findUser(username)

      if (!user) {
        logAudit('LOGIN_FAILED', null, `Unknown user: ${username}`, req.ip)
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        logAudit('LOGIN_FAILED', user.id, 'Wrong password', req.ip)
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })
      }

      logAudit('LOGIN_STEP1', user.id, 'Credentials verified, awaiting MFA', req.ip)

      res.json({
        success:     true,
        requiresMFA: true,
        message:     'Credentials verified. Please complete MFA.',
        userId:      user.id,
      })
    } catch (err) {
      console.error('[LOGIN ERROR]', err.message)
      res.status(500).json({ success: false, message: 'Server error during login.' })
    }
  }
)

// ── POST /api/auth/verify-mfa ─────────────────────────────────────
router.post('/verify-mfa',
  [
    body('username').trim().notEmpty(),
    body('password').notEmpty(),
    body('token').trim().isLength({ min: 6, max: 6 }).withMessage('MFA token must be 6 digits'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() })

    const { username, password, token } = req.body

    try {
      // ✅ FIX: query DB
      const user = await findUser(username)

      if (!user)
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })

      const valid = await bcrypt.compare(password, user.password)
      if (!valid)
        return res.status(401).json({ success: false, message: 'Invalid credentials.' })

      // Demo: accept any 6-digit token
      // Production: verify with speakeasy/otplib against user.mfa_secret
      if (!/^\d{6}$/.test(token)) {
        logAudit('MFA_FAILED', user.id, 'Invalid token format', req.ip)
        return res.status(401).json({ success: false, message: 'Invalid MFA code.' })
      }

      const { accessToken, refreshToken } = generateTokens(user)
      logAudit('LOGIN_SUCCESS', user.id, `Logged in from ${req.ip}`, req.ip)

      res.json({
        success:      true,
        message:      'Login successful.',
        accessToken,
        refreshToken,
        user: {
          id:         user.id,
          name:       user.name,
          role:       user.role,
          department: user.department,
          email:      user.email,
        },
      })
    } catch (err) {
      console.error('[MFA ERROR]', err.message)
      res.status(500).json({ success: false, message: 'Server error during MFA.' })
    }
  }
)

// ── POST /api/auth/refresh ────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken)
    return res.status(401).json({ success: false, message: 'No refresh token.' })

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)

    // ✅ FIX: query DB instead of in-memory USERS array
    const user = await findUserById(decoded.id)
    if (!user)
      return res.status(401).json({ success: false, message: 'User not found.' })

    const { accessToken, refreshToken: newRefresh } = generateTokens(user)
    res.json({ success: true, accessToken, refreshToken: newRefresh })
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' })
  }
})

// ── POST /api/auth/logout ─────────────────────────────────────────
router.post('/logout', authenticate, (req, res) => {
  logAudit('LOGOUT', req.user.id, `Logged out from ${req.ip}`, req.ip)
  res.json({ success: true, message: 'Logged out successfully.' })
})

// ── GET /api/auth/me ──────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    // ✅ FIX: query DB instead of in-memory USERS array
    const user = await findUserById(req.user.id)
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found.' })

    res.json({
      success: true,
      user: {
        id:         user.id,
        name:       user.name,
        role:       user.role,
        department: user.department,
        email:      user.email,
      },
    })
  } catch (err) {
    console.error('[ME ERROR]', err.message)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// ── GET /api/auth/audit-log (admin only) ──────────────────────────
router.get('/audit-log', authenticate, (req, res) => {
  if (!['admin', 'superadmin'].includes(req.user.role))
    return res.status(403).json({ success: false, message: 'Admins only.' })

  res.json({ success: true, data: auditLog.slice(0, 100) })
})

module.exports = router