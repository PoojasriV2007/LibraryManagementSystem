import { ArrowLeftRight, Pencil, Trash2 } from 'lucide-react'
import BookCover from './BookCover'
import { formatDate, getCategory } from '../utils/constants'

export default function BookRow({ book, busy, onToggle, onEdit, onDelete }) {
  const cat = getCategory(book.category)
  const issued = book.status === 'Issued'
  return (
    <tr className="book-row" data-id={book.id}>
      <td className="cell-book">
        <BookCover book={book} />
        <span className="book-meta">
          <span className="book-title">{book.title}</span>
          <span className="book-author">{book.author}</span>
        </span>
      </td>
      <td className="cell-category">
        <span className="cat-pill" style={{ background: cat.bg, color: cat.ink }}>{book.category}</span>
      </td>
      <td className="cell-status">
        <span className={`status-pill ${issued ? 'issued' : 'available'}`}>
          <span className="status-dot" />{book.status}
        </span>
        {issued && book.issuedTo && <span className="issued-to">to {book.issuedTo}</span>}
      </td>
      <td className="cell-date">{formatDate(book.createdAt)}</td>
      <td className="cell-actions">
        <button
          type="button"
          className={`toggle-btn ${issued ? 'to-available' : 'to-issued'}`}
          onClick={() => onToggle(book)}
          disabled={busy}
          title={issued ? 'Mark as Available' : 'Mark as Issued'}
        >
          <ArrowLeftRight size={15} />
          <span>{issued ? 'Return' : 'Issue'}</span>
        </button>
        <button type="button" className="round-btn" onClick={() => onEdit(book)} aria-label={`Edit ${book.title}`} title="Edit">
          <Pencil size={17} />
        </button>
        <button type="button" className="round-btn danger" onClick={() => onDelete(book)} aria-label={`Delete ${book.title}`} title="Delete">
          <Trash2 size={17} />
        </button>
      </td>
    </tr>
  )
}
