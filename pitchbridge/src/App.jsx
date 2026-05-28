import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseStartupsPage from './pages/BrowseStartupsPage'
import CreatePitchPage from './pages/CreatePitchPage'
import SignUpPage from './pages/SignUpPage'
import InvestorDashboard from './pages/InvestorDashboard'
import FounderDashboard from './pages/FounderDashboard'
import PitchDetailPage from './pages/PitchDetailPage'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { loading } = useAuth()

  // Wait for session restore before rendering routes — prevents a flash
  // where the navbar briefly shows "Sign Up" even when the user is logged in.
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#111827', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseStartupsPage />} />
          <Route path="/pitch/:id" element={<PitchDetailPage />} />
          <Route path="/create-pitch" element={<CreatePitchPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard/investor" element={<InvestorDashboard />} />
          <Route path="/dashboard/founder" element={<FounderDashboard />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
