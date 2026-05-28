import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ALL_PITCHES } from '../data/startups'
import { apiGetPitches, apiGetSavedPitches, apiSavePitch } from '../services/api'
import { getDemoSavedIds, toggleDemoSavedId } from '../utils/demoStorage'
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
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    async function loadPitches() {
      const demoPitches = ALL_STARTUPS.map((startup) => ({
        ...startup,
        id: String(startup.id),
        isDemo: true,
      }))

      try {
        const data = await apiGetPitches()
        const backendPitches = data.map((pitch) => ({
          ...pitch,
          id: pitch._id,
          isDemo: false,
        }))

        setPitches([
          ...demoPitches,
          ...backendPitches,
        ])
      } catch (err) {
        setError(err.message || 'Unable to load startup pitches.')
        setPitches(demoPitches)
      } finally {
        setLoading(false)
      }
    }

    loadPitches()
  }, [])

  useEffect(() => {
    async function loadSavedBookmarks() {
      if (!user) {
        setBookmarks({})
        return
      }

      try {
        const savedPitches = await apiGetSavedPitches()
        const savedMap = savedPitches.reduce((acc, pitch) => {
          if (pitch._id) acc[pitch._id] = true
          return acc
        }, {})

        getDemoSavedIds().forEach((savedId) => {
          if (savedId) savedMap[String(savedId)] = true
        })

        setBookmarks(savedMap)
      } catch (err) {
        console.error('Unable to load saved bookmarks:', err)
      }
    }

    loadSavedBookmarks()
  }, [user])

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
    return pitches.filter((s) => {
      const matchIndustry = industry === 'All Industries' || s.industry === industry
      const matchStage = stage === 'All Stages' || s.stage === stage
      const q = search.toLowerCase().trim()
      const matchSearch =
        q === '' ||
        (s.title || '').toLowerCase().includes(q) ||
        (s.company || '').toLowerCase().includes(q) ||
        (s.industry || '').toLowerCase().includes(q) ||
        (s.stage || '').toLowerCase().includes(q) ||
        (s.summary || s.description || '').toLowerCase().includes(q)
      return matchIndustry && matchStage && matchSearch
    })
  }, [industry, stage, search, pitches])

  function toggleBookmark(id) {
    if (!user) {
      navigate('/signup', { state: { from: location.pathname } })
      return
    }

    const normalizedId = String(id)
    const isDemo = normalizedId.length !== 24

    if (isDemo) {
      const saved = toggleDemoSavedId(normalizedId)
      setBookmarks((prev) => ({ ...prev, [normalizedId]: saved }))
      return
    }

    setBookmarks((prev) => ({ ...prev, [normalizedId]: !prev[normalizedId] }))
    apiSavePitch(normalizedId).catch((err) => {
      console.error('Failed to save pitch:', err)
      setBookmarks((prev) => ({ ...prev, [normalizedId]: !prev[normalizedId] }))
    })
  }

  return (
    <div className="browse">
      <div className="browse__inner">
        {/* Page header */}
        <div className="browse__header">
          <h1 className="browse__title">Browse Startups</h1>
          <p className="browse__subtitle">Discover innovative startups looking for investment</p>
        </div>

        {loading && (
          <div className="browse__loading">Loading pitches…</div>
        )}
        {error && (
          <div className="browse__error">{error}</div>
        )}

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
            filtered.map((s) => {
              const pitchId = s._id || s.id
              return (
                <article className="startup-item" key={pitchId}>
                  <div className="startup-item__body">
                    <div className="startup-item__top">
                      <h2 className="startup-item__title">{s.title}</h2>
                      <span className="startup-item__match">
                        ★ {s.match ?? 88}% match
                      </span>
                    </div>
                    <p className="startup-item__company">{s.company}</p>
                    <p className="startup-item__desc">{s.summary || s.description || 'No description available yet.'}</p>
                    <div className="startup-item__tags">
                      <span className="tag tag--industry">{s.industry}</span>
                      <span className="tag tag--stage">{s.stage}</span>
                    </div>
                    <div className="startup-item__meta">
                      <span>Seeking {s.funding || 'TBA'}</span>
                      <span className="meta-dot">•</span>
                      <span>Founded {s.createdAt ? new Date(s.createdAt).getFullYear() : '2024'}</span>
                      <span className="meta-dot">•</span>
                      <span>{(s.teamMembers?.length || 1)} employees</span>
                    </div>
                  </div>
                  <div className="startup-item__actions">
                    <Link to={`/pitch/${pitchId}`} className="btn-view-pitch">View Pitch</Link>
                    <button
                      className={`btn-bookmark ${bookmarks[pitchId] ? 'btn-bookmark--active' : ''}`}
                      onClick={() => toggleBookmark(pitchId)}
                      aria-label={bookmarks[pitchId] ? 'Remove bookmark' : 'Bookmark startup'}
                      title={bookmarks[pitchId] ? 'Bookmarked' : 'Bookmark'}
                    >
                      <svg viewBox="0 0 24 24" fill={bookmarks[pitchId] ? 'currentColor' : 'none'} aria-hidden="true">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
