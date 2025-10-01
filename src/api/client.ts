export type AuthResponse = {
  token: string
  user: { id: string; email: string; role: string; name: string }
}

const defaultHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
})

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Registration failed')
  return res.json()
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Login failed')
  return res.json()
}

export async function apiMe(token: string): Promise<{ user: { id: string; email: string; role: string; name: string } }> {
  const res = await fetch('/api/me', {
    headers: {
      ...defaultHeaders(),
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error((await res.json()).error || 'Unauthorized')
  return res.json()
}


