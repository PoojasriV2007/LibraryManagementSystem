import BookCover from './BookCover'

export default function RecentBooks({ books, issued, total, onOpen }) {
  const recent = books.slice(0, 5)
  const availablePct = total ? Math.round(((total - issued) / total) * 100) : 0

  return (
    <section className="card recent-card">
      <div className="card-head">
        <h2 className="card-title">Recently Added</h2>
      </div>

      {recent.length ? (
        <ul className="shelf">
          {recent.map((b) => (
            <li key={b.id}>
              <button type="button" className="shelf-book" onClick={() => onOpen(b)} title={`Edit ${b.title}`}>
                <BookCover book={b} size="md" />
                <span className="shelf-title">{b.title}</span>
                <span className="shelf-author">{b.author}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No books yet.</p>
      )}

      <div className="availability">
        <div className="availability-head">
          <span>Availability</span>
          <span><strong>{total - issued}</strong> available · <strong>{issued}</strong> issued</span>
        </div>
        <div className="availability-bar" role="img" aria-label={`${availablePct}% of books available`}>
          <span style={{ width: `${availablePct}%` }} />
        </div>
      </div>
    </section>
  )
}
