import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ALL_PITCHES } from '../data/startups'
import { apiGetPitch } from '../services/api'
import './PitchDetailPage.css'

export default function PitchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pitch, setPitch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [interested, setInterested] = useState(false)

  useEffect(() => {
    async function loadPitch() {
      setLoading(true)
      setError('')
      try {
        const data = await apiGetPitch(id)
        setPitch(data)
      } catch (err) {
        const fallback = ALL_PITCHES.find((s) => s.id === Number(id))
        if (fallback) {
          setPitch(fallback)
        } else {
          setError('Pitch not found')
        }
      } finally {
        setLoading(false)
      }
    }

    loadPitch()
  }, [id])

  if (loading) {
    return (
      <div className="pd-not-found">
        <h2>Loading pitch…</h2>
      </div>
    )
  }

  if (error || !pitch) {
    return (
      <div className="pd-not-found">
        <h2>{error || 'Pitch not found'}</h2>
        <Link to="/browse" className="pd-back-link">← Back to Browse</Link>
      </div>
    )
  }

  function handleInterest() {
    setInterested(true)
  }

  const teamMembers = pitch.teamMembers?.length
    ? pitch.teamMembers.map((member) => ({
        ...member,
        initials: member.name
          .split(' ')
          .map((part) => part[0]?.toUpperCase())
          .join(''),
      }))
    : [
        {
          name: pitch.author?.name || 'Founder',
          role: pitch.company || 'Founder',
          initials: (pitch.author?.name || 'F').charAt(0).toUpperCase(),
        },
      ]

  const pitchWebsite = pitch.website || '#'
  const pitchEmail = pitch.author?.email || pitch.email || 'hello@pitchbridge.com'
  const seeking = pitch.funding || 'TBA'
  const founded = pitch.createdAt ? new Date(pitch.createdAt).getFullYear() : '2024'
  const teamSize = pitch.teamMembers?.length || 1
  const pitchMatch = pitch.match ?? 88

  return (
    <div className="pd">
      <div className="pd__inner">

        {/* Back link */}
        <button className="pd-back-link" onClick={() => navigate(-1)}>
          ← Back to Browse
        </button>

        {/* Hero header */}
        <div className="pd__header">
          <div className="pd__header-left">
            <h1 className="pd__title">{pitch.title}</h1>
            <p className="pd__company">{pitch.company}</p>
            <div className="pd__tags">
              <span className="tag tag--sm">{pitch.industry}</span>
              <span className="tag tag--sm">{pitch.stage}</span>
              <span className="pd__match">↗ {pitchMatch}% match</span>
            </div>
          </div>
          <div className="pd__header-actions">
            <button
              className={`pd-btn-save ${saved ? 'pd-btn-save--active' : ''}`}
              onClick={() => setSaved(p => !p)}
              aria-label={saved ? 'Unsave pitch' : 'Save pitch'}
            >
              <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {saved ? 'Saved' : 'Save'}
            </button>
            <button className="pd-btn-share" aria-label="Share pitch">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Key metrics */}
        <div className="pd__metrics">
          <div className="pd-metric">
            <span className="pd-metric__icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="pd-metric__label">Seeking</span>
            <span className="pd-metric__value">{seeking}</span>
          </div>
          <div className="pd-metric">
            <span className="pd-metric__icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span className="pd-metric__label">Founded</span>
            <span className="pd-metric__value">{founded}</span>
          </div>
          <div className="pd-metric">
            <span className="pd-metric__icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="pd-metric__label">Team Size</span>
            <span className="pd-metric__value">{teamSize} members</span>
          </div>
        </div>

        {/* Content sections */}
        <PitchSection title="Executive Summary" content={pitch.summary || pitch.description || 'No summary provided.'} />
        <PitchSection title="Problem" content={pitch.problem || 'No problem statement provided.'} />
        <PitchSection title="Solution" content={pitch.solution || 'No solution provided.'} />
        <PitchSection title="Market Opportunity" content={pitch.market || 'No market opportunity details.'} />
        <PitchSection title="Business Model" content={pitch.businessModel || 'No business model details.'} />
        <PitchSection title="Traction" content={pitch.traction || 'No traction details yet.'} />
        <PitchSection title="Competition & Differentiation" content={pitch.competition || 'No competition details provided.'} />

        {/* Team */}
        <div className="pd-section">
          <h2 className="pd-section__title">Team</h2>
          <div className="pd-team">
            {teamMembers.map((member, i) => (
              <div className="pd-team-member" key={i}>
                <div className="pd-team-member__avatar">{member.initials}</div>
                <div className="pd-team-member__info">
                  <p className="pd-team-member__name">{member.name}</p>
                  <p className="pd-team-member__role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="pd-section">
          <h2 className="pd-section__title">Contact Information</h2>
          <div className="pd-contact">
            <a href={pitchWebsite} target="_blank" rel="noopener noreferrer" className="pd-contact__item">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {pitchWebsite}
            </a>
            <a href={`mailto:${pitchEmail}`} className="pd-contact__item">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {pitchEmail}
            </a>
          </div>

          {interested ? (
            <div className="pd-interest-success">
              ✓ Interest expressed! The founder will be in touch shortly.
            </div>
          ) : (
            <button className="pd-btn-interest" onClick={handleInterest}>
              Express Interest
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

function PitchSection({ title, content }) {
  return (
    <div className="pd-section">
      <h2 className="pd-section__title">{title}</h2>
      <p className="pd-section__content">{content}</p>
    </div>
  )
}
