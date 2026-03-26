const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')
const { v4: uuidv4 } = require('uuid')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

// Ensure upload directories exist
const UPLOAD_ROOT = path.join(__dirname, '..', 'uploads')
const DIRS = ['documents', 'media/photos', 'media/videos', 'media/thumb']
DIRS.forEach(d => fs.mkdirSync(path.join(UPLOAD_ROOT, d), { recursive: true }))

// Allowed MIME types per category
const ALLOWED_TYPES = {
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video:    ['video/mp4', 'video/webm'],
}

function fileFilter(req, file, cb) {
  const category  = req.query.category || 'document'
  const allowed   = ALLOWED_TYPES[category] || ALLOWED_TYPES.document
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed for category '${category}'. Allowed: ${allowed.join(', ')}`), false)
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const category = req.query.category || 'document'
    const dir = category === 'image' ? path.join(UPLOAD_ROOT, 'media/photos')
              : category === 'video' ? path.join(UPLOAD_ROOT, 'media/videos')
              : path.join(UPLOAD_ROOT, 'documents')
    cb(null, dir)
  },
  filename(req, file, cb) {
    const ext  = path.extname(file.originalname).toLowerCase()
    const safe = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 50)
    cb(null, `${uuidv4()}-${safe}${ext}`)
  },
})

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
})

// POST /api/upload — authenticated, editor+
router.post('/', authenticate, authorize('admin', 'editor'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' })

  const category = req.query.category || 'document'
  const subPath  = category === 'image' ? 'media/photos'
                 : category === 'video' ? 'media/videos'
                 : 'documents'

  const fileUrl = `/uploads/${subPath}/${req.file.filename}`

  console.log(`[UPLOAD] ${req.user.name} uploaded: ${req.file.originalname} → ${fileUrl}`)

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully.',
    data: {
      url:          fileUrl,
      filename:     req.file.filename,
      originalName: req.file.originalname,
      mimetype:     req.file.mimetype,
      size:         req.file.size,
      sizeFormatted: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadedBy:   req.user.name,
      uploadedAt:   new Date().toISOString(),
    },
  })
})

// Multer error handling
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, message: 'File too large. Maximum size is 100 MB.' })
    }
    return res.status(400).json({ success: false, message: err.message })
  }
  if (err) return res.status(400).json({ success: false, message: err.message })
  next()
})

module.exports = router
