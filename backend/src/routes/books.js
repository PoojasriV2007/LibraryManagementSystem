import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { HttpError, parseBookQuery, validateBook } from '../utils/validate.js'

export default function bookRoutes(store) {
  const router = Router()
  router.use(requireAuth(store))

  // GET /api/books?search=&status=&category=
  router.get('/', async (req, res) => {
    res.json({ books: await store.books.list(parseBookQuery(req.query)) })
  })

  router.get('/:id', async (req, res) => {
    const book = await store.books.findById(req.params.id)
    if (!book) throw new HttpError(404, 'Book not found.')
    res.json({ book })
  })

  router.post('/', async (req, res) => {
    const data = validateBook(req.body)
    const book = await store.books.create({ ...data, createdBy: req.user.id })
    res.status(201).json({ book })
  })

  // Accepts a full or partial update, e.g. { status: "Issued" } to change availability.
  router.put('/:id', async (req, res) => {
    const data = validateBook(req.body, { partial: true })
    const book = await store.books.update(req.params.id, data)
    if (!book) throw new HttpError(404, 'Book not found.')
    res.json({ book })
  })

  router.delete('/:id', async (req, res) => {
    const removed = await store.books.remove(req.params.id)
    if (!removed) throw new HttpError(404, 'Book not found.')
    res.status(204).end()
  })

  return router
}
