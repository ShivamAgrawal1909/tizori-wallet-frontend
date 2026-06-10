import { api } from './api'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  balance?: number
}

export interface AdminTransaction {
  id: number
  fromUserId: number | null
  toUserId: number | null
  amount: number
  type: string
  status: string
  createdAt: string
}

export interface AdminDashboardStats {
  totalUsers: number
  totalWallets: number
  totalTransactions: number
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await api.get<AdminDashboardStats>('/api/admin/dashboard')
  return data
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/api/admin/users')
  return Array.isArray(data) ? data : []
}

export async function getAllTransactions(): Promise<AdminTransaction[]> {
  const { data } = await api.get<AdminTransaction[]>('/api/admin/transactions')
  return Array.isArray(data) ? data : []
}