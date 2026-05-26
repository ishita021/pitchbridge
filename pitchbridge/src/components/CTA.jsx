import { Link } from 'react-router-dom'
import './CTA.css'

export default function CTA() {
  return (
    <section className="cta" id="signup">
      <div className="cta__inner">
        <h2 className="cta__title">Ready to Get Started?</h2>
        <p className="cta__subtitle">
          Join thousands of founders and investors making connections on PitchBridge
        </p>
        <Link to="/signup" className="cta__btn">Create Your Account</Link>
      </div>
    </section>
  )
}
