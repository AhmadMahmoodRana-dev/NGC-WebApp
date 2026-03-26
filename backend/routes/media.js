const express = require('express')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

const mediaItems = [
  { id: uuidv4(), title: '500kV Lahore–Islamabad Corridor — Commissioning Ceremony', type: 'photo', category: 'Operations', url: '/uploads/media/corridor-commissioning.jpg', thumbnail: '/uploads/media/thumb/corridor-commissioning.jpg', size: '2.4 MB', tags: ['500kv', 'commissioning', 'lahore'], uploadedBy: 'PR Dept', uploadedAt: '2026-03-20T00:00:00Z', featured: true },
  { id: uuidv4(), title: 'NGC Board Meeting — Q2 Review',                           type: 'photo', category: 'Corporate',   url: '/uploads/media/board-meeting.jpg',           thumbnail: '/uploads/media/thumb/board-meeting.jpg',           size: '1.8 MB', tags: ['board', 'meeting'],           uploadedBy: 'PR Dept', uploadedAt: '2026-03-18T00:00:00Z', featured: false },
  { id: uuidv4(), title: 'Smart Grid Modernisation — Launch Video',                 type: 'video', category: 'Technology',  url: '/uploads/media/smart-grid-launch.mp4',       thumbnail: '/uploads/media/thumb/smart-grid-launch.jpg',       size: '45 MB',  tags: ['smart-grid', 'modernisation'],uploadedBy: 'PR Dept', uploadedAt: '2026-03-10T00:00:00Z', featured: true  },
  { id: uuidv4(), title: 'Tarbela–Peshawar Site Visit',                              type: 'photo', category: 'Operations', url: '/uploads/media/tarbela-site.jpg',            thumbnail: '/uploads/media/thumb/tarbela-site.jpg',            size: '3.1 MB', tags: ['tarbela', 'peshawar', 'kpk'], uploadedBy: 'Ops Dept', uploadedAt: '2026-02-25T00:00:00Z', featured: false },
  { id: uuidv4(), title: 'NGC Corporate Overview 2025',                             type: 'video', category: 'Corporate',  url: '/uploads/media/ngc-overview-2025.mp4',       thumbnail: '/uploads/media/thumb/ngc-overview.jpg',            size: '120 MB', tags: ['corporate', 'overview'],      uploadedBy: 'PR Dept', uploadedAt: '2026-01-15T00:00:00Z', featured: true  },
]

// GET /api/media
router.get('/', (req, res) => {
  const { type, category, featured, search, page = 1, limit = 12 } = req.query
  let items = [...mediaItems]

  if (type)     items = items.filter(m => m.type === type)
  if (category) items = items.filter(m => m.category === category)
  if (featured) items = items.filter(m => m.featured === (featured === 'true'))
  if (search)   items = items.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.tags.some(t => t.includes(search.toLowerCase())))

  items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  const start = (Number(page) - 1) * Number(limit)
  const categories = [...new Set(mediaItems.map(m => m.category))]

  res.json({
    success: true,
    data: items.slice(start, start + Number(limit)),
    total: items.length,
    page: Number(page),
    pages: Math.ceil(items.length / Number(limit)),
    categories,
  })
})

// GET /api/media/:id
router.get('/:id', (req, res) => {
  const item = mediaItems.find(m => m.id === req.params.id)
  if (!item) return res.status(404).json({ success: false, message: 'Media item not found.' })
  res.json({ success: true, data: item })
})

// DELETE /api/media/:id — CMS only
router.delete('/:id', authenticate, authorize('admin', 'editor'), (req, res) => {
  const idx = mediaItems.findIndex(m => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Media item not found.' })
  mediaItems.splice(idx, 1)
  res.json({ success: true, message: 'Media item deleted.' })
})

// PATCH /api/media/:id — update metadata
router.patch('/:id', authenticate, authorize('admin', 'editor'), (req, res) => {
  const idx = mediaItems.findIndex(m => m.id === req.params.id)
  if (idx === -1) return res.status(404).json({ success: false, message: 'Media item not found.' })
  mediaItems[idx] = { ...mediaItems[idx], ...req.body, id: mediaItems[idx].id }
  res.json({ success: true, data: mediaItems[idx] })
})

module.exports = router
