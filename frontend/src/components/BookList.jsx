import { ChevronDown, Inbox, Loader, Plus, Search } from 'lucide-react'
import { CATEGORY_NAMES } from '../utils/constants'
import BookRow from './BookRow'

export default function BookList({
  title,
  books,
  loading,
  error,
  totalCount,
  limit,
  filters,
  onFiltersChange,
  lockStatus,
  busyId,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  onViewAll,
  searchRef,
}) {
  const shown = limit ? books.slice(0, limit) : books
  const set = (key) => (e) => onFiltersChange({ ...filters, [key]: e.target.value })

  return (
    <section className="card list-card">
      <div className="list-head">
        <h2 className="card-title">
          {title}
          {loading && <Loader size={17} className="spin" aria-label="Loading" />}
        </h2>
        <div className="list-tools">
          <label className="search-box">
            <Search size={19} />
            <span className="visually-hidden">Search by title or author</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search title or author..."
              value={filters.search}
              onChange={set('search')}
            />
          </label>
          {!lockStatus && (
            <label className="select-box">
              <span className="visually-hidden">Filter by status</span>
              <select value={filters.status} onChange={set('status')}>
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Issued">Issued</option>
              </select>
              <ChevronDown size={16} />
            </label>
          )}
          <label className="select-box">
            <span className="visually-hidden">Filter by category</span>
            <select value={filters.category} onChange={set('category')}>
              <option value="">All Categories</option>
              {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} />
          </label>
          <button type="button" className="btn-gradient" onClick={onAdd}>
            <Plus size={20} strokeWidth={2.4} /> Add Book
          </button>
        </div>
      </div>

      {error ? (
        <div className="empty error"><p>{error}</p></div>
      ) : shown.length > 0 ? (
        <div className="table-wrap">
          <table className="book-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Status</th>
                <th>Added</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => (
                <BookRow key={b.id} book={b} busy={busyId === b.id} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="empty">
            <Inbox size={40} strokeWidth={1.5} />
            <p>{totalCount === 0 ? 'Your library is empty. Add your first book!' : 'No books match your search or filters.'}</p>
            {totalCount === 0 && <button type="button" className="btn-gradient" onClick={onAdd}><Plus size={18} /> Add Book</button>}
          </div>
        )
      )}

      {books.length > 0 && !error && (
        <div className="list-foot">
          <span>Showing <strong>{shown.length}</strong> of <strong>{books.length}</strong> book{books.length === 1 ? '' : 's'}</span>
          {onViewAll && books.length > shown.length && (
            <button type="button" className="link-btn" onClick={onViewAll}>View all books →</button>
          )}
        </div>
      )}
    </section>
  )
}
