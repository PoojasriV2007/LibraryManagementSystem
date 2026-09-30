import { LibraryBig } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './components/AuthPage'
import Library from './components/Library'

function Gate() {
  const { user, checking } = useAuth()
  if (checking) {
    return (
      <div className="splash" role="status">
        <LibraryBig size={40} className="pulse" />
        <p>Opening your library…</p>
      </div>
    )
  }
  return user ? <Library /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
