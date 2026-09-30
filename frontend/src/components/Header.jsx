import { useState } from 'react'
import { Database, Menu, Search } from 'lucide-react'
import Logo from './Logo'
import { initials } from '../utils/constants'

const greetingFor = (hour) => (hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening')

export function TopBar({ user, storage, onMenu, onSearch }) {
  return (
    <div className="topbar">
      <button type="button" className="icon-square menu-btn" onClick={onMenu} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <span className="topbar-logo"><Logo /></span>
      <div className="topbar-actions">
        {storage === 'file' && (
          <span className="storage-chip" title="MongoDB is not reachable, so the server is saving data to a temporary local file.">
            <Database size={15} /> Temporary storage
          </span>
        )}
        <button type="button" className="icon-square" onClick={onSearch} aria-label="Search books">
          <Search size={21} strokeWidth={2.2} />
        </button>
        <span className="avatar" title={`${user.name} (${user.email})`} aria-label={`Signed in as ${user.name}`}>
          {initials(user.name)}
        </span>
      </div>
    </div>
  )
}

export function Hero({ name }) {
  const [greeting] = useState(() => greetingFor(new Date().getHours()))
  const firstName = name.split(' ')[0]
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hero-greeting">{greeting}, {firstName} <span aria-hidden="true">👋</span></p>
        <h1 className="hero-title">Manage Your<br /><span className="text-gradient">Library</span> Smarter</h1>
        <p className="hero-sub">Add, track and organise every book in one place.</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <img src="/images/hero-library.jpg" alt="" />
        <span className="sticky-note hero-note">Read<br />Track<br />Share<br />Repeat</span>
      </div>
    </section>
  )
}

export function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}
    </section>
  )
}
