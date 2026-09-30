import { BookCheck, BookOpen, BookPlus, BookUp, House, LibraryBig, LogOut, X } from 'lucide-react'
import Logo from './Logo'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: House },
  { id: 'add', label: 'Add Book', icon: BookPlus },
  { id: 'books', label: 'All Books', icon: LibraryBig },
  { id: 'available', label: 'Available', icon: BookCheck },
  { id: 'issued', label: 'Issued', icon: BookUp },
]

export default function Sidebar({ view, onNavigate, onLogout, open, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop${open ? ' show' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-head">
          <Logo />
          <button type="button" className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <p className="sidebar-tagline">Read Today<br />Grow a Better Tomorrow</p>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`nav-link${view === id ? ' active' : ''}`}
              aria-current={view === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              <Icon size={23} strokeWidth={1.8} />
              {label}
            </button>
          ))}
          <button type="button" className="nav-link" onClick={onLogout}>
            <LogOut size={23} strokeWidth={1.8} />
            Log Out
          </button>
        </nav>

        <div className="sidebar-art" aria-hidden="true">
          <img src="/images/sidebar-shelves.jpg" alt="" />
          <span className="sticky-note">Read<br />Learn<br />Grow<br />Repeat <span className="heart">♥</span></span>
        </div>

        <div className="sidebar-quote">
          <BookOpen size={26} strokeWidth={1.6} />
          <p>“A room without books is like a body without a soul.”</p>
        </div>
      </aside>
    </>
  )
}
