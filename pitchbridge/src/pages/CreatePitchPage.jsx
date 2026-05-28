import { useState } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiCreatePitch } from '../services/api'
import './CreatePitchPage.css'

const INDUSTRIES = [
  'Select industry', 'SaaS', 'FinTech', 'HealthTech', 'EdTech',
  'E-commerce', 'Logistics', 'CyberSecurity', 'CleanTech', 'Other',
]
const STAGES = [
  'Select stage', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+',
]

const EMPTY_MEMBER = { name: '', role: '' }

export default function CreatePitchPage() {
  const [form, setForm] = useState({
    title: '',
    company: '',
    website: '',
    industry: 'Select industry',
    stage: 'Select stage',
    funding: '',
    summary: '',
    problem: '',
    solution: '',
    market: '',
    businessModel: '',
    traction: '',
  })
  const [members, setMembers] = useState([{ ...EMPTY_MEMBER }])
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdPitchId, setCreatedPitchId] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/signup" replace state={{ from: location.pathname }} />
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleMemberChange(index, field, value) {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  function addMember() {
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }])
  }

  function removeMember(index) {
    setMembers((prev) => prev.filter((_, i) => i !== index))
  }

  function handleFileDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }

  function handleFileInput(e) {
    const picked = Array.from(e.target.files)
    setFiles((prev) => [...prev, ...picked])
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!user || user.role !== 'founder') {
      setError('Please sign up or log in as a founder before creating a pitch.')
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        ...form,
        teamMembers: members.filter((m) => m.name.trim() || m.role.trim()),
        attachments: files.map((file) => file.name),
      }

      const createdPitch = await apiCreatePitch(payload)
      setCreatedPitchId(createdPitch._id)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Unable to save pitch. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!loading && user && user.role !== 'founder') {
    return (
      <div className="create-pitch">
        <div className="create-pitch__inner">
          <div className="create-pitch__header">
            <h1 className="create-pitch__title">Create Your Pitch</h1>
            <p className="create-pitch__subtitle">Only founders can create startups pitches.</p>
          </div>
          <div className="pitch-form__error">Please sign up or switch to a founder account to create a pitch.</div>
          <div className="pitch-actions">
            <Link to="/signup" className="btn-publish">Sign Up as Founder</Link>
            <button type="button" className="btn-draft" onClick={() => navigate('/dashboard/investor')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="pitch-success">
        <div className="pitch-success__card">
          <div className="pitch-success__icon">✓</div>
          <h2>Pitch Submitted!</h2>
          <p>Your pitch for <strong>{form.company || 'your startup'}</strong> has been published. Investors can now discover and connect with you.</p>
          <div className="pitch-success__actions">
            <Link to={createdPitchId ? `/pitch/${createdPitchId}` : '/browse'} className="pitch-success__btn">View Pitch</Link>
            <button type="button" className="pitch-success__btn pitch-success__btn--secondary" onClick={() => navigate('/dashboard/founder')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="create-pitch">
      <div className="create-pitch__inner">

        {/* Page header */}
        <div className="create-pitch__header">
          <h1 className="create-pitch__title">Create Your Pitch</h1>
          <p className="create-pitch__subtitle">Tell investors about your startup and why they should invest</p>
        </div>

        <form className="pitch-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="pitch-form__error">{error}</div>}

          {/* ── Section 1: Basic Information ── */}
          <section className="pitch-section">
            <h2 className="pitch-section__title">Basic Information</h2>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="title">Pitch Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="pitch-input"
                placeholder="e.g., AI-Powered Analytics Platform"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-row">
              <div className="pitch-field">
                <label className="pitch-label" htmlFor="company">Company Name</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="pitch-input"
                  placeholder="Your Company"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
              <div className="pitch-field">
                <label className="pitch-label" htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="pitch-input"
                  placeholder="https://yourcompany.com"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pitch-row">
              <div className="pitch-field">
                <label className="pitch-label" htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  name="industry"
                  className="pitch-select"
                  value={form.industry}
                  onChange={handleChange}
                >
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="pitch-field">
                <label className="pitch-label" htmlFor="stage">Funding Stage</label>
                <select
                  id="stage"
                  name="stage"
                  className="pitch-select"
                  value={form.stage}
                  onChange={handleChange}
                >
                  {STAGES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="funding">Funding Amount Seeking</label>
              <input
                id="funding"
                name="funding"
                type="text"
                className="pitch-input"
                placeholder="e.g., $500K - $2M"
                value={form.funding}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* ── Section 2: Pitch Details ── */}
          <section className="pitch-section">
            <h2 className="pitch-section__title">Pitch Details</h2>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="summary">Executive Summary</label>
              <textarea
                id="summary"
                name="summary"
                className="pitch-textarea"
                placeholder="Brief overview of your startup..."
                rows={4}
                value={form.summary}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="problem">Problem</label>
              <textarea
                id="problem"
                name="problem"
                className="pitch-textarea"
                placeholder="What problem are you solving?"
                rows={4}
                value={form.problem}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="solution">Solution</label>
              <textarea
                id="solution"
                name="solution"
                className="pitch-textarea"
                placeholder="How does your product solve this problem?"
                rows={4}
                value={form.solution}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="market">Market Opportunity</label>
              <textarea
                id="market"
                name="market"
                className="pitch-textarea"
                placeholder="Market size, target audience, growth potential..."
                rows={4}
                value={form.market}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="businessModel">Business Model</label>
              <textarea
                id="businessModel"
                name="businessModel"
                className="pitch-textarea"
                placeholder="How do you make money?"
                rows={4}
                value={form.businessModel}
                onChange={handleChange}
              />
            </div>

            <div className="pitch-field">
              <label className="pitch-label" htmlFor="traction">Traction</label>
              <textarea
                id="traction"
                name="traction"
                className="pitch-textarea"
                placeholder="Users, revenue, partnerships, milestones achieved..."
                rows={4}
                value={form.traction}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* ── Section 3: Team Members ── */}
          <section className="pitch-section">
            <div className="pitch-section__head">
              <h2 className="pitch-section__title">Team Members</h2>
              <button type="button" className="btn-add-member" onClick={addMember}>
                + Add Member
              </button>
            </div>

            <div className="team-members">
              {members.map((m, i) => (
                <div className="team-member-row" key={i}>
                  <input
                    type="text"
                    className="pitch-input"
                    placeholder="Name"
                    value={m.name}
                    onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                    aria-label={`Team member ${i + 1} name`}
                  />
                  <input
                    type="text"
                    className="pitch-input"
                    placeholder="Role"
                    value={m.role}
                    onChange={(e) => handleMemberChange(i, 'role', e.target.value)}
                    aria-label={`Team member ${i + 1} role`}
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-member"
                      onClick={() => removeMember(i)}
                      aria-label="Remove member"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 4: Attachments ── */}
          <section className="pitch-section">
            <h2 className="pitch-section__title">Attachments (Optional)</h2>

            <div
              className={`dropzone ${dragOver ? 'dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-input').click()}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input').click()}
            >
              <svg className="dropzone__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <p className="dropzone__text">Upload pitch deck, financial projections, or other documents</p>
              <p className="dropzone__hint">PDF, PPT, or DOC (Max 10MB)</p>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx"
                multiple
                className="dropzone__input"
                onChange={handleFileInput}
              />
            </div>

            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f, i) => (
                  <li className="file-item" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" className="file-item__icon" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="file-item__name">{f.name}</span>
                    <span className="file-item__size">{(f.size / 1024).toFixed(0)} KB</span>
                    <button
                      type="button"
                      className="file-item__remove"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${f.name}`}
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ── Submit buttons ── */}
          <div className="pitch-actions">
            <button type="submit" className="btn-publish" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish Pitch'}
            </button>
            <button type="button" className="btn-draft" disabled={submitting}>
              Save as Draft
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
