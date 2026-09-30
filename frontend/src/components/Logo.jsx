import { LibraryBig } from 'lucide-react'

export default function Logo() {
  return (
    <span className="logo">
      <span className="logo-icon"><LibraryBig size={26} strokeWidth={2.1} /></span>
      <span className="logo-text">Shelf<span className="logo-accent">ly</span></span>
    </span>
  )
}
