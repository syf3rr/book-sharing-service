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

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
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
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const lowerEmail = String(email).toLowerCase().trim()
  const user = users.get(lowerEmail)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = generateToken({ sub: user.id, role: user.role, email: user.email, name: user.name })
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } })
})

// Example protected route
app.get('/api/me', (req, res) => {
  const auth = req.header('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Missing token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    res.json({ user: { id: payload.sub, email: payload.email, role: payload.role, name: payload.name } })
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`)
})


