import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import { Hero, PageHeader, TopBar } from './Header'
import StatCards from './StatCards'
import CategoryChart from './CategoryChart'
import RecentBooks from './RecentBooks'
import BookList from './BookList'
import BookForm from './BookForm'
import Modal from './Modal'

const VIEWS = {
  books: { title: 'All Books', subtitle: 'Every book in your library. Search by title or author.' },
  available: { title: 'Available Books', subtitle: 'Books on the shelf and ready to be issued.', status: 'Available' },
  issued: { title: 'Issued Books', subtitle: 'Books that are currently borrowed.', status: 'Issued' },
}

const EMPTY_FILTERS = { search: '', status: '', category: '' }

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function Library() {
  const { user, logout } = useAuth()
  const [view, setView] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [storage, setStorage] = useState('')

  const [allBooks, setAllBooks] = useState([])
  const [books, setBooks] = useState([])
  const [loadedKey, setLoadedKey] = useState(null)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const search = useDebounced(filters.search.trim(), 300)
  const status = VIEWS[view]?.status ?? filters.status
  const { category } = filters

  const [formState, setFormState] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)
  const searchRef = useRef(null)
  const focusSearch = useRef(false)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  useEffect(() => {
    api.health().then((h) => setStorage(h.storage)).catch(() => {})
  }, [])

  // Unfiltered list for the summary cards, chart and "recently added".
  useEffect(() => {
    let cancelled = false
    api
      .listBooks()
      .then(({ books: list }) => !cancelled && setAllBooks(list))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  // Filtered list for the table – search and filters are handled by the API.
  const queryKey = `${search}|${status}|${category}|${refreshKey}`
  const loading = loadedKey !== queryKey

  useEffect(() => {
    let cancelled = false
    api
      .listBooks({ search, status, category })
      .then(({ books: list }) => {
        if (cancelled) return
        setBooks(list)
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoadedKey(`${search}|${status}|${category}|${refreshKey}`))
    return () => {
      cancelled = true
    }
  }, [search, status, category, refreshKey])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (focusSearch.current) {
      searchRef.current?.focus()
      focusSearch.current = false
    }
  }, [view])

  const stats = useMemo(() => {
    const issued = allBooks.filter((b) => b.status === 'Issued').length
    const counts = allBooks.reduce((acc, b) => ({ ...acc, [b.category]: (acc[b.category] || 0) + 1 }), {})
    const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return {
      total: allBooks.length,
      issued,
      available: allBooks.length - issued,
      categories: Object.keys(counts).length,
      topCategory,
    }
  }, [allBooks])

  const navigate = (next) => {
    setMenuOpen(false)
    if (next === 'add') {
      setFormState({ mode: 'add' })
      return
    }
    setView(next)
    if (VIEWS[next]?.status) setFilters((f) => ({ ...f, status: '' }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openSearch = () => {
    if (searchRef.current) {
      searchRef.current.focus()
      searchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      focusSearch.current = true
      navigate('books')
    }
  }

  const showCategory = (name) => {
    setFilters({ ...EMPTY_FILTERS, category: name })
    navigate('books')
  }

  const handleSubmit = async (data) => {
    if (formState.mode === 'edit') {
      await api.updateBook(formState.book.id, data)
      setToast(`Saved “${data.title}”`)
    } else {
      await api.createBook(data)
      setToast(`Added “${data.title}” to the library`)
    }
    setFormState(null)
    refresh()
  }

  const toggleStatus = async (book) => {
    const next = book.status === 'Issued' ? 'Available' : 'Issued'
    setBusyId(book.id)
    try {
      await api.updateBook(book.id, { status: next })
      setToast(next === 'Issued' ? `“${book.title}” marked as Issued` : `“${book.title}” is Available again`)
      refresh()
    } catch (err) {
      setToast(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const confirmDelete = async () => {
    const book = pendingDelete
    try {
      await api.deleteBook(book.id)
      setToast(`Deleted “${book.title}”`)
      refresh()
    } catch (err) {
      setToast(err.message)
    } finally {
      setPendingDelete(null)
    }
  }

  const listProps = {
    books,
    loading,
    error,
    totalCount: allBooks.length,
    filters,
    onFiltersChange: setFilters,
    busyId,
    onAdd: () => setFormState({ mode: 'add' }),
    onToggle: toggleStatus,
    onEdit: (book) => setFormState({ mode: 'edit', book }),
    onDelete: setPendingDelete,
    searchRef,
  }

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={navigate} onLogout={() => logout()} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="main">
        <TopBar user={user} storage={storage} onMenu={() => setMenuOpen(true)} onSearch={openSearch} />

        {view === 'dashboard' ? (
          <>
            <Hero name={user.name} />
            <StatCards stats={stats} />
            <div className="charts-row">
              <CategoryChart books={allBooks} onSelect={showCategory} />
              <RecentBooks books={allBooks} issued={stats.issued} total={stats.total} onOpen={(book) => setFormState({ mode: 'edit', book })} />
            </div>
            <BookList {...listProps} title="Library Books" limit={6} onViewAll={() => navigate('books')} />
          </>
        ) : (
          <>
            <PageHeader title={VIEWS[view].title} subtitle={VIEWS[view].subtitle} />
            <BookList {...listProps} title={VIEWS[view].title} lockStatus={Boolean(VIEWS[view].status)} />
          </>
        )}
      </main>

      {formState && (
        <Modal title={formState.mode === 'edit' ? 'Edit Book' : 'Add a New Book'} onClose={() => setFormState(null)} size="lg">
          <BookForm
            key={formState.book?.id ?? 'new'}
            initial={formState.mode === 'edit' ? formState.book : null}
            onSubmit={handleSubmit}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete this book?" size="sm" onClose={() => setPendingDelete(null)}>
          <p className="confirm-text">“{pendingDelete.title}” by {pendingDelete.author} will be permanently removed from the library.</p>
          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setPendingDelete(null)}>Cancel</button>
            <button type="button" className="btn-danger" onClick={confirmDelete}>Delete</button>
          </div>
        </Modal>
      )}

      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  )
}
