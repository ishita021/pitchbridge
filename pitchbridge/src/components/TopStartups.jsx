import { Link } from 'react-router-dom'
import { TOP_STARTUPS } from '../data/startups'
import './TopStartups.css'

export default function TopStartups() {
  return (
    <section className="startups" id="startups">
      <div className="startups__inner">
        <div className="startups__header">
          <span className="startups__badge">🏆 Top Ranked</span>
          <h2 className="startups__title">Startups Making Waves</h2>
          <p className="startups__subtitle">
            Discover the highest-performing startups on PitchBridge, ranked by revenue growth and investor interest.
          </p>
        </div>

        <div className="startups__grid">
          {TOP_STARTUPS.map((s, i) => (
            <article className="startup-card" key={s.id}>
              <div className="startup-card__top">
                <div className="startup-card__logo" style={{ background: s.logoColor }}>
                  {s.logo}
                </div>
                <div className="startup-card__meta">
                  <h3 className="startup-card__name">{s.company}</h3>
                  <div className="startup-card__tags">
                    <span className="tag tag--category">{s.industry}</span>
                    <span className="tag tag--stage">{s.stage}</span>
                  </div>
                </div>
                <span className="startup-card__rank">#{i + 1}</span>
              </div>

              <p className="startup-card__desc">{s.description}</p>

              <div className="startup-card__stats">
                <div className="stat">
                  <span className="stat__label">Raised</span>
                  <span className="stat__value">{s.raised}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">Revenue</span>
                  <span className="stat__value">{s.revenue}</span>
                </div>
                <div className="stat">
                  <span className="stat__label">Growth</span>
                  <span className="stat__value stat__value--green">{s.growth}</span>
                </div>
              </div>

              <Link to={`/pitch/${s.id}`} className="startup-card__cta">
                View Pitch →
              </Link>
            </article>
          ))}
        </div>

        <div className="startups__footer">
          <Link to="/browse" className="startups__view-all">View All Startups →</Link>
        </div>
      </div>
    </section>
  )
}
