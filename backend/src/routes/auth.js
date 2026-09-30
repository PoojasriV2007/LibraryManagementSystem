import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { requireAuth, signToken } from '../middleware/auth.js'
import { HttpError, validateLogin, validateSignup } from '../utils/validate.js'

export default function authRoutes(store) {
  const router = Router()

  router.post('/signup', async (req, res) => {
    const { name, email, password } = validateSignup(req.body)
    if (await store.users.findByEmail(email)) {
      throw new HttpError(409, 'An account with this email already exists.', { email: 'Email is already registered.' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    let user
    try {
      user = await store.users.create({ name, email, passwordHash })
    } catch (err) {
      if (err.code === 11000) throw new HttpError(409, 'An account with this email already exists.')
      throw err
    }
    res.status(201).json({ token: signToken(user), user })
  })

  router.post('/login', async (req, res) => {
    const { email, password } = validateLogin(req.body)
    const record = await store.users.findByEmail(email)
    const ok = record && (await bcrypt.compare(password, record.passwordHash))
    if (!ok) throw new HttpError(401, 'Incorrect email or password.')
    const { passwordHash: _omit, ...user } = record
    res.json({ token: signToken(user), user })
  })

  router.get('/me', requireAuth(store), (req, res) => {
    res.json({ user: req.user })
  })

  return router
}
