const express = require('express')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// Publication store with versioning
const publications = [
  {
    id: uuidv4(), title: 'Annual Report 2024-25', category: 'Annual Report',
    department: 'Corporate', description: 'NGC annual report covering FY2024-25 performance.',
    fileUrl: '/uploads/annual-report-2024-25.pdf', fileSize: '4.2 MB',
    version: '1.0', downloads: 342, featured: true,
    publishedAt: '2026-03-01T00:00:00Z',
    createdAt:   '2026-02-28T00:00:00Z',
    updatedAt:   '2026-03-01T00:00:00Z',
    versions: [{ version: '1.0', fileUrl: '/uploads/annual-report-2024-25.pdf', uploadedAt: '2026-03-01T00:00:00Z', uploadedBy: 'Admin' }],
  },
  {
    id: uuidv4(), title: 'Grid Expansion Policy 2025', category: 'Policy',
    department: 'Operations', description: 'Strategic policy framework for national grid expansion.',
    fileUrl: '/uploads/grid-expansion-policy-2025.pdf', fileSize: '1.8 MB',
    version: '2.1', downloads: 187, featured: false,
    publishedAt: '2026-01-15T00:00:00Z',
    createdAt:   '2026-01-10T00:00:00Z',
    updatedAt:   '2026-01-15T00:00:00Z',
    versions: [
      { version: '1.0', fileUrl: '/uploads/grid-expansion-policy-2024.pdf',    uploadedAt: '2025-06-01T00:00:00Z', uploadedBy: 'Admin' },
      { version: '2.1', fileUrl: '/uploads/grid-expansion-policy-2025.pdf',    uploadedAt: '2026-01-15T00:00:00Z', uploadedBy: 'Admin' },
    ],
  },
  {
    id: uuidv4(), title: 'Tender NGC/2026/T-041 — Multan Grid Station', category: 'Tender',
    department: 'Procurement', description: 'Tender for civil and electrical works at Multan Grid Station.',
    fileUrl: '/uploads/tender-ngc-2026-t-041.pdf', fileSize: '0.9 MB',
    version: '1.0', downloads: 95, featured: false,
    publishedAt: '2026-03-05T00:00:00Z',
    createdAt:   '2026-03-04T00:00:00Z',
    updatedAt:   '2026-03-05T00:00:00Z',
    deadline:    '2026-04-20T00:00:00Z',
    versions: [{ version: '1.0', fileUrl: '/uploads/tender-ngc-2026-t-041.pdf', uploadedAt: '2026-03-05T00:00:00Z', uploadedBy: 'Admin' }],
  },
  {
    id: uuidv4(), title: 'System Performance Report Q2 FY2026', category: 'Report',
    department: 'Operations', description: 'Second quarter transmission system performance statistics.',
    fileUrl: '/uploads/performance-q2-fy2026.pdf', fileSize: '2.1 MB',
    version: '1.0', downloads: 213, featured: true,
    publishedAt: '2026-03-15T00:00:00Z',
    createdAt:   '2026-03-14T00:00:00Z',
    updatedAt:   '2026-03-15T00:00:00Z',
    versions: [{ version: '1.0', fileUrl: '/uploads/performance-q2-fy2026.pdf', uploadedAt: '2026-03-15T00:00:00Z', uploadedBy: 'Admin' }],
  },
  {
    id: uuidv4(), title: 'Corporate Governance Code 2025', category: 'Policy',
    department: 'Corporate', description: 'NGC corporate governance framework and compliance standards.',
    fileUrl: '/uploads/governance-code-2025.pdf', fileSize: '1.2 MB',
    version: '1.0', downloads: 124, featured: false,
    publishedAt: '2025-12-15T00:00:00Z',
    createdAt:   '2025-12-10T00:00:00Z',
    updatedAt:   '2025-12-15T00:00:00Z',
    versions: [{ version: '1.0', fileUrl: '/uploads/governance-code-2025.pdf', uploadedAt: '2025-12-15T00:00:00Z', uploadedBy: 'Admin' }],
  },
]

// GET /api/publications — public listing
router.get('/', (req, res) => {
  const { category, department, featured, search, page = 1, limit = 12 } = req.query
  let items = [...publications]

  if (category)   items = items.filter(p => p.category === category)
  if (department) items = items.filter(p => p.department === department)
  if (featured)   items = items.filter(p => p.featured === (featured === 'true'))
  if (search)     items = items.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

  items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const start = (Number(page) - 1) * Number(limit)
  const categories = [...new Set(publications.map(p => p.category))]

  res.json({
    success: true,
    data: items.slice(start, start + Number(limit)).map(p => ({
      id: p.id, title: p.title, category: p.category, department: p.department,
      description: p.description, fileSize: p.fileSize, version: p.version,
      downloads: p.downloads, featured: p.featured, publishedAt: p.publishedAt,
      deadline: p.deadline,
    })),
    total: items.length,
    page: Number(page),
    pages: Math.ceil(items.length / Number(limit)),
    categories,
  })
})

// GET /api/publications/:id — single
router.get('/:id', (req, res) => {
  const pub = publications.find(p => p.id === req.params.id)
  if (!pub) return res.status(404).json({ success: false, message: 'Publication not found.' })
  res.json({ success: true, data: pub })
})

// POST /api/publications/:id/download — track download
router.post('/:id/download', (req, res) => {
  const pub = publications.find(p => p.id === req.params.id)
  if (!pub) return res.status(404).json({ success: false, message: 'Publication not found.' })
  pub.downloads++
  console.log(`[DOWNLOAD] "${pub.title}" — total: ${pub.downloads}`)
  res.json({ success: true, fileUrl: pub.fileUrl, message: 'Download tracked.' })
})

// POST /api/publications — create (CMS)
router.post('/', authenticate, authorize('admin', 'editor'),
  [
    body('title').trim().notEmpty(),
    body('category').notEmpty(),
    body('department').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() })

    const now = new Date().toISOString()
    const pub = {
      id: uuidv4(), ...req.body,
      downloads: 0, version: '1.0', featured: false,
      publishedAt: now, createdAt: now, updatedAt: now,
      versions: [{ version: '1.0', fileUrl: req.body.fileUrl, uploadedAt: now, uploadedBy: req.user.name }],
    }
    publications.unshift(pub)
    res.status(201).json({ success: true, data: pub })
  }
)

// PATCH /api/publications/:id/version — add new version
router.patch('/:id/version', authenticate, authorize('admin', 'editor'), (req, res) => {
  const { version, fileUrl } = req.body
  if (!version || !fileUrl) return res.status(422).json({ success: false, message: 'version and fileUrl are required.' })

  const pub = publications.find(p => p.id === req.params.id)
  if (!pub) return res.status(404).json({ success: false, message: 'Publication not found.' })

  const now = new Date().toISOString()
  pub.version  = version
  pub.fileUrl  = fileUrl
  pub.updatedAt = now
  pub.versions.push({ version, fileUrl, uploadedAt: now, uploadedBy: req.user.name })

  res.json({ success: true, data: pub, message: `Version ${version} added.` })
})

// DELETE /api/publications/:id
router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const idx = publications.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Publication not found.' })
  publications.splice(idx, 1)
  res.json({ success: true, message: 'Publication deleted.' })
})

module.exports = router
