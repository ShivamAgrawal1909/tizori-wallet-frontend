import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Receipt, Shield, Users, Wallet } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  getAdminDashboardStats,
  getAllTransactions,
  getAllUsers,
  type AdminDashboardStats,
  type AdminTransaction,
  type AdminUser,
} from '../lib/admin'
import { formatCurrency, formatDateTime } from '../lib/utils'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'ADMIN'

  const userMap = useMemo(() => {
    return users.reduce<Record<string, AdminUser>>((map, item) => {
      map[String(item.id)] = item
      return map
    }, {})
  }, [users])

  function getUserDisplay(userId?: number | string | null) {
    if (userId === null || userId === undefined) return null

    const item = userMap[String(userId)]

    if (!item) {
      return {
        name: 'Unknown User',
        email: 'User details unavailable',
      }
    }

    return {
      name: item.name || 'Unnamed User',
      email: item.email || 'Email unavailable',
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false)
      return
    }

    let active = true

    async function loadAdminData() {
      try {
        const [statsData, usersData, transactionsData] = await Promise.all([
          getAdminDashboardStats(),
          getAllUsers(),
          getAllTransactions(),
        ])

        if (!active) return

        setStats(statsData)
        setUsers(usersData)
        setTransactions(transactionsData.slice(0, 8))
      } catch (error) {
        console.error(error)

        if (active) {
          toast('Failed to load admin dashboard.', 'error')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadAdminData()

    return () => {
      active = false
    }
  }, [isAdmin, toast])

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Access denied</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                This dashboard is available only for admin users.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="animate-in">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            <Shield className="h-3.5 w-3.5" />
            Admin Panel
          </p>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor users, wallets and platform transactions.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Users"
            value={String(stats?.totalUsers ?? 0)}
            icon={Users}
            accent="primary"
            loading={loading}
          />

          <StatCard
            label="Total Wallets"
            value={String(stats?.totalWallets ?? 0)}
            icon={Wallet}
            accent="success"
            loading={loading}
          />

          <StatCard
            label="Total Transactions"
            value={String(stats?.totalTransactions ?? 0)}
            icon={Receipt}
            accent="muted"
            loading={loading}
          />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Users
          </h2>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {loading ? (
              <TableLoading />
            ) : users.length === 0 ? (
              <EmptyMessage message="No users found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-semibold">Name</th>
                      <th className="px-5 py-3 font-semibold">Email</th>
                      <th className="px-5 py-3 font-semibold">Role</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {users.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/40">
                        <td className="px-5 py-4 font-semibold">{item.name}</td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {item.email}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                            {item.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Recent Platform Transactions
          </h2>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {loading ? (
              <TableLoading />
            ) : transactions.length === 0 ? (
              <EmptyMessage message="No transactions found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-semibold">Type</th>
                      <th className="px-5 py-3 font-semibold">From</th>
                      <th className="px-5 py-3 font-semibold">To</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {transactions.map((tx) => {
                      const fromUser = getUserDisplay(tx.fromUserId)
                      const toUser = getUserDisplay(tx.toUserId)

                      return (
                        <tr key={tx.id} className="hover:bg-muted/40">
                          <td className="px-5 py-4 font-semibold">
                            {formatTransactionType(tx.type)}
                          </td>

                          <td className="px-5 py-4">
                            {fromUser ? (
                              <UserCell name={fromUser.name} email={fromUser.email} />
                            ) : (
                              <span className="text-muted-foreground">
                                Wallet Top-up
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {toUser ? (
                              <UserCell name={toUser.name} email={toUser.email} />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-muted-foreground">
                            {formatDateTime(tx.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-right font-bold">
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}

function UserCell({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{email}</p>
    </div>
  )
}

function formatTransactionType(type: string) {
  if (type === 'ADD_MONEY') return 'Add Money'
  if (type === 'TRANSFER') return 'Transfer'
  return type
}

function TableLoading() {
  return (
    <div className="space-y-3 p-5">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-10 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}

function EmptyMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center px-6 py-12 text-sm text-muted-foreground">
      {message}
    </div>
  )
}