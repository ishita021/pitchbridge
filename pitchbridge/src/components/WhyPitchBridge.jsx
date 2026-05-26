import './WhyPitchBridge.css'

const features = [
  {
    id: 1,
    title: 'Curated Network',
    desc: 'Connect with verified investors and pre-vetted startups in our trusted community',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Smart Matching',
    desc: 'Our algorithm matches startups with investors based on industry, stage, and interests',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Success Stories',
    desc: 'Join hundreds of successful funding rounds facilitated through PitchBridge',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function WhyPitchBridge() {
  return (
    <section className="why">
      <div className="why__inner">
        <h2 className="why__title">Why Choose PitchBridge?</h2>

        <div className="why__grid">
          {features.map((f) => (
            <div className="why-card" key={f.id}>
              <div className="why-card__icon-wrap">
                {f.icon}
              </div>
              <h3 className="why-card__title">{f.title}</h3>
              <p className="why-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
