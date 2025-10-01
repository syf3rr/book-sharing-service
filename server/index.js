import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: CORS_ORIGIN, credentials: true }))
app.use(express.json())

// In-memory user storage for MVP
// Structure: { id, email, passwordHash, role, isEmailVerified }
const users = new Map()
let nextUserId = 1

// In-memory book storage: Map<userId, Book[]>
const books = new Map()
let nextBookId = 1

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const auth = req.header('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload // Attach user payload to request
    next()
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const lowerEmail = String(email).toLowerCase().trim()
  if (users.has(lowerEmail)) {
    return res.status(409).json({ error: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = {
    id: String(nextUserId++),
    email: lowerEmail,
    passwordHash,
    name: name || email.split('@')[0], // Default name if not provided
    role: 'User',
    isEmailVerified: false,
  }
  users.set(lowerEmail, user)

  const token = generateToken({ sub: user.id, role: user.role, email: user.email, name: user.name })
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
})

// Login
app.post('/api/login', async (req, res) => {
  console.log('Login attempt for email:', req.body.email) // Added log
  const { email, password } = req.body || {}
  if (!email || !password) {
    console.log('Login failed: Missing email or password') // Added log
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const lowerEmail = String(email).toLowerCase().trim()
  const user = users.get(lowerEmail)
  if (!user) {
    console.log('Login failed: User not found for email:', lowerEmail) // Added log
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    console.log('Login failed: Invalid password for email:', lowerEmail) // Added log
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = generateToken({ sub: user.id, role: user.role, email: user.email, name: user.name })
  console.log('Login successful for email:', lowerEmail) // Added log
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
})

// Example protected route
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.sub, email: req.user.email, role: req.user.role, name: req.user.name } })
})

// My Books - List
app.get('/api/me/books', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const userBooks = books.get(userId) || []
  res.json({ books: userBooks })
})

// My Books - Add
app.post('/api/me/books', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const { name, author, photoUrl } = req.body

  if (!name || !author) {
    return res.status(400).json({ error: 'Book name and author are required' })
  }

  const newBook = {
    id: String(nextBookId++),
    name,
    author,
    photoUrl: photoUrl || null,
  }

  if (!books.has(userId)) {
    books.set(userId, [])
  }
  books.get(userId).push(newBook)
  res.status(201).json({ book: newBook })
})

// My Books - Delete
app.delete('/api/me/books/:bookId', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const { bookId } = req.params

  let userBooks = books.get(userId) || []
  const initialLength = userBooks.length
  userBooks = userBooks.filter(book => book.id !== bookId)
  books.set(userId, userBooks)

  if (userBooks.length < initialLength) {
    res.status(204).send() // No Content
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`)
})


