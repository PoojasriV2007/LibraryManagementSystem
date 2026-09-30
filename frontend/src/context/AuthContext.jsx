import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler, tokenStore } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(() => Boolean(tokenStore.get()))
  const [notice, setNotice] = useState('')

  const logout = useCallback((message = '') => {
    tokenStore.clear()
    setUser(null)
    setNotice(message)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler((message) => logout(message || 'Please log in again.'))
  }, [logout])

  useEffect(() => {
    if (!tokenStore.get()) return
    let cancelled = false
    api
      .me()
      .then(({ user: me }) => !cancelled && setUser(me))
      .catch((err) => {
        if (cancelled) return
        if (err.status === 0) setNotice(err.message)
        else tokenStore.clear()
      })
      .finally(() => !cancelled && setChecking(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleSession = ({ token, user: account }) => {
    tokenStore.set(token)
    setNotice('')
    setUser(account)
  }

  const value = useMemo(
    () => ({
      user,
      checking,
      notice,
      clearNotice: () => setNotice(''),
      login: async (payload) => handleSession(await api.login(payload)),
      signup: async (payload) => handleSession(await api.signup(payload)),
      logout,
    }),
    [user, checking, notice, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
