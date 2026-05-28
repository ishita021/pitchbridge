import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ALL_PITCHES } from '../data/startups'
import './BrowseStartupsPage.css'

const ALL_STARTUPS = ALL_PITCHES

const INDUSTRIES = ['All Industries', 'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'Logistics', 'CyberSecurity', 'CleanTech']
const STAGES = ['All Stages', 'Seed', 'Pre-Seed', 'Series A', 'Series B']

export default function BrowseStartupsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [industry, setIndustry] = useState('All Industries')
  const [stage, setStage] = useState('All Stages')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [bookmarks, setBookmarks] = useState({})

  // Sync search state when URL ?q= param changes (e.g. navbar search)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearch(q)
  }, [searchParams])

  // Keep URL in sync when user types in the on-page search box
  function handleSearchChange(e) {
    const val = e.target.value
    setSearch(val)
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const filtered = useMemo(() => {
    return ALL_STARTUPS.filter((s) => {
      const matchIndustry = industry === 'All Industries' || s.industry === industry
      const matchStage = stage === 'All Stages' || s.stage === stage
      const q = search.toLowerCase().trim()
      const matchSearch =
        q === '' ||
        s.title.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.stage.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
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
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active search banner */}
        {search.trim() && (
          <div className="browse__search-banner">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Showing results for <strong>"{search.trim()}"</strong>
            <button
              className="browse__search-clear"
              onClick={() => { setSearch(''); setSearchParams({}, { replace: true }) }}
              aria-label="Clear search"
            >
              ✕ Clear
            </button>
          </div>
        )}

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
                  <Link to={`/pitch/${s.id}`} className="btn-view-pitch">View Pitch</Link>
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
