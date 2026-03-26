const express = require('express')
const { body, validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid')
const { authenticate, authorize } = require('../middleware/auth')

const router = express.Router()

const jobs = [
  { id: uuidv4(), title: 'Senior Transmission Engineer', department: 'Operations', location: 'Lahore', type: 'Full-time', grade: 'BPS-18', deadline: '2026-04-30T00:00:00Z', description: 'Lead transmission planning and project execution for northern region grid expansion.', requirements: ['B.E. Electrical Engineering', '8+ years experience', 'Grid design expertise'], status: 'open', applications: 24, postedAt: '2026-03-01T00:00:00Z' },
  { id: uuidv4(), title: 'Grid Control System Analyst',  department: 'IT & Digital', location: 'Islamabad', type: 'Full-time', grade: 'BPS-17', deadline: '2026-04-20T00:00:00Z', description: 'Manage and optimise SCADA systems and real-time grid monitoring platforms.', requirements: ['B.Sc. Computer Science', '4+ years SCADA experience', 'Control system knowledge'], status: 'open', applications: 18, postedAt: '2026-03-05T00:00:00Z' },
  { id: uuidv4(), title: 'Financial Analyst',            department: 'Finance',     location: 'Lahore',    type: 'Full-time', grade: 'BPS-17', deadline: '2026-04-25T00:00:00Z', description: 'Financial modelling, budgeting, and performance reporting for capital projects.', requirements: ['ACCA / CA', '3+ years experience', 'Advanced Excel / Power BI'], status: 'open', applications: 31, postedAt: '2026-03-08T00:00:00Z' },
  { id: uuidv4(), title: 'Graduate Trainee Engineer',    department: 'Operations',  location: 'Multiple',  type: 'Trainee',   grade: 'BPS-16', deadline: '2026-04-30T00:00:00Z', description: 'Two-year rotational trainee programme across operations, planning, and projects.', requirements: ['B.E. Electrical / Mechanical', 'Fresh graduate', 'Max age 26'], status: 'open', applications: 148, postedAt: '2026-03-10T00:00:00Z' },
]

const applications = []

// GET /api/careers
router.get('/', (req, res) => {
  const { department, type, status = 'open' } = req.query
  let items = [...jobs]
  if (department) items = items.filter(j => j.department === department)
  if (type)       items = items.filter(j => j.type === type)
  if (status)     items = items.filter(j => j.status === status)

  res.json({
    success: true,
    data: items.map(j => ({ ...j, applications: undefined })), // hide count publicly
    total: items.length,
  })
})

// GET /api/careers/:id
router.get('/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id)
  if (!job) return res.status(404).json({ success: false, message: 'Job not found.' })
  res.json({ success: true, data: { ...job, applications: undefined } })
})

// POST /api/careers/:id/apply — submit application
router.post('/:id/apply',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('phone').notEmpty(),
    body('coverLetter').trim().isLength({ min: 50 }).withMessage('Cover letter must be at least 50 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() })

    const job = jobs.find(j => j.id === req.params.id)
    if (!job)            return res.status(404).json({ success: false, message: 'Job not found.' })
    if (job.status !== 'open') return res.status(400).json({ success: false, message: 'This position is no longer accepting applications.' })
    if (new Date(job.deadline) < new Date()) return res.status(400).json({ success: false, message: 'Application deadline has passed.' })

    const app = {
      id:        `APP-${Date.now()}`,
      jobId:     job.id,
      jobTitle:  job.title,
      ...req.body,
      status:    'received',
      submittedAt: new Date().toISOString(),
      ip:          req.ip,
    }
    applications.unshift(app)
    job.applications++

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. You will be contacted if shortlisted.',
      referenceId: app.id,
    })
  }
)

// GET /api/careers/cms/applications — CMS: view applications
router.get('/cms/applications', authenticate, authorize('admin', 'hr'), (req, res) => {
  const { jobId } = req.query
  const items = jobId ? applications.filter(a => a.jobId === jobId) : applications
  res.json({ success: true, data: items, total: items.length })
})

module.exports = router
