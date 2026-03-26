const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// In-memory store (replace with DB)
const inquiries = []

// POST /api/contact — public submission
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('type').notEmpty().withMessage('Inquiry type is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 20 }).withMessage('Message must be at least 20 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() })

    const inquiry = {
      id: `INQ-${Date.now()}`,
      ...req.body,
      status: 'open',
      createdAt: new Date().toISOString(),
      ip: req.ip,
    }
    inquiries.unshift(inquiry)
    console.log(`[CONTACT] New inquiry ${inquiry.id} from ${inquiry.email} (${inquiry.type})`)

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our team will respond within 2 business days.',
      referenceId: inquiry.id,
    })
  }
)

// GET /api/contact — CMS: list inquiries (authenticated)
router.get('/', authenticate, authorize('admin', 'editor'), (req, res) => {
  const { type, status, page = 1, limit = 20 } = req.query
  let filtered = [...inquiries]
  if (type)   filtered = filtered.filter(i => i.type === type)
  if (status) filtered = filtered.filter(i => i.status === status)

  const start = (page - 1) * limit
  res.json({
    success: true,
    data: filtered.slice(start, start + Number(limit)),
    total: filtered.length,
    page: Number(page),
    pages: Math.ceil(filtered.length / limit),
  })
})

// PATCH /api/contact/:id — mark as resolved
router.patch('/:id', authenticate, authorize('admin', 'editor'), (req, res) => {
  const idx = inquiries.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Inquiry not found.' })
  inquiries[idx] = { ...inquiries[idx], ...req.body, updatedAt: new Date().toISOString() }
  res.json({ success: true, data: inquiries[idx] })
})

module.exports = router
