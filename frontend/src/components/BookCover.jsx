import { useState } from 'react'
import { coverUrl, getCategory } from '../utils/constants'

// Real cover from the Open Library Covers API when an ISBN is known, otherwise a styled placeholder.
export default function BookCover({ book, size = 'sm' }) {
  const [failed, setFailed] = useState(false)
  const cat = getCategory(book.category)
  const src = coverUrl(book.isbn, size === 'lg' ? 'L' : 'M')

  if (src && !failed) {
    return (
      <img
        className={`cover cover-${size}`}
        src={src}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }

  const Icon = cat.icon
  return (
    <span
      className={`cover cover-${size} cover-placeholder`}
      style={{ '--cover-a': cat.color, '--cover-b': cat.ink }}
      role="img"
      aria-label={`${book.title} (no cover)`}
    >
      <Icon size={size === 'sm' ? 16 : 26} strokeWidth={2} />
      {size !== 'sm' && <span className="cover-title">{book.title}</span>}
    </span>
  )
}
