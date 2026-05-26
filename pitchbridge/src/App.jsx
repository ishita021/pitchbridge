import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TopStartups from './components/TopStartups'
import WhyPitchBridge from './components/WhyPitchBridge'
import CTA from './components/CTA'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TopStartups />
        <WhyPitchBridge />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
