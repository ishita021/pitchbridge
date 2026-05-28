import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ALL_PITCHES } from '../data/startups'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  // ── Search state ──────────────────────────────────────────────────────────
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const searchWrapRef = useRef(null)

  // ── User menu state ───────────────────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Clear search when leaving /browse
  useEffect(() => {
    if (!location.pathname.startsWith('/browse')) {
      setQuery('')
      setSuggestions([])
      setSearchOpen(false)
    }
  }, [location.pathname])

  // Sync search with ?q= param
  useEffect(() => {
    if (location.pathname === '/browse') {
      const q = new URLSearchParams(location.search).get('q') || ''
      setQuery(q)
    }
  }, [location.pathname, location.search])

  // Close search dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── Search handlers ───────────────────────────────────────────────────────
  function handleChange(e) {
    const val = e.target.value
    setQuery(val)
    if (val.trim().length < 2) { setSuggestions([]); setSearchOpen(false); return }
    const lower = val.toLowerCase()
    const matches = ALL_PITCHES.filter(
      s => s.title.toLowerCase().includes(lower) ||
           s.company.toLowerCase().includes(lower) ||
           s.industry.toLowerCase().includes(lower)
    ).slice(0, 6)
    setSuggestions(matches)
    setSearchOpen(matches.length > 0)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim()) {
      setSearchOpen(false)
      navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
    }
    if (e.key === 'Escape') setSearchOpen(false)
  }

  function handleSuggestionClick(startup) {
    setQuery(''); setSuggestions([]); setSearchOpen(false)
    navigate(`/pitch/${startup.id}`)
  }

  function handleSearchSubmit() {
    if (query.trim()) { setSearchOpen(false); navigate(`/browse?q=${encodeURIComponent(query.trim())}`) }
  }

  // ── User menu handlers ────────────────────────────────────────────────────
  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    navigate('/')
  }

  function goToDashboard() {
    setMenuOpen(false)
    navigate(user.role === 'founder' ? '/dashboard/founder' : '/dashboard/investor')
  }

  // Initials from name
  const initials = user
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">PB</span>
          <span className="navbar__logo-text">PitchBridge</span>
        </Link>

        {/* Nav links */}
        <nav className="navbar__links">
          <Link to="/browse" className="navbar__link">Browse Startups</Link>
          <Link to="/create-pitch" className="navbar__link">Create Pitch</Link>
        </nav>

        {/* Search + CTA */}
        <div className="navbar__actions">
          {/* Search */}
          <div className="navbar__search-wrap" ref={searchWrapRef}>
            <div className="navbar__search">
              <svg className="navbar__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                onClick={handleSearchSubmit}
                style={{ cursor: query.trim() ? 'pointer' : 'default' }}>
                <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8" />
                <path d="M13.5 13.5L17 17" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                placeholder="Search startups..."
                className="navbar__search-input"
                aria-label="Search startups"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setSearchOpen(true)}
                autoComplete="off"
              />
              {query && (
                <button className="navbar__search-clear"
                  onClick={() => { setQuery(''); setSuggestions([]); setSearchOpen(false) }}
                  aria-label="Clear search">✕</button>
              )}
            </div>

            {searchOpen && (
              <ul className="navbar__suggestions" role="listbox">
                {suggestions.map(s => (
                  <li key={s.id} className="navbar__suggestion-item" role="option"
                    onMouseDown={() => handleSuggestionClick(s)}>
                    <div className="suggestion__icon" style={{ background: s.logoColor || '#e9eaec' }}>
                      {s.logo || s.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="suggestion__body">
                      <span className="suggestion__title">{s.title}</span>
                      <span className="suggestion__meta">{s.company} · {s.industry} · {s.stage}</span>
                    </div>
                    <span className="suggestion__match">{s.match}%</span>
                  </li>
                ))}
                <li className="navbar__suggestion-footer" onMouseDown={handleSearchSubmit}>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Search all results for "<strong>{query}</strong>"
                </li>
              </ul>
            )}
          </div>

          {/* ── Logged-out: Sign Up button ── */}
          {!user && (
            <Link to="/signup" className="navbar__signup-btn">Sign Up</Link>
          )}

          {/* ── Logged-in: Avatar + dropdown ── */}
          {user && (
            <div className="navbar__user" ref={menuRef}>
              <button
                className="navbar__avatar"
                onClick={() => setMenuOpen(p => !p)}
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                <span className="navbar__avatar-initials">{initials}</span>
              </button>

              {menuOpen && (
                <div className="navbar__user-menu">
                  {/* User info */}
                  <div className="user-menu__info">
                    <div className="user-menu__avatar-lg">{initials}</div>
                    <div>
                      <p className="user-menu__name">{user.name}</p>
                      <p className="user-menu__role">
                        {user.role === 'founder' ? '🚀 Founder' : '📈 Investor'}
                      </p>
                    </div>
                  </div>

                  <div className="user-menu__divider" />

                  {/* Menu items */}
                  <button className="user-menu__item" onClick={goToDashboard}>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    My Dashboard
                  </button>

                  {user.role === 'founder' && (
                    <Link className="user-menu__item" to="/create-pitch"
                      onClick={() => setMenuOpen(false)}>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Create Pitch
                    </Link>
                  )}

                  {user.role === 'investor' && (
                    <Link className="user-menu__item" to="/browse"
                      onClick={() => setMenuOpen(false)}>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      Browse Startups
                    </Link>
                  )}

                  <div className="user-menu__divider" />

                  <button className="user-menu__item user-menu__item--danger" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
