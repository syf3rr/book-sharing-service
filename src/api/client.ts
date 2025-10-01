export type AuthResponse = {
  token: string
  user: { id: string; email: string; role: string; name: string }
}

const defaultHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
})

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await parseJsonSafe<{ error?: string }>(res)
    if (data && data.error) return data.error
    const text = await res.text()
    return text || fallback
  } catch {
    return fallback
  }
}

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res, 'Registration failed'))
    const data = await parseJsonSafe<AuthResponse>(res)
    if (!data) throw new Error('Registration failed: empty response')
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check if the server is running')
    }
    throw error
  }
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(await readErrorMessage(res, 'Login failed'))
    const data = await parseJsonSafe<AuthResponse>(res)
    if (!data) throw new Error('Login failed: empty response')
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check if the server is running')
    }
    throw error
  }
}

export async function apiMe(token: string): Promise<{ user: { id: string; email: string; role: string; name: string } }> {
  const res = await fetch('/api/me', {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Unauthorized'))
  const data = await parseJsonSafe<{ user: { id: string; email: string; role: string; name: string } }>(res)
  if (!data) throw new Error('Unauthorized: empty response')
  return data
}

export type Book = {
  id: string
  name: string
  author: string
  photoUrl: string | null
}

export async function apiGetMyBooks(token: string): Promise<{ books: Book[] }> {
  const res = await fetch('/api/me/books', {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to fetch books'))
  const data = await parseJsonSafe<{ books: Book[] }>(res)
  if (!data) throw new Error('Failed to fetch books: empty response')
  return data
}

export async function apiAddBook(token: string, book: { name: string; author: string; photoUrl?: string }): Promise<{ book: Book }> {
  const res = await fetch('/api/me/books', {
    method: 'POST',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(book),
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to add book'))
  const data = await parseJsonSafe<{ book: Book }>(res)
  if (!data) throw new Error('Failed to add book: empty response')
  return data
}

export async function apiDeleteBook(token: string, bookId: string): Promise<void> {
  const res = await fetch(`/api/me/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, 'Failed to delete book'))
}


