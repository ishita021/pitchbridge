import { useState, useMemo } from 'react'
import './BrowseStartupsPage.css'

const ALL_STARTUPS = [
  {
    id: 1,
    title: 'AI-Powered Analytics Platform',
    company: 'DataViz AI',
    description:
      'Transform raw data into actionable insights with our AI-powered analytics platform. We help businesses make data-driven decisions faster.',
    industry: 'SaaS',
    stage: 'Series A',
    match: 95,
    seeking: '$2M',
    founded: 2022,
    employees: 12,
    bookmarked: false,
  },
  {
    id: 2,
    title: 'Blockchain Supply Chain Solution',
    company: 'ChainTrack',
    description:
      'End-to-end supply chain visibility using blockchain technology. Track products from manufacturer to consumer with complete transparency.',
    industry: 'FinTech',
    stage: 'Seed',
    match: 82,
    seeking: '$1M',
    founded: 2023,
    employees: 8,
    bookmarked: false,
  },
  {
    id: 3,
    title: 'Sustainable Food Delivery',
    company: 'GreenEats',
    description:
      'Zero-waste food delivery service connecting local restaurants with eco-conscious consumers. Our electric fleet reduces carbon emissions by 80%.',
    industry: 'E-commerce',
    stage: 'Seed',
    match: 88,
    seeking: '$500K',
    founded: 2023,
    employees: 15,
    bookmarked: false,
  },
  {
    id: 4,
    title: 'Mental Health & Wellness App',
    company: 'MindSpace',
    description:
      'Personalised mental health support through AI-driven therapy sessions, mood tracking, and guided meditation. Serving 50K+ active users.',
    industry: 'HealthTech',
    stage: 'Series A',
    match: 79,
    seeking: '$3M',
    founded: 2021,
    employees: 22,
    bookmarked: false,
  },
  {
    id: 5,
    title: 'EdTech Adaptive Learning',
    company: 'EduSpark',
    description:
      'Adaptive K-12 learning platform that personalises curriculum in real time using student performance data. 200+ schools onboarded.',
    industry: 'EdTech',
    stage: 'Seed',
    match: 74,
    seeking: '$800K',
    founded: 2022,
    employees: 10,
    bookmarked: false,
  },
  {
    id: 6,
    title: 'Last-Mile Delivery Optimisation',
    company: 'LogiFlow',
    description:
      'SaaS platform cutting last-mile delivery costs by 35% for e-commerce brands through AI-powered route optimisation and carrier selection.',
    industry: 'Logistics',
    stage: 'Series A',
    match: 91,
    seeking: '$4M',
    founded: 2021,
    employees: 30,
    bookmarked: false,
  },
  {
    id: 7,
    title: 'Zero-Trust Cybersecurity Platform',
    company: 'CyberShield',
    description:
      'Enterprise-grade zero-trust security protecting mid-market companies from ransomware and phishing attacks with real-time threat intelligence.',
    industry: 'CyberSecurity',
    stage: 'Series B',
    match: 86,
    seeking: '$10M',
    founded: 2020,
    employees: 45,
    bookmarked: false,
  },
  {
    id: 8,
    title: 'Embedded Finance Infrastructure',
    company: 'FinNest',
    description:
      'API-first platform enabling any SaaS company to embed banking, lending, and payments into their product in under two weeks.',
    industry: 'FinTech',
    stage: 'Series B',
    match: 93,
    seeking: '$15M',
    founded: 2020,
    employees: 60,
    bookmarked: false,
  },
]

const INDUSTRIES = ['All Industries', 'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'Logistics', 'CyberSecurity']
const STAGES = ['All Stages', 'Seed', 'Series A', 'Series B']

export default function BrowseStartupsPage() {
  const [industry, setIndustry] = useState('All Industries')
  const [stage, setStage] = useState('All Stages')
  const [search, setSearch] = useState('')
  const [bookmarks, setBookmarks] = useState({})

  const filtered = useMemo(() => {
    return ALL_STARTUPS.filter((s) => {
      const matchIndustry = industry === 'All Industries' || s.industry === industry
      const matchStage = stage === 'All Stages' || s.stage === stage
      const matchSearch =
        search === '' ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.company.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      return matchIndustry && matchStage && matchSearch
    })
  }, [industry, stage, search])

  function toggleBookmark(id) {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="browse">
      <div className="browse__inner">
        {/* Page header */}
        <div className="browse__header">
          <h1 className="browse__title">Browse Startups</h1>
          <p className="browse__subtitle">Discover innovative startups looking for investment</p>
        </div>

        {/* Filters */}
        <div className="browse__filters">
          <div className="filters__heading">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="filters__icon">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Filters</span>
          </div>
          <div className="filters__row">
            <div className="filter-group">
              <label className="filter-group__label" htmlFor="industry-filter">Industry</label>
              <select
                id="industry-filter"
                className="filter-group__select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-group__label" htmlFor="stage-filter">Stage</label>
              <select
                id="stage-filter"
                className="filter-group__select"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="filter-group filter-group--search">
              <label className="filter-group__label" htmlFor="search-filter">Search</label>
              <div className="filter-search-wrap">
                <svg viewBox="0 0 20 20" fill="none" className="filter-search-icon" aria-hidden="true">
                  <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8" />
                  <path d="M13.5 13.5L17 17" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  id="search-filter"
                  type="search"
                  placeholder="Search by name or keyword..."
                  className="filter-search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="browse__count">
          Showing <strong>{filtered.length}</strong> startup{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Startup list */}
        <div className="startup-list">
          {filtered.length === 0 ? (
            <div className="browse__empty">
              <p>No startups match your filters. Try adjusting your search.</p>
            </div>
          ) : (
            filtered.map((s) => (
              <article className="startup-item" key={s.id}>
                <div className="startup-item__body">
                  <div className="startup-item__top">
                    <h2 className="startup-item__title">{s.title}</h2>
                    <span className="startup-item__match">
                      ★ {s.match}% match
                    </span>
                  </div>
                  <p className="startup-item__company">{s.company}</p>
                  <p className="startup-item__desc">{s.description}</p>
                  <div className="startup-item__tags">
                    <span className="tag tag--industry">{s.industry}</span>
                    <span className="tag tag--stage">{s.stage}</span>
                  </div>
                  <div className="startup-item__meta">
                    <span>Seeking {s.seeking}</span>
                    <span className="meta-dot">•</span>
                    <span>Founded {s.founded}</span>
                    <span className="meta-dot">•</span>
                    <span>{s.employees} employees</span>
                  </div>
                </div>
                <div className="startup-item__actions">
                  <button className="btn-view-pitch">View Pitch</button>
                  <button
                    className={`btn-bookmark ${bookmarks[s.id] ? 'btn-bookmark--active' : ''}`}
                    onClick={() => toggleBookmark(s.id)}
                    aria-label={bookmarks[s.id] ? 'Remove bookmark' : 'Bookmark startup'}
                    title={bookmarks[s.id] ? 'Bookmarked' : 'Bookmark'}
                  >
                    <svg viewBox="0 0 24 24" fill={bookmarks[s.id] ? 'currentColor' : 'none'} aria-hidden="true">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
