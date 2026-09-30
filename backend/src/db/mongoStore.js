import mongoose from 'mongoose'
import User from '../models/User.js'
import Book from '../models/Book.js'
import { escapeRegex } from '../utils/validate.js'

const isValidId = (id) => mongoose.isValidObjectId(id)

const toPlain = (doc) => (doc ? doc.toJSON() : null)

export function createMongoStore() {
  return {
    mode: 'mongodb',

    users: {
      async findByEmail(email) {
        const user = await User.findOne({ email })
        return user ? { ...toPlain(user), passwordHash: user.passwordHash } : null
      },
      async findById(id) {
        if (!isValidId(id)) return null
        return toPlain(await User.findById(id))
      },
      async create(data) {
        return toPlain(await User.create(data))
      },
    },

    books: {
      async list({ search, status, category }) {
        const filter = {}
        if (status) filter.status = status
        if (category) filter.category = category
        if (search) {
          const re = new RegExp(escapeRegex(search), 'i')
          filter.$or = [{ title: re }, { author: re }]
        }
        const books = await Book.find(filter).sort({ createdAt: -1 })
        return books.map(toPlain)
      },
      async findById(id) {
        if (!isValidId(id)) return null
        return toPlain(await Book.findById(id))
      },
      async create(data) {
        return toPlain(await Book.create(data))
      },
      async insertMany(list) {
        const base = Date.now()
        await Book.insertMany(list.map((b, i) => ({ ...b, createdAt: new Date(base - i * 60000) })))
      },
      async update(id, data) {
        if (!isValidId(id)) return null
        return toPlain(await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true }))
      },
      async remove(id) {
        if (!isValidId(id)) return false
        return Boolean(await Book.findByIdAndDelete(id))
      },
      async count() {
        return Book.countDocuments()
      },
    },
  }
}
