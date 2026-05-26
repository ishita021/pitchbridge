import { Link } from 'react-router-dom'
import './TopStartups.css'

const startups = [
  {
    id: 1,
    name: 'NovaMed AI',
    category: 'HealthTech',
    stage: 'Series A',
    raised: '$4.2M',
    revenue: '$1.8M ARR',
    growth: '+142%',
    description: 'AI-powered diagnostics platform reducing misdiagnosis rates by 60% across rural hospitals.',
    logo: 'NM',
    logoColor: '#6366f1',
  },
  {
    id: 2,
    name: 'GreenLoop',
    category: 'CleanTech',
    stage: 'Seed',
    raised: '$1.5M',
    revenue: '$620K ARR',
    growth: '+98%',
    description: 'Circular economy marketplace connecting manufacturers with recycled material suppliers.',
    logo: 'GL',
    logoColor: '#10b981',
  },
  {
    id: 3,
    name: 'FinNest',
    category: 'FinTech',
    stage: 'Series B',
    raised: '$12M',
    revenue: '$5.4M ARR',
    growth: '+210%',
    description: 'Embedded finance infrastructure enabling SMBs to offer banking products to their customers.',
    logo: 'FN',
    logoColor: '#f59e0b',
  },
  {
    id: 4,
    name: 'EduSpark',
    category: 'EdTech',
    stage: 'Seed',
    raised: '$800K',
    revenue: '$310K ARR',
    growth: '+76%',
    description: 'Adaptive learning platform personalising K-12 curriculum using real-time performance data.',
    logo: 'ES',
    logoColor: '#ec4899',
  },
  {
    id: 5,
    name: 'LogiFlow',
    category: 'Logistics',
    stage: 'Series A',
    raised: '$6.1M',
    revenue: '$2.9M ARR',
    growth: '+165%',
    description: 'Last-mile delivery optimisation SaaS cutting delivery costs by 35% for e-commerce brands.',
    logo: 'LF',
    logoColor: '#3b82f6',
  },
  {
    id: 6,
    name: 'CyberShield',
    category: 'CyberSecurity',
    stage: 'Series A',
    raised: '$8.3M',
    revenue: '$3.7M ARR',
    growth: '+188%',
    description: 'Zero-trust security platform protecting mid-market companies from ransomware attacks.',
    logo: 'CS',
    logoColor: '#8b5cf6',
  },
]

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
          {startups.map((s, i) => (
            <article className="startup-card" key={s.id}>
              <div className="startup-card__top">
                <div className="startup-card__logo" style={{ background: s.logoColor }}>
                  {s.logo}
                </div>
                <div className="startup-card__meta">
                  <h3 className="startup-card__name">{s.name}</h3>
                  <div className="startup-card__tags">
                    <span className="tag tag--category">{s.category}</span>
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

              <a href="#" className="startup-card__cta">View Pitch →</a>
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
