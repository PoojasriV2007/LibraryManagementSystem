import jwt from 'jsonwebtoken'
import config from '../config.js'
import { HttpError } from '../utils/validate.js'

export const signToken = (user) =>
  jwt.sign({ sub: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn })

export const requireAuth = (store) => async (req, _res, next) => {
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw new HttpError(401, 'Please log in to continue.')

  let payload
  try {
    payload = jwt.verify(token, config.jwtSecret)
  } catch {
    throw new HttpError(401, 'Your session has expired. Please log in again.')
  }

  const user = await store.users.findById(payload.sub)
  if (!user) throw new HttpError(401, 'Account not found. Please log in again.')
  req.user = user
  next()
}
