import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

// Temporary storage used only when MongoDB is unreachable.
// Data is kept in a JSON file so it survives server restarts on this machine.
export async function createFileStore(filePath) {
  const fullPath = path.resolve(filePath)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })

  let data = { users: [], books: [] }
  try {
    const parsed = JSON.parse(await fs.readFile(fullPath, 'utf8'))
    data = { users: parsed.users ?? [], books: parsed.books ?? [] }
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn(`Could not read ${fullPath}, starting with an empty store.`)
  }

  // Serialise writes so concurrent requests can't interleave and corrupt the file.
  let queue = Promise.resolve()
  const persist = () => {
    queue = queue.then(async () => {
      const tmp = `${fullPath}.tmp`
      await fs.writeFile(tmp, JSON.stringify(data, null, 2))
      await fs.rename(tmp, fullPath)
    })
    return queue
  }

  const now = () => new Date().toISOString()
  const publicUser = ({ passwordHash: _omit, ...user }) => user
  const clone = (v) => (v ? structuredClone(v) : null)

  return {
    mode: 'file',

    users: {
      async findByEmail(email) {
        return clone(data.users.find((u) => u.email === email))
      },
      async findById(id) {
        const user = data.users.find((u) => u.id === id)
        return user ? publicUser(clone(user)) : null
      },
      async create({ name, email, passwordHash }) {
        if (data.users.some((u) => u.email === email)) {
          const err = new Error('duplicate')
          err.code = 11000
          throw err
        }
        const user = { id: randomUUID(), name, email, passwordHash, createdAt: now(), updatedAt: now() }
        data.users.push(user)
        await persist()
        return publicUser(clone(user))
      },
    },

    books: {
      async list({ search, status, category }) {
        const q = search.toLowerCase()
        return clone(
          data.books
            .filter((b) => (!status || b.status === status) && (!category || b.category === category))
            .filter((b) => !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        )
      },
      async findById(id) {
        return clone(data.books.find((b) => b.id === id))
      },
      async create(input) {
        const book = { isbn: '', issuedTo: '', ...input, id: randomUUID(), createdAt: now(), updatedAt: now() }
        data.books.push(book)
        await persist()
        return clone(book)
      },
      async insertMany(list) {
        const base = Date.now()
        list.forEach((input, i) => {
          const stamp = new Date(base - i * 60000).toISOString()
          data.books.push({ isbn: '', issuedTo: '', ...input, id: randomUUID(), createdAt: stamp, updatedAt: stamp })
        })
        await persist()
      },
      async update(id, changes) {
        const book = data.books.find((b) => b.id === id)
        if (!book) return null
        Object.assign(book, changes, { updatedAt: now() })
        await persist()
        return clone(book)
      },
      async remove(id) {
        const index = data.books.findIndex((b) => b.id === id)
        if (index === -1) return false
        data.books.splice(index, 1)
        await persist()
        return true
      },
      async count() {
        return data.books.length
      },
    },
  }
}
