const express = require('express')
const router  = express.Router()

// Mock search index — in production use Elasticsearch or PostgreSQL full-text search
const SEARCH_INDEX = [
  { id: '1', type: 'press_release', title: 'NGC Signs MOU with Chinese Energy Partners',       excerpt: 'HVDC technology transfer agreement for Pakistan grid modernisation.',     url: '/media/press-releases/1',     tags: ['mou', 'hvdc', 'china'],          date: '2026-03-20' },
  { id: '2', type: 'press_release', title: 'Q2 FY2026 System Performance Report Released',     excerpt: '12% reduction in transmission losses and improved grid stability.',        url: '/media/press-releases/2',     tags: ['performance', 'report'],         date: '2026-03-15' },
  { id: '3', type: 'press_release', title: '500kV Lahore–Islamabad Corridor Fully Energised',  excerpt: 'Critical inter-regional transmission link now carrying over 3,000 MW.',    url: '/media/press-releases/3',     tags: ['500kv', 'lahore', 'islamabad'], date: '2026-03-10' },
  { id: '4', type: 'publication',   title: 'Annual Report 2024-25',                            excerpt: 'NGC annual report covering FY2024-25 financial and operational performance.',url: '/publications/annual-reports', tags: ['annual', 'report', 'finance'],  date: '2026-03-01' },
  { id: '5', type: 'publication',   title: 'Grid Expansion Policy 2025',                       excerpt: 'Strategic framework for national grid expansion over the next decade.',    url: '/publications/policies',       tags: ['policy', 'grid', 'expansion'],  date: '2026-01-15' },
  { id: '6', type: 'tender',        title: 'Tender NGC/2026/T-041 — Multan Grid Station',      excerpt: 'Civil and electrical works at Multan Grid Station. Deadline Apr 20.',      url: '/publications/tenders',        tags: ['tender', 'multan', 'civil'],    date: '2026-03-05' },
  { id: '7', type: 'tender',        title: 'Tender NGC/2026/T-039 — Karachi Grid Reinforce',  excerpt: 'Karachi metropolitan grid reinforcement tender documents.',                url: '/publications/tenders',        tags: ['tender', 'karachi', 'sindh'],   date: '2026-02-28' },
  { id: '8', type: 'career',        title: 'Senior Transmission Engineer',                     excerpt: 'Lead grid expansion for northern corridor. BPS-18. Deadline Apr 30.',      url: '/careers',                     tags: ['career', 'engineer', 'lahore'], date: '2026-03-01' },
  { id: '9', type: 'career',        title: 'Graduate Trainee Engineer',                        excerpt: 'Two-year rotational trainee programme. Fresh graduates welcome.',           url: '/careers',                     tags: ['career', 'trainee', 'graduate'],date: '2026-03-10' },
  { id:'10', type: 'page',          title: 'About NGC — Mission and Vision',                   excerpt: 'NGC is Pakistan\'s national grid transmission company.',                   url: '/about',                       tags: ['about', 'mission', 'vision'],   date: '2026-01-01' },
  { id:'11', type: 'page',          title: 'Transmission Projects — Operations',               excerpt: 'Overview of NGC active and planned transmission projects across Pakistan.',  url: '/operations/projects',         tags: ['projects', 'operations'],       date: '2026-01-01' },
  { id:'12', type: 'page',          title: 'Contact NGC — Stakeholder Inquiry',                excerpt: 'Contact NGC for media, investor, government, and public inquiries.',        url: '/contact',                     tags: ['contact', 'inquiry'],           date: '2026-01-01' },
]

const TYPE_LABELS = {
  press_release: 'Press Release',
  publication:   'Publication',
  tender:        'Tender',
  career:        'Career',
  page:          'Page',
}

// GET /api/search?q=...&type=...&page=1&limit=10
router.get('/', (req, res) => {
  const { q, type, page = 1, limit = 10 } = req.query

  if (!q || q.trim().length < 2) {
    return res.status(422).json({ success: false, message: 'Search query must be at least 2 characters.' })
  }

  const query = q.trim().toLowerCase()

  let results = SEARCH_INDEX.filter(item => {
    const matchText = item.title.toLowerCase().includes(query) ||
                      item.excerpt.toLowerCase().includes(query) ||
                      item.tags.some(t => t.includes(query))
    const matchType = !type || item.type === type
    return matchText && matchType
  })

  // Simple relevance scoring
  results = results.map(item => {
    let score = 0
    if (item.title.toLowerCase().includes(query))   score += 10
    if (item.excerpt.toLowerCase().includes(query)) score += 5
    if (item.tags.some(t => t.startsWith(query)))   score += 3
    return { ...item, score, typeLabel: TYPE_LABELS[item.type] || item.type }
  })
  results.sort((a, b) => b.score - a.score)

  const start  = (Number(page) - 1) * Number(limit)
  const paged  = results.slice(start, start + Number(limit))
  const facets = {}
  SEARCH_INDEX.forEach(i => { facets[i.type] = (facets[i.type] || 0) + 1 })

  res.json({
    success: true,
    query: q,
    data: paged.map(({ score, ...rest }) => rest),
    total: results.length,
    page:  Number(page),
    pages: Math.ceil(results.length / Number(limit)),
    facets,
  })
})

module.exports = router
