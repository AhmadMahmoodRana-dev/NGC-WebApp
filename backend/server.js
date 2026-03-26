require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const helmet       = require('helmet')
const morgan       = require('morgan')
const rateLimit    = require('express-rate-limit')
const path         = require('path')
const pool = require('./db');

const authRoutes        = require('./routes/auth')
const contactRoutes     = require('./routes/contact')
const contentRoutes     = require('./routes/content')
const mediaRoutes       = require('./routes/media')
const publicationsRoutes= require('./routes/publications')
const careersRoutes     = require('./routes/careers')
const searchRoutes      = require('./routes/search')
const uploadRoutes      = require('./routes/upload')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc:    ["'self'", 'fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:', 'blob:'],
      scriptSrc:  ["'self'"],
    },
  },
}))

// ── CORS ───────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Global Rate Limiter ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
})
app.use(limiter)

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many authentication attempts.' },
})

// ── Body Parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Logging ────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ── Static Media ───────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health Check ───────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'NGC API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Database unreachable',
      database: 'disconnected',
      error: err.message,
    });
  }
});


// ── API Routes ─────────────────────────────────────────────────────
app.use('/api/auth',         authLimiter, authRoutes)
app.use('/api/contact',      contactRoutes)
app.use('/api/content',      contentRoutes)
app.use('/api/media',        mediaRoutes)
app.use('/api/publications', publicationsRoutes)
app.use('/api/careers',      careersRoutes)
app.use('/api/search',       searchRoutes)
app.use('/api/upload',       uploadRoutes)

// ── 404 Catch-all ──────────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' })
})

// ── Global Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack)
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal server error occurred.' : err.message,
  })
})

// ── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔌 NGC API server running on port ${PORT}`)
  console.log(`   Health:   http://localhost:${PORT}/api/health`)
  console.log(`   Env:      ${process.env.NODE_ENV || 'development'}\n`)
})

module.exports = app
