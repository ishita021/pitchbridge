import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        {/* Headline */}
        <div className="hero__text">
          <h1 className="hero__title">
            Bridge the Gap Between<br />Founders &amp; Investors
          </h1>
          <p className="hero__subtitle">
            PitchBridge connects innovative startups with investors who believe in their vision.<br />
            Whether you're raising capital or finding your next investment opportunity, start here.
          </p>
        </div>

        {/* Role cards */}
        <div className="hero__cards">
          {/* Investor card */}
          <div className="role-card">
            <div className="role-card__icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" className="role-card__icon" aria-hidden="true">
                <path d="M3 17l5-5 4 4 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="role-card__title">I'm an Investor</h2>
            <p className="role-card__desc">
              Discover promising startups and connect with innovative founders
            </p>
            <Link to="/browse" className="role-card__link">
              Browse Startups <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Founder card */}
          <div className="role-card">
            <div className="role-card__icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" className="role-card__icon" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="role-card__title">I'm a Founder</h2>
            <p className="role-card__desc">
              Present your startup to investors and secure the funding you need
            </p>
            <Link to="/create-pitch" className="role-card__link">
              Create Your Pitch <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
