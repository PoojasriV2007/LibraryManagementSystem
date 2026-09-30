import { BookHeart, Bookmark, Cpu, FlaskConical, Landmark, Sprout, UserRound } from 'lucide-react'

export const CATEGORIES = [
  { name: 'Fiction', color: '#7c5cf6', bg: '#f1eaff', ink: '#7c3aed', icon: BookHeart },
  { name: 'Technology', color: '#4f7cf7', bg: '#e5efff', ink: '#2563eb', icon: Cpu },
  { name: 'Science', color: '#14b8a6', bg: '#d5f7f1', ink: '#0d9488', icon: FlaskConical },
  { name: 'History', color: '#fbbf24', bg: '#fef3c7', ink: '#d97706', icon: Landmark },
  { name: 'Biography', color: '#ec4899', bg: '#fde7f1', ink: '#db2777', icon: UserRound },
  { name: 'Self-Help', color: '#22c55e', bg: '#dcfce7', ink: '#16a34a', icon: Sprout },
  { name: 'Others', color: '#c3c6de', bg: '#eef0f6', ink: '#64748b', icon: Bookmark },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export const getCategory = (name) =>
  CATEGORIES.find((c) => c.name === name) ?? CATEGORIES[CATEGORIES.length - 1]

export const STATUSES = ['Available', 'Issued']

export const coverUrl = (isbn, size = 'M') =>
  isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false` : ''

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || '?'
