import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-icon">PB</span>
          <span className="navbar__logo-text">PitchBridge</span>
        </a>

        {/* Nav links */}
        <nav className="navbar__links">
          <a href="#startups" className="navbar__link">Browse Startups</a>
          <a href="#pitch" className="navbar__link">Create Pitch</a>
        </nav>

        {/* Search + CTA */}
        <div className="navbar__actions">
          <div className="navbar__search">
            <svg className="navbar__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="#9ca3af" strokeWidth="1.8" />
              <path d="M13.5 13.5L17 17" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search startups..."
              className="navbar__search-input"
              aria-label="Search startups"
            />
          </div>
          <a href="#signup" className="navbar__signup-btn">Sign Up</a>
        </div>
      </div>
    </header>
  )
}
