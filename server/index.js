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

// Add default admin user
const adminPassword = bcrypt.hashSync('admin123', 10)
users.set('admin@example.com', {
  id: 'admin',
  email: 'admin@example.com',
  passwordHash: adminPassword,
  role: 'admin',
  name: 'Admin User',
  isEmailVerified: true
})

console.log('Default admin created:', users.get('admin@example.com'))

// In-memory book storage: Map<userId, Book[]>
const books = new Map()
let nextBookId = 1

// In-memory exchange requests storage
const exchangeRequests = new Map()
let nextExchangeRequestId = 1

// Add some sample books for testing
function addSampleBooks() {
  const sampleBooks = [
    { name: "The Great Gatsby", author: "F. Scott Fitzgerald", photoUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop" },
    { name: "To Kill a Mockingbird", author: "Harper Lee", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop" },
    { name: "1984", author: "George Orwell", photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop" },
    { name: "Pride and Prejudice", author: "Jane Austen", photoUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop" },
    { name: "The Catcher in the Rye", author: "J.D. Salinger", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop" },
    { name: "Lord of the Flies", author: "William Golding", photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop" },
    { name: "The Hobbit", author: "J.R.R. Tolkien", photoUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop" },
    { name: "Fahrenheit 451", author: "Ray Bradbury", photoUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop" },
    { name: "Animal Farm", author: "George Orwell", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop" },
    { name: "The Chronicles of Narnia", author: "C.S. Lewis", photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop" }
  ]
  
  // Add sample books to a demo user
  const demoUserId = "demo"
  books.set(demoUserId, sampleBooks.map(book => ({
    id: String(nextBookId++),
    ...book
  })))
}

// Initialize sample books
addSampleBooks()

// Add sample exchange request for testing
function addSampleExchangeRequest() {
  // Create a test user with books
  const testUserId = "test-user"
  const testUserBooks = [
    {
      id: "test-book-1",
      name: "1984",
      author: "George Orwell",
      photoUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      description: "A dystopian novel about totalitarianism"
    },
    {
      id: "test-book-2", 
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      description: "A classic American novel about racial injustice"
    }
  ]
  books.set(testUserId, testUserBooks)
  
  const sampleRequest = {
    id: String(nextExchangeRequestId++),
    bookId: "1", // First sample book from demo user
    bookName: "The Great Gatsby",
    bookAuthor: "F. Scott Fitzgerald",
    requesterId: testUserId,
    requesterName: "Test User",
    requesterEmail: "test@example.com",
    requesterBooks: testUserBooks,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  
  // Add to demo user's requests
  exchangeRequests.set("demo", [sampleRequest])
}

// Initialize sample exchange request
addSampleExchangeRequest()

// Helper function to get all books from all users
function getAllBooks() {
  const allBooks = []
  for (const userBooks of books.values()) {
    allBooks.push(...userBooks)
  }
  return allBooks
}

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
  const { name, email, password, isAdmin } = req.body || {}
  console.log('Register request:', { name, email, isAdmin, isAdminType: typeof isAdmin })
  console.log('Full request body:', req.body)
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const lowerEmail = String(email).toLowerCase().trim()
  if (users.has(lowerEmail)) {
    return res.status(409).json({ error: 'User already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  // Convert isAdmin to boolean - handle undefined, null, false, 'false', true, 'true'
  // Only set admin if explicitly true
  const isAdminBool = isAdmin === true || isAdmin === 'true' || isAdmin === 1 || isAdmin === '1'
  const role = isAdminBool ? 'admin' : 'user'
  console.log('Setting role:', role, 'for isAdmin:', isAdmin, 'converted to:', isAdminBool)
  console.log('isAdmin comparison results:', {
    'isAdmin === true': isAdmin === true,
    'isAdmin === "true"': isAdmin === 'true',
    'isAdmin === 1': isAdmin === 1,
    'isAdmin === "1"': isAdmin === '1',
    'final isAdminBool': isAdminBool
  })
  const user = {
    id: String(nextUserId++),
    email: lowerEmail,
    passwordHash,
    name: name || email.split('@')[0], // Default name if not provided
    role: role,
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
  console.log('Login successful for user:', { id: user.id, email: user.email, role: user.role, name: user.name })
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
  const { name, author, photoUrl, description } = req.body

  if (!name || !author) {
    return res.status(400).json({ error: 'Book name and author are required' })
  }

  const newBook = {
    id: String(nextBookId++),
    name,
    author,
    photoUrl: photoUrl || null,
    description: description || null,
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

// Public Books - List with search, sorting, and pagination
app.get('/api/books', (req, res) => {
  const { search, sort = 'name', page = 1, limit = 10 } = req.query
  
  let allBooks = getAllBooks()
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    allBooks = allBooks.filter(book => 
      book.name.toLowerCase().includes(searchLower) || 
      book.author.toLowerCase().includes(searchLower)
    )
  }
  
  // Apply sorting
  if (sort === 'name') {
    allBooks.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'author') {
    allBooks.sort((a, b) => a.author.localeCompare(b.author))
  }
  
  // Apply pagination
  const pageNum = parseInt(page)
  const limitNum = parseInt(limit)
  const startIndex = (pageNum - 1) * limitNum
  const endIndex = startIndex + limitNum
  
  const paginatedBooks = allBooks.slice(startIndex, endIndex)
  const totalBooks = allBooks.length
  const totalPages = Math.ceil(totalBooks / limitNum)
  
  res.json({
    books: paginatedBooks,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalBooks,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  })
})

// Public Books - Get single book details
app.get('/api/books/:bookId', (req, res) => {
  const { bookId } = req.params
  const allBooks = getAllBooks()
  const book = allBooks.find(b => b.id === bookId)
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }
  
  // Find the book owner
  let bookOwnerId = null
  for (const [userId, userBooks] of books.entries()) {
    if (userBooks.some(b => b.id === bookId)) {
      bookOwnerId = userId
      break
    }
  }
  
  // Get book owner info
  let bookOwner = null
  if (bookOwnerId) {
    for (const [email, user] of users.entries()) {
      if (user.id === bookOwnerId) {
        bookOwner = { id: user.id, name: user.name, email: user.email }
        break
      }
    }
  }
  
  res.json({ 
    book: {
      ...book,
      owner: bookOwner
    }
  })
})

// Get books by user ID (for testing purposes)
app.get('/api/users/:userId/books', (req, res) => {
  const { userId } = req.params
  const userBooks = books.get(userId) || []
  
  res.json({ 
    userId,
    books: userBooks,
    count: userBooks.length 
  })
})

// Exchange Request - Send exchange request
app.post('/api/books/exchange-request', authMiddleware, (req, res) => {
  const { bookId, requesterName, requesterEmail, requesterBooks } = req.body
  const requesterId = req.user.sub
  
  // Validate required fields
  if (!bookId || !requesterName || !requesterEmail || !requesterBooks) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  
  // Find the book and its owner
  const allBooks = getAllBooks()
  const book = allBooks.find(b => b.id === bookId)
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' })
  }
  
  // Find the book owner
  let bookOwnerId = null
  for (const [userId, userBooks] of books.entries()) {
    if (userBooks.some(b => b.id === bookId)) {
      bookOwnerId = userId
      break
    }
  }
  
  if (!bookOwnerId) {
    return res.status(404).json({ error: 'Book owner not found' })
  }
  
  // Check if user is trying to request their own book
  if (bookOwnerId === requesterId) {
    return res.status(400).json({ error: 'Cannot request exchange for your own book' })
  }
  
  // Get book owner by finding user with matching ID
  let bookOwner = null
  for (const [email, user] of users.entries()) {
    if (user.id === bookOwnerId) {
      bookOwner = user
      break
    }
  }
  
  if (!bookOwner) {
    return res.status(404).json({ error: 'Book owner not found' })
  }
  
  // Create exchange request
  const exchangeRequest = {
    id: String(nextExchangeRequestId++),
    bookId: book.id,
    bookName: book.name,
    bookAuthor: book.author,
    requesterId: requesterId,
    requesterName: requesterName,
    requesterEmail: requesterEmail,
    requesterBooks: requesterBooks,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  
  // Store exchange request
  if (!exchangeRequests.has(bookOwnerId)) {
    exchangeRequests.set(bookOwnerId, [])
  }
  exchangeRequests.get(bookOwnerId).push(exchangeRequest)
  
  // Simulate email sending (in real app, you'd use a service like SendGrid, Nodemailer, etc.)
  console.log('=== EXCHANGE REQUEST EMAIL ===')
  console.log(`To: ${bookOwner.email}`)
  console.log(`From: ${requesterEmail}`)
  console.log(`Subject: Book Exchange Request for "${book.name}"`)
  console.log('')
  console.log(`Hello ${bookOwner.name},`)
  console.log('')
  console.log(`${requesterName} (${requesterEmail}) is interested in exchanging books with you!`)
  console.log('')
  console.log(`They want your book: "${book.name}" by ${book.author}`)
  console.log('')
  console.log('They are offering the following books for exchange:')
  requesterBooks.forEach((book, index) => {
    console.log(`${index + 1}. "${book.name}" by ${book.author}`)
  })
  console.log('')
  console.log('Please check your Exchange tab to accept or reject this request.')
  console.log('')
  console.log('Best regards,')
  console.log('Book Sharing Service')
  console.log('===============================')
  
  res.json({ 
    success: true, 
    message: 'Exchange request sent successfully! The book owner has been notified.' 
  })
})

// Get exchange requests for current user
app.get('/api/exchange/requests', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const userRequests = exchangeRequests.get(userId) || []
  
  // Sort by creation date (newest first)
  userRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  console.log(`Fetching exchange requests for user ${userId}:`, userRequests.length, 'requests')
  
  res.json({ requests: userRequests })
})

// Accept exchange request
app.post('/api/exchange/requests/:requestId/accept', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const { requestId } = req.params
  
  const userRequests = exchangeRequests.get(userId) || []
  const request = userRequests.find(r => r.id === requestId)
  
  if (!request) {
    return res.status(404).json({ error: 'Exchange request not found' })
  }
  
  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'Request is not pending' })
  }
  
  try {
    // Perform the actual book exchange
    performBookExchange(userId, request)
    
    // Update request status
    request.status = 'completed'
    
    console.log('=== EXCHANGE COMPLETED ===')
    console.log(`User ${userId} accepted exchange request ${requestId}`)
    console.log(`Book "${request.bookName}" exchanged for books from ${request.requesterName}`)
    console.log('==========================')
    
    res.json({ 
      success: true, 
      message: 'Exchange completed successfully! Books have been exchanged between users.' 
    })
  } catch (error) {
    console.error('Error during book exchange:', error)
    res.status(500).json({ error: 'Failed to complete exchange' })
  }
})

// Function to perform the actual book exchange
function performBookExchange(bookOwnerId, request) {
  // Get the book owner's books
  const ownerBooks = books.get(bookOwnerId) || []
  
  // Find the book being exchanged
  const bookToExchange = ownerBooks.find(book => book.id === request.bookId)
  if (!bookToExchange) {
    throw new Error('Book to exchange not found')
  }
  
  // Get the requester's books
  const requesterBooks = books.get(request.requesterId) || []
  
  // Remove the book from owner's collection
  const updatedOwnerBooks = ownerBooks.filter(book => book.id !== request.bookId)
  books.set(bookOwnerId, updatedOwnerBooks)
  
  // Add the book to requester's collection
  const bookForRequester = {
    ...bookToExchange,
    id: `exchanged-${Date.now()}-${bookToExchange.id}` // New ID to avoid conflicts
  }
  requesterBooks.push(bookForRequester)
  books.set(request.requesterId, requesterBooks)
  
  // For each book offered by requester, add it to owner's collection
  request.requesterBooks.forEach(requesterBook => {
    const bookForOwner = {
      ...requesterBook,
      id: `exchanged-${Date.now()}-${requesterBook.id}` // New ID to avoid conflicts
    }
    updatedOwnerBooks.push(bookForOwner)
  })
  books.set(bookOwnerId, updatedOwnerBooks)
  
  console.log(`Exchanged book "${request.bookName}" from user ${bookOwnerId} to user ${request.requesterId}`)
  console.log(`Added ${request.requesterBooks.length} books from user ${request.requesterId} to user ${bookOwnerId}`)
}

// Reject exchange request
app.post('/api/exchange/requests/:requestId/reject', authMiddleware, (req, res) => {
  const userId = req.user.sub
  const { requestId } = req.params
  
  const userRequests = exchangeRequests.get(userId) || []
  const request = userRequests.find(r => r.id === requestId)
  
  if (!request) {
    return res.status(404).json({ error: 'Exchange request not found' })
  }
  
  if (request.status !== 'pending') {
    return res.status(400).json({ error: 'Request is not pending' })
  }
  
  // Update request status
  request.status = 'rejected'
  
  console.log('=== EXCHANGE REJECTED ===')
  console.log(`User ${userId} rejected exchange request ${requestId}`)
  console.log('=========================')
  
  res.json({ 
    success: true, 
    message: 'Exchange request rejected.' 
  })
})

// Admin middleware
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Admin - Get all users
app.get('/api/admin/users', authMiddleware, adminMiddleware, (req, res) => {
  const allUsers = Array.from(users.values()).map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  }))
  res.json({ users: allUsers })
})

// Admin - Get all books
app.get('/api/admin/books', authMiddleware, adminMiddleware, (req, res) => {
  const allBooks = []
  for (const [userId, userBooks] of books.entries()) {
    const user = Array.from(users.values()).find(u => u.id === userId)
    userBooks.forEach(book => {
      allBooks.push({
        ...book,
        ownerId: userId,
        ownerName: user ? user.name : 'Unknown',
        ownerEmail: user ? user.email : 'Unknown'
      })
    })
  }
  res.json({ books: allBooks })
})

// Admin - Delete any book
app.delete('/api/admin/books/:bookId', authMiddleware, adminMiddleware, (req, res) => {
  const { bookId } = req.params
  
  // Find and remove the book
  let bookFound = false
  for (const [userId, userBooks] of books.entries()) {
    const bookIndex = userBooks.findIndex(book => book.id === bookId)
    if (bookIndex !== -1) {
      userBooks.splice(bookIndex, 1)
      bookFound = true
      break
    }
  }
  
  if (!bookFound) {
    return res.status(404).json({ error: 'Book not found' })
  }
  
  res.json({ success: true, message: 'Book deleted successfully' })
})

// Admin - Delete user
app.delete('/api/admin/users/:userId', authMiddleware, adminMiddleware, (req, res) => {
  const { userId } = req.params
  
  // Find user by ID
  let userToDelete = null
  for (const [email, user] of users.entries()) {
    if (user.id === userId) {
      userToDelete = { email, user }
      break
    }
  }
  
  if (!userToDelete) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  // Prevent admin from deleting themselves
  if (userId === req.user.sub) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }
  
  // Remove user and their books
  users.delete(userToDelete.email)
  books.delete(userId)
  exchangeRequests.delete(userId)
  
  res.json({ success: true, message: 'User deleted successfully' })
})

// Admin - Update user role
app.put('/api/admin/users/:userId/role', authMiddleware, adminMiddleware, (req, res) => {
  const { userId } = req.params
  const { role } = req.body
  
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin or user' })
  }
  
  // Find user by ID
  let userToUpdate = null
  for (const [email, user] of users.entries()) {
    if (user.id === userId) {
      userToUpdate = { email, user }
      break
    }
  }
  
  if (!userToUpdate) {
    return res.status(404).json({ error: 'User not found' })
  }
  
  // Prevent admin from changing their own role
  if (userId === req.user.sub) {
    return res.status(400).json({ error: 'Cannot change your own role' })
  }
  
  // Update role
  userToUpdate.user.role = role
  users.set(userToUpdate.email, userToUpdate.user)
  
  res.json({ 
    success: true, 
    message: 'User role updated successfully',
    user: {
      id: userToUpdate.user.id,
      email: userToUpdate.user.email,
      name: userToUpdate.user.name,
      role: userToUpdate.user.role
    }
  })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`)
})


