import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiGetMe, apiLogout, clearTokens, getAccessToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // user = { _id, name, role, email, ... } or null
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while we check for an existing session

  /**
   * On mount: if a token exists in localStorage, fetch the user profile
   * so the session survives a page refresh.
   */
  useEffect(() => {
    async function restoreSession() {
      const token = getAccessToken()
      if (!token) { setLoading(false); return }

      try {
        const me = await apiGetMe()
        setUser(me)
      } catch {
        // Token is expired or invalid — clear it silently
        clearTokens()
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  /**
   * Called by SignUpPage / LoginPage after a successful API response.
   * The API service already saved the tokens to localStorage.
   */
  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

  /**
   * Log out: invalidate server-side refresh token, clear local state.
   */
  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // Even if the server call fails, clear local state
      clearTokens()
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
