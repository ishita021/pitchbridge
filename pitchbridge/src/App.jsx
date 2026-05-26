import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseStartupsPage from './pages/BrowseStartupsPage'
import CreatePitchPage from './pages/CreatePitchPage'
import SignUpPage from './pages/SignUpPage'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowseStartupsPage />} />
          <Route path="/create-pitch" element={<CreatePitchPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
