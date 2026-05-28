import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetMyPitches } from '../services/api'
import './FounderDashboard.css'

const INITIAL_PITCHES = [
  {
    id: 1,
    title: 'AI-Powered Analytics Platform',
    status: 'Active',
    updatedAgo: '2 days ago',
    views: 234,
    interests: 12,
  },
  {
    id: 2,
    title: 'Sustainable Food Delivery',
    status: 'Draft',
    updatedAgo: '1 week ago',
    views: 0,
    interests: 0,
  },
]

const ACTIVITY = [
  { id: 1, text: 'Investor from Sequoia Capital viewed your pitch', time: '2 hours ago', active: true },
  { id: 2, text: 'Your pitch "AI-Powered Analytics" received 5 new views', time: '1 day ago', active: true },
  { id: 3, text: 'You updated your pitch', time: '2 days ago', active: false },
]

export default function FounderDashboard() {
  const { user } = useAuth()
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPitches() {
      if (!user || user.role !== 'founder') {
        setLoading(false)
        return
      }

      try {
        const data = await apiGetMyPitches()
        setPitches(data)
      } catch (err) {
        setError(err.message || 'Unable to load your pitches.')
      } finally {
        setLoading(false)
      }
    }

    loadPitches()
  }, [user])

  const totalViews = pitches.reduce((s, p) => s + (p.views || 0), 0)
  const totalInterests = pitches.reduce((s, p) => s + (p.interests || 0), 0)

  function deletePitch(id) {
    setPitches(prev => prev.filter(p => p._id !== id))
  }

  if (!user) {
    return (
      <div className="dashboard fd">
        <div className="dashboard__inner">
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title">Founder Dashboard</h1>
              <p className="dashboard__subtitle">Please sign up or log in to view your pitches.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user.role !== 'founder') {
    return (
      <div className="dashboard fd">
        <div className="dashboard__inner">
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title">Founder Dashboard</h1>
              <p className="dashboard__subtitle">Only founders can access pitch management.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard fd">
      <div className="dashboard__inner">

        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Founder Dashboard</h1>
            <p className="dashboard__subtitle">Manage your pitches and connect with investors</p>
          </div>
          <Link to="/create-pitch" className="dashboard__cta-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create New Pitch
          </Link>
        </div>

        {loading && (
          <div className="dashboard__loading">Loading your pitches…</div>
        )}
        {error && (
          <div className="dashboard__error">{error}</div>
        )}

        {/* Stat cards */}
        <div className="dashboard__stats">
          <StatCard
            label="Total Pitches"
            value={pitches.length}
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 17l5-5 4 4 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Total Views"
            value={totalViews.toLocaleString()}
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            }
          />
          <StatCard
            label="Investor Interest"
            value={totalInterests}
            icon={
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Your Pitches */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Your Pitches</h2>
          {pitches.length === 0 ? (
            <div className="dashboard__empty">
              <p>No pitches yet. <Link to="/create-pitch">Create your first pitch</Link> to get started.</p>
            </div>
          ) : (
            <div className="pitch-list">
              {pitches.map((p) => {
                const updatedAgo = p.updatedAt ? formatUpdatedAgo(p.updatedAt) : 'just now'
                return (
                  <div className="pitch-row fd-pitch-row" key={p._id}>
                    <div className="pitch-row__body">
                      <div className="pitch-row__top">
                        <h3 className="pitch-row__title">{p.title}</h3>
                        <span className={`status-badge status-badge--${(p.status || 'Active').toLowerCase()}`}>
                          {p.status || 'Active'}
                        </span>
                      </div>
                      <p className="pitch-row__updated">Last updated {updatedAgo}</p>
                      <div className="pitch-row__stats">
                        <span className="pitch-stat">
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                          </svg>
                          {p.views || 0} views
                        </span>
                        <span className="pitch-stat">
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {p.interests || 0} interests
                        </span>
                      </div>
                    </div>
                    <div className="pitch-row__actions fd-actions">
                      <Link to={`/pitch/${p._id}`} className="btn-view-outline">View</Link>
                      <Link to="/create-pitch" className="btn-edit">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Recent Activity</h2>
          <div className="activity-card">
            <ul className="activity-list">
              {ACTIVITY.map(a => (
                <li className="activity-item" key={a.id}>
                  <span className={`activity-dot ${a.active ? 'activity-dot--active' : ''}`} aria-hidden="true" />
                  <div className="activity-item__body">
                    <p className="activity-item__text">{a.text}</p>
                    <span className="activity-item__time">{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
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

function formatUpdatedAgo(timestamp) {
  const diff = Math.max(0, Date.now() - new Date(timestamp).getTime())
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
