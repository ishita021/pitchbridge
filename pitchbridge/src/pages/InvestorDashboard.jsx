import { useState } from 'react'
import { Link } from 'react-router-dom'
import './InvestorDashboard.css'

const SAVED_PITCHES = [
  {
    id: 1,
    title: 'AI-Powered Analytics Platform',
    company: 'DataViz AI',
    industry: 'SaaS',
    stage: 'Series A',
    seeking: '$2M',
    match: 95,
  },
  {
    id: 2,
    title: 'Sustainable Food Delivery',
    company: 'GreenEats',
    industry: 'E-commerce',
    stage: 'Seed',
    seeking: '$500K',
    match: 88,
  },
]

const RECENTLY_VIEWED = [
  { id: 3, title: 'Healthcare AI Assistant', company: 'MediTech', industry: 'HealthTech', stage: 'Pre-Seed' },
  { id: 4, title: 'EdTech Learning Platform', company: 'LearnMore', industry: 'EdTech', stage: 'Seed' },
]

export default function InvestorDashboard() {
  const [saved, setSaved] = useState(SAVED_PITCHES)

  function unsave(id) {
    setSaved(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="dashboard">
      <div className="dashboard__inner">

        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Investor Dashboard</h1>
            <p className="dashboard__subtitle">Discover and track promising startups</p>
          </div>
          <Link to="/browse" className="dashboard__cta-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Browse Startups
          </Link>
        </div>

        {/* Stat cards */}
        <div className="dashboard__stats">
          <StatCard
            label="Saved Pitches"
            value={saved.length}
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Pitches Reviewed"
            value={15}
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
          <StatCard
            label="Best Match"
            value="95%"
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Saved Pitches */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Saved Pitches</h2>
          {saved.length === 0 ? (
            <div className="dashboard__empty">
              <p>No saved pitches yet. <Link to="/browse">Browse startups</Link> to save some.</p>
            </div>
          ) : (
            <div className="pitch-list">
              {saved.map(p => (
                <div className="pitch-row" key={p.id}>
                  <div className="pitch-row__body">
                    <div className="pitch-row__top">
                      <h3 className="pitch-row__title">{p.title}</h3>
                      <span className="match-badge">★ {p.match}% match</span>
                    </div>
                    <p className="pitch-row__company">{p.company}</p>
                    <div className="pitch-row__meta">
                      <span className="tag tag--sm">{p.industry}</span>
                      <span className="tag tag--sm">{p.stage}</span>
                      <span className="pitch-row__seeking">Seeking {p.seeking}</span>
                    </div>
                  </div>
                  <div className="pitch-row__actions">
                    <button className="btn-view-dark">View Pitch</button>
                    <button
                      className="btn-bookmark-filled"
                      onClick={() => unsave(p.id)}
                      aria-label="Remove from saved"
                      title="Remove bookmark"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Viewed */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Recently Viewed</h2>
          <div className="recent-grid">
            {RECENTLY_VIEWED.map(p => (
              <div className="recent-card" key={p.id}>
                <h3 className="recent-card__title">{p.title}</h3>
                <p className="recent-card__company">{p.company}</p>
                <div className="recent-card__tags">
                  <span className="tag tag--sm">{p.industry}</span>
                  <span className="tag tag--sm">{p.stage}</span>
                </div>
                <a href="#" className="recent-card__link">View Details →</a>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Recommended for You</h2>
          <div className="recommend-card">
            <div className="recommend-card__icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 17l5-5 4 4 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="recommend-card__body">
              <p className="recommend-card__title">New matches based on your interests</p>
              <p className="recommend-card__desc">We found 8 new startups that match your investment criteria</p>
            </div>
            <Link to="/browse" className="btn-recommend">View Recommendations</Link>
          </div>
        </section>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon">{icon}</span>
      </div>
      <span className="stat-card__value">{value}</span>
    </div>
  )
}
