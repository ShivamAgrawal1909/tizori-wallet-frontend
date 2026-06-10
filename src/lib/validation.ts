export interface FieldErrors {
  [field: string]: string | undefined
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required'
  if (!EMAIL_RE.test(email)) return 'Enter a valid email address'
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
    return 'Use both letters and numbers'
  return undefined
}

export function validateFullName(name: string): string | undefined {
  if (!name.trim()) return 'Full name is required'
  if (name.trim().length < 2) return 'Name is too short'
  return undefined
}

export function validateConfirm(
  password: string,
  confirm: string,
): string | undefined {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return undefined
}
