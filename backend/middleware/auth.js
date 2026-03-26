const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'ngc-dev-secret-change-in-production'

/**
 * Verify JWT token from Authorization header.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' })
  }
}

/**
 * Role-Based Access Control (RBAC) middleware factory.
 * Usage: authorize('admin', 'editor')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}.`,
      })
    }
    next()
  }
}

/**
 * Department-level ownership check.
 * Ensures PR can only manage PR content, HR manages HR content, etc.
 * Admins bypass this check.
 */
function departmentOwnership(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' })
  }
  if (req.user.role === 'admin' || req.user.role === 'superadmin') {
    return next() // Admins bypass dept check
  }
  const contentDept = req.body.department || req.params.department
  if (contentDept && contentDept !== req.user.department) {
    return res.status(403).json({
      success: false,
      message: `You can only manage content for your department (${req.user.department}).`,
    })
  }
  next()
}

module.exports = { authenticate, authorize, departmentOwnership }
