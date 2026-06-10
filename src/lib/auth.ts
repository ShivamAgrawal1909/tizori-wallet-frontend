import { api, TOKEN_KEY, USER_KEY } from './api'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

function normalizeRole(role: unknown): 'USER' | 'ADMIN' {
  return role === 'ADMIN' ? 'ADMIN' : 'USER'
}

function normalizeUser(data: any): AuthUser {
  return {
    id: String(data.userId ?? data.id ?? ''),
    fullName: data.name ?? data.fullName ?? '',
    email: data.email ?? '',
    role: normalizeRole(data.role),
  }
}

function saveAuthData(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))

  localStorage.setItem('userId', user.id)
  localStorage.setItem('name', user.fullName)
  localStorage.setItem('email', user.email)
  localStorage.setItem('role', user.role)
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post('/api/users/login', payload)

  const token = data.token
  const user = normalizeUser(data)

  saveAuthData(token, user)

  return { token, user }
}

export async function register(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  await api.post('/api/users/register', {
    name: payload.fullName,
    email: payload.email,
    password: payload.password,
  })

  return login({
    email: payload.email,
    password: payload.password,
  })
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    return null
  }
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  localStorage.removeItem('userId')
  localStorage.removeItem('name')
  localStorage.removeItem('email')
  localStorage.removeItem('role')
}

export function clearToken() {
  clearAuthData()
}