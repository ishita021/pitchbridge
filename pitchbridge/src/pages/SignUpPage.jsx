import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiSignup } from '../services/api'
import './SignUpPage.css'

// ─── Role Selection Screen ────────────────────────────────────────────────────
function RoleSelect({ onSelect }) {
  return (
    <div className="signup-role">
      <div className="signup-role__inner">
        <div className="signup-role__header">
          <h1 className="signup-role__title">Join PitchBridge</h1>
          <p className="signup-role__subtitle">Choose how you want to get started</p>
        </div>

        <div className="signup-role__cards">
          {/* Founder */}
          <button className="role-pick-card" onClick={() => onSelect('founder')}>
            <div className="role-pick-card__icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 8h4M7 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="role-pick-card__title">Sign Up as Founder</h2>
            <p className="role-pick-card__desc">
              Create your startup pitch, connect with investors, and raise capital for your venture
            </p>
            <span className="role-pick-card__link">Get Started →</span>
          </button>

          {/* Investor */}
          <button className="role-pick-card" onClick={() => onSelect('investor')}>
            <div className="role-pick-card__icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="role-pick-card__title">Sign Up as Investor</h2>
            <p className="role-pick-card__desc">
              Discover innovative startups, review pitches, and find your next investment opportunity
            </p>
            <span className="role-pick-card__link">Get Started →</span>
          </button>
        </div>

        <p className="signup-role__login">
          Already have an account? <a href="#">Log in</a>
        </p>
      </div>
    </div>
  )
}

// ─── Founder Form ─────────────────────────────────────────────────────────────
const INDUSTRIES = [
  'Select industry', 'SaaS', 'FinTech', 'HealthTech', 'EdTech',
  'E-commerce', 'Logistics', 'CyberSecurity', 'CleanTech', 'Other',
]

function FounderForm({ onChangeType }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', company: '', industry: 'Select industry',
    password: '', confirm: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.company.trim()) e.company = 'Company name is required'
    if (form.industry === 'Select industry') e.industry = 'Please select an industry'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSubmitting(true)
    setApiError('')

    try {
      const user = await apiSignup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'founder',
        company: form.company,
        industry: form.industry,
      })
      login(user)
      navigate('/dashboard/founder')
    } catch (err) {
      // Map server field errors back to inline form errors
      if (err.errors?.length) {
        const fieldErrs = {}
        err.errors.forEach(({ field, message }) => { fieldErrs[field] = message })
        setErrors(fieldErrs)
      } else {
        setApiError(err.message || 'Sign up failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signup-form-page">
      <div className="signup-form-wrap">
        <div className="signup-form-header">
          <h1 className="signup-form-title">Founder Sign Up</h1>
          <p className="signup-form-subtitle">Create your account to get started</p>
          <button className="signup-change-type" onClick={onChangeType}>Change account type</button>
        </div>

        {apiError && <div className="sf-api-error">{apiError}</div>}

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <Field label="Full Name" error={errors.name}>
            <InputIcon icon="user" />
            <input name="name" type="text" placeholder="John Doe"
              className={`sf-input ${errors.name ? 'sf-input--error' : ''}`}
              value={form.name} onChange={handleChange} autoComplete="name" />
          </Field>

          <Field label="Email" error={errors.email}>
            <InputIcon icon="mail" />
            <input name="email" type="email" placeholder="john@example.com"
              className={`sf-input ${errors.email ? 'sf-input--error' : ''}`}
              value={form.email} onChange={handleChange} autoComplete="email" />
          </Field>

          <Field label="Company Name" error={errors.company}>
            <InputIcon icon="building" />
            <input name="company" type="text" placeholder="Your Startup"
              className={`sf-input ${errors.company ? 'sf-input--error' : ''}`}
              value={form.company} onChange={handleChange} />
          </Field>

          <Field label="Industry" error={errors.industry}>
            <select name="industry"
              className={`sf-select ${errors.industry ? 'sf-input--error' : ''}`}
              value={form.industry} onChange={handleChange}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </Field>

          <Field label="Password" error={errors.password}>
            <InputIcon icon="lock" />
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
              className={`sf-input ${errors.password ? 'sf-input--error' : ''}`}
              value={form.password} onChange={handleChange} autoComplete="new-password" />
            <EyeToggle show={showPass} onToggle={() => setShowPass(p => !p)} />
          </Field>

          <Field label="Confirm Password" error={errors.confirm}>
            <InputIcon icon="lock" />
            <input name="confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
              className={`sf-input ${errors.confirm ? 'sf-input--error' : ''}`}
              value={form.confirm} onChange={handleChange} autoComplete="new-password" />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
          </Field>

          <button type="submit" className="sf-submit" disabled={submitting}>
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className="signup-form-login">Already have an account? <a href="#">Log in</a></p>
      </div>
    </div>
  )
}

// ─── Investor Form ────────────────────────────────────────────────────────────
const FOCUS_AREAS = [
  'Select focus area', 'SaaS', 'FinTech', 'HealthTech', 'EdTech',
  'E-commerce', 'Logistics', 'CyberSecurity', 'CleanTech', 'Deep Tech', 'Any',
]

function InvestorForm({ onChangeType }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', focus: 'Select focus area',
    password: '', confirm: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    setErrors(p => ({ ...p, [name]: '' }))
    setApiError('')
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (form.focus === 'Select focus area') e.focus = 'Please select a focus area'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSubmitting(true)
    setApiError('')

    try {
      const user = await apiSignup({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'investor',
        investmentFocus: form.focus,
      })
      login(user)
      navigate('/dashboard/investor')
    } catch (err) {
      if (err.errors?.length) {
        const fieldErrs = {}
        err.errors.forEach(({ field, message }) => { fieldErrs[field] = message })
        setErrors(fieldErrs)
      } else {
        setApiError(err.message || 'Sign up failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signup-form-page">
      <div className="signup-form-wrap">
        <div className="signup-form-header">
          <h1 className="signup-form-title">Investor Sign Up</h1>
          <p className="signup-form-subtitle">Create your account to get started</p>
          <button className="signup-change-type" onClick={onChangeType}>Change account type</button>
        </div>

        {apiError && <div className="sf-api-error">{apiError}</div>}

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <Field label="Full Name" error={errors.name}>
            <InputIcon icon="user" />
            <input name="name" type="text" placeholder="John Doe"
              className={`sf-input ${errors.name ? 'sf-input--error' : ''}`}
              value={form.name} onChange={handleChange} autoComplete="name" />
          </Field>

          <Field label="Email" error={errors.email}>
            <InputIcon icon="mail" />
            <input name="email" type="email" placeholder="john@example.com"
              className={`sf-input ${errors.email ? 'sf-input--error' : ''}`}
              value={form.email} onChange={handleChange} autoComplete="email" />
          </Field>

          <Field label="Investment Focus" error={errors.focus}>
            <select name="focus"
              className={`sf-select ${errors.focus ? 'sf-input--error' : ''}`}
              value={form.focus} onChange={handleChange}>
              {FOCUS_AREAS.map(f => <option key={f}>{f}</option>)}
            </select>
          </Field>

          <Field label="Password" error={errors.password}>
            <InputIcon icon="lock" />
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
              className={`sf-input ${errors.password ? 'sf-input--error' : ''}`}
              value={form.password} onChange={handleChange} autoComplete="new-password" />
            <EyeToggle show={showPass} onToggle={() => setShowPass(p => !p)} />
          </Field>

          <Field label="Confirm Password" error={errors.confirm}>
            <InputIcon icon="lock" />
            <input name="confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
              className={`sf-input ${errors.confirm ? 'sf-input--error' : ''}`}
              value={form.confirm} onChange={handleChange} autoComplete="new-password" />
            <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
          </Field>

          <button type="submit" className="sf-submit" disabled={submitting}>
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className="signup-form-login">Already have an account? <a href="#">Log in</a></p>
      </div>
    </div>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="sf-field">
      <label className="sf-label">{label}</label>
      <div className="sf-input-wrap">{children}</div>
      {error && <span className="sf-error">{error}</span>}
    </div>
  )
}

function InputIcon({ icon }) {
  if (icon === 'user') return (
    <svg className="sf-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  if (icon === 'mail') return (
    <svg className="sf-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  if (icon === 'building') return (
    <svg className="sf-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 21V9h6v12M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (icon === 'lock') return (
    <svg className="sf-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
  return null
}

function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" className="sf-eye" onClick={onToggle} aria-label={show ? 'Hide password' : 'Show password'}>
      {show ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )}
    </button>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function SignUpPage() {
  const [step, setStep] = useState('select') // 'select' | 'founder' | 'investor'

  if (step === 'founder') return <FounderForm onChangeType={() => setStep('select')} />
  if (step === 'investor') return <InvestorForm onChangeType={() => setStep('select')} />
  return <RoleSelect onSelect={setStep} />
}
