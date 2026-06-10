import axios from 'axios'

export const TOKEN_KEY = 'tizori_token'
export const USER_KEY = 'tizori_user'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem('userId')
      localStorage.removeItem('name')
      localStorage.removeItem('email')
      localStorage.removeItem('role')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)