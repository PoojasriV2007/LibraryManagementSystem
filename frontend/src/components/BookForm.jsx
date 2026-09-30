import { useState } from 'react'
import { BookCheck, BookUp, TriangleAlert } from 'lucide-react'
import BookCover from './BookCover'
import { CATEGORIES } from '../utils/constants'

const EMPTY = { title: '', author: '', category: 'Fiction', status: 'Available', isbn: '', issuedTo: '' }

const cleanIsbn = (v) => v.replace(/[-\s]/g, '').toUpperCase()

const validate = (v) => {
  const errors = {}
  if (!v.title.trim()) errors.title = 'Please enter the book title.'
  if (!v.author.trim()) errors.author = 'Please enter the author.'
  const isbn = cleanIsbn(v.isbn)
  if (isbn && !/^(\d{9}[\dX]|\d{13})$/.test(isbn)) errors.isbn = 'ISBN must be 10 or 13 digits.'
  return errors
}

export default function BookForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => (initial ? { ...EMPTY, ...initial } : EMPTY))
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }
  const onInput = (field) => (e) => update(field, e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }
    setSaving(true)
    setServerError('')
    try {
      await onSubmit({
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category,
        status: values.status,
        isbn: cleanIsbn(values.isbn),
        issuedTo: values.status === 'Issued' ? values.issuedTo.trim() : '',
      })
    } catch (err) {
      setServerError(err.message)
      if (err.errors) setErrors(err.errors)
      setSaving(false)
    }
  }

  const isbnPreview = cleanIsbn(values.isbn)
  const previewBook = { ...values, isbn: /^(\d{9}[\dX]|\d{13})$/.test(isbnPreview) ? isbnPreview : '' }

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      {serverError && <div className="alert" role="alert"><TriangleAlert size={18} /> {serverError}</div>}

      <div className="form-top">
        <div className="form-cover"><BookCover key={previewBook.isbn} book={previewBook} size="lg" /></div>
        <div className="form-fields">
          <div className="field">
            <label htmlFor="book-title">Title</label>
            <input id="book-title" name="title" className={`field-input${errors.title ? ' invalid' : ''}`} placeholder="e.g. Atomic Habits" value={values.title} onChange={onInput('title')} maxLength={150} aria-invalid={Boolean(errors.title)} />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>
          <div className="field">
            <label htmlFor="book-author">Author</label>
            <input id="book-author" name="author" className={`field-input${errors.author ? ' invalid' : ''}`} placeholder="e.g. James Clear" value={values.author} onChange={onInput('author')} maxLength={100} aria-invalid={Boolean(errors.author)} />
            {errors.author && <p className="field-error">{errors.author}</p>}
          </div>
          <div className="field">
            <label htmlFor="book-isbn">ISBN <span className="muted">(optional – shows the cover)</span></label>
            <input id="book-isbn" name="isbn" className={`field-input${errors.isbn ? ' invalid' : ''}`} placeholder="e.g. 9780735211292" value={values.isbn} onChange={onInput('isbn')} maxLength={20} inputMode="numeric" aria-invalid={Boolean(errors.isbn)} />
            {errors.isbn && <p className="field-error">{errors.isbn}</p>}
          </div>
        </div>
      </div>

      <fieldset className="field">
        <legend>Category</legend>
        <div className="category-picker">
          {CATEGORIES.map(({ name, icon: Icon, bg, ink }) => (
            <label key={name} className={`category-option${values.category === name ? ' selected' : ''}`} style={{ '--cat-bg': bg, '--cat-ink': ink }}>
              <input type="radio" name="category" value={name} checked={values.category === name} onChange={onInput('category')} />
              <Icon size={17} strokeWidth={2.2} />
              {name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>Availability</legend>
        <div className="status-toggle">
          <label className={`status-option available${values.status === 'Available' ? ' selected' : ''}`}>
            <input type="radio" name="status" value="Available" checked={values.status === 'Available'} onChange={onInput('status')} />
            <BookCheck size={18} /> Available
          </label>
          <label className={`status-option issued${values.status === 'Issued' ? ' selected' : ''}`}>
            <input type="radio" name="status" value="Issued" checked={values.status === 'Issued'} onChange={onInput('status')} />
            <BookUp size={18} /> Issued
          </label>
        </div>
      </fieldset>

      {values.status === 'Issued' && (
        <div className="field">
          <label htmlFor="book-issued-to">Issued to <span className="muted">(optional)</span></label>
          <input id="book-issued-to" name="issuedTo" className="field-input" placeholder="e.g. Priya Sharma" value={values.issuedTo} onChange={onInput('issuedTo')} maxLength={80} />
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-gradient" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  )
}
