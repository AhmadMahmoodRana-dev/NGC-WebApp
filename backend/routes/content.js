const express = require('express')
const { body, query, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { authenticate, authorize, departmentOwnership } = require('../middleware/auth')

const router = express.Router()

// ── Workflow states & allowed transitions ──────────────────────────
const WORKFLOW = {
  draft:    { next: 'in_review',  roles: ['editor', 'author', 'admin']    },
  in_review:{ next: 'approved',   roles: ['reviewer', 'admin']            },
  approved: { next: 'published',  roles: ['admin', 'superadmin']          },
  published:{ next: 'archived',   roles: ['admin', 'superadmin']          },
  archived: { next: null,         roles: ['admin']                        },
}

// In-memory content store (replace with PostgreSQL / MongoDB)
const contentItems = [
  {
    id: uuidv4(), title: 'Q2 FY2026 System Performance Report',
    type: 'report', department: 'Operations', status: 'published',
    slug: 'q2-fy2026-performance-report', excerpt: 'Second quarter performance metrics.',
    body: '<p>Full report content...</p>', author: 'Khalid Mehmood',
    authorId: '1', tags: ['performance', 'quarterly'], featured: true,
    publishedAt: new Date('2026-03-20').toISOString(),
    createdAt: new Date('2026-03-15').toISOString(),
    updatedAt: new Date('2026-03-20').toISOString(),
    history: [{ action: 'created', by: 'Khalid Mehmood', at: new Date('2026-03-15').toISOString() }],
  },
  {
    id: uuidv4(), title: 'NGC Signs MOU with Chinese Partners',
    type: 'press_release', department: 'PR', status: 'published',
    slug: 'ngc-mou-chinese-partners', excerpt: 'HVDC technology transfer agreement signed.',
    body: '<p>Full press release...</p>', author: 'Sadia Nawaz',
    authorId: '2', tags: ['mou', 'international'], featured: true,
    publishedAt: new Date('2026-03-18').toISOString(),
    createdAt: new Date('2026-03-14').toISOString(),
    updatedAt: new Date('2026-03-18').toISOString(),
    history: [{ action: 'created', by: 'Sadia Nawaz', at: new Date('2026-03-14').toISOString() }],
  },
]

// ── Helpers ────────────────────────────────────────────────────────
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Public Routes ──────────────────────────────────────────────────

// GET /api/content — public: only published items
router.get('/', (req, res) => {
  const { type, department, featured, page = 1, limit = 10, tag } = req.query
  let items = contentItems.filter(i => i.status === 'published')

  if (type)       items = items.filter(i => i.type === type)
  if (department) items = items.filter(i => i.department === department)
  if (featured)   items = items.filter(i => i.featured === (featured === 'true'))
  if (tag)        items = items.filter(i => i.tags?.includes(tag))

  items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const start = (Number(page) - 1) * Number(limit)
  res.json({
    success: true,
    data: items.slice(start, start + Number(limit)).map(i => ({
      id: i.id, title: i.title, type: i.type, department: i.department,
      slug: i.slug, excerpt: i.excerpt, featured: i.featured,
      tags: i.tags, publishedAt: i.publishedAt,
    })),
    total: items.length,
    page: Number(page),
    pages: Math.ceil(items.length / Number(limit)),
  })
})

// GET /api/content/:slug — single published item
router.get('/:slug', (req, res) => {
  const item = contentItems.find(i => i.slug === req.params.slug && i.status === 'published')
  if (!item) return res.status(404).json({ success: false, message: 'Content not found.' })
  res.json({ success: true, data: item })
})

// ── CMS / Authenticated Routes ─────────────────────────────────────

// GET /api/content/cms/all — all statuses (authenticated)
router.get('/cms/all', authenticate, (req, res) => {
  const { status, type, department, page = 1, limit = 20 } = req.query
  let items = [...contentItems]

  // Non-admins only see their department
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    items = items.filter(i => i.department === req.user.department)
  }
  if (status)     items = items.filter(i => i.status === status)
  if (type)       items = items.filter(i => i.type === type)
  if (department) items = items.filter(i => i.department === department)

  items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  const start = (Number(page) - 1) * Number(limit)

  res.json({
    success: true,
    data: items.slice(start, start + Number(limit)),
    total: items.length,
    page: Number(page),
    pages: Math.ceil(items.length / Number(limit)),
  })
})

// POST /api/content — create new (authenticated)
router.post('/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('type').notEmpty().withMessage('Content type is required'),
    body('department').notEmpty().withMessage('Department is required'),
  ],
  departmentOwnership,
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() })

    const now = new Date().toISOString()
    const item = {
      id:         uuidv4(),
      ...req.body,
      slug:       slugify(req.body.title),
      status:     'draft',
      author:     req.user.name,
      authorId:   req.user.id,
      featured:   false,
      publishedAt:null,
      createdAt:  now,
      updatedAt:  now,
      history:    [{ action: 'created', by: req.user.name, at: now }],
    }
    contentItems.unshift(item)
    res.status(201).json({ success: true, data: item })
  }
)

// PATCH /api/content/:id — update content
router.patch('/:id', authenticate, (req, res) => {
  const idx = contentItems.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Content not found.' })

  const item = contentItems[idx]
  // Non-admins can only edit their own dept content
  if (!['admin', 'superadmin'].includes(req.user.role) && item.department !== req.user.department) {
    return res.status(403).json({ success: false, message: 'Not authorised to edit this content.' })
  }
  // Cannot edit published/archived without admin
  if (['published', 'archived'].includes(item.status) && !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Only admins can edit published content.' })
  }

  const now = new Date().toISOString()
  const updated = {
    ...item,
    ...req.body,
    id: item.id, status: item.status, // preserve id & status
    slug: req.body.title ? slugify(req.body.title) : item.slug,
    updatedAt: now,
    history: [...item.history, { action: 'updated', by: req.user.name, at: now }],
  }
  contentItems[idx] = updated
  res.json({ success: true, data: updated })
})

// PATCH /api/content/:id/workflow — advance workflow state
router.patch('/:id/workflow', authenticate, (req, res) => {
  const { action } = req.body // 'advance' | 'reject'
  const idx = contentItems.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Content not found.' })

  const item    = contentItems[idx]
  const current = WORKFLOW[item.status]

  if (!current) return res.status(400).json({ success: false, message: 'Invalid current workflow state.' })

  if (action === 'reject') {
    // Reject sends back to draft
    if (!['reviewer', 'admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only reviewers/admins can reject.' })
    }
    const now = new Date().toISOString()
    contentItems[idx] = {
      ...item, status: 'draft', updatedAt: now,
      history: [...item.history, { action: 'rejected', by: req.user.name, at: now, note: req.body.note || '' }],
    }
    return res.json({ success: true, data: contentItems[idx], message: 'Content rejected and returned to draft.' })
  }

  // Advance
  if (!current.roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Your role (${req.user.role}) cannot advance from '${item.status}'.`,
    })
  }
  if (!current.next) return res.status(400).json({ success: false, message: 'Content is already in final state.' })

  const now = new Date().toISOString()
  contentItems[idx] = {
    ...item,
    status:      current.next,
    publishedAt: current.next === 'published' ? now : item.publishedAt,
    updatedAt:   now,
    history:     [...item.history, { action: `moved_to_${current.next}`, by: req.user.name, at: now }],
  }
  res.json({ success: true, data: contentItems[idx], message: `Content moved to '${current.next}'.` })
})

// DELETE /api/content/:id — admin only
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), (req, res) => {
  const idx = contentItems.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Content not found.' })
  contentItems.splice(idx, 1)
  res.json({ success: true, message: 'Content deleted.' })
})

module.exports = router
