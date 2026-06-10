import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  PlusCircle,
  Send,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  getTransactions,
  getWalletSummary,
  type Transaction,
  type WalletSummary,
} from '../lib/wallet'
import { formatCurrency, formatDateTime } from '../lib/utils'

const quickActions = [
  {
    to: '/send',
    icon: Send,
    title: 'Send Money',
    desc: 'Transfer funds instantly',
  },
  {
    to: '/add-money',
    icon: PlusCircle,
    title: 'Add Money',
    desc: 'Top up with Razorpay',
  },
  {
    to: '/transactions',
    icon: ArrowLeftRight,
    title: 'Transactions',
    desc: 'Review all your activity',
  },
  {
    to: '/profile',
    icon: User,
    title: 'Profile',
    desc: 'Manage your account',
  },
]

function toTitleCase(name?: string) {
  if (!name) return 'there'

  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [summary, setSummary] = useState<WalletSummary | null>(null)
  const [recent, setRecent] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [s, txns] = await Promise.all([
          getWalletSummary(),
          getTransactions(),
        ])

        if (!active) return

        setSummary(s)
        setRecent(txns.slice(0, 5))
      } catch {
        if (active) toast('Could not load wallet data.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [toast])

  const firstName = toTitleCase(user?.fullName).split(' ')[0]

  return (
    <AppLayout>
      <div className="animate-in space-y-6">
        <section className="mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Here&apos;s your account overview.
          </p>
        </section>

        <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-2xl shadow-primary/25 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white/80">
                Wallet balance
              </p>

              {loading ? (
                <div className="mt-3 h-12 w-52 animate-pulse rounded-xl bg-white/20" />
              ) : (
                <p className="mt-2 text-5xl font-extrabold tracking-tight">
                  {formatCurrency(summary?.balance ?? 0)}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/send"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-extrabold backdrop-blur transition-colors hover:bg-white/25"
              >
                <Send className="h-4 w-4" />
                Send Money
              </Link>

              <Link
                to="/add-money"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-primary shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <PlusCircle className="h-4 w-4" />
                Add Money
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatCard
            label="Total Money Sent"
            value={formatCurrency(summary?.totalSent ?? 0)}
            icon={TrendingUp}
            accent="primary"
            loading={loading}
          />
          <StatCard
            label="Total Money Received"
            value={formatCurrency(summary?.totalReceived ?? 0)}
            icon={TrendingDown}
            accent="success"
            loading={loading}
          />
          <StatCard
            label="Total Transactions"
            value={String(summary?.totalTransactions ?? 0)}
            icon={Wallet}
            accent="muted"
            loading={loading}
          />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-500">
            Quick actions
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={title}
                to={to}
                className="group flex items-center gap-4 rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20">
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-slate-950">
                    {title}
                  </p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {desc}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
              Recent activity
            </h2>

            <Link
              to="/transactions"
              className="text-sm font-extrabold text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <ul className="divide-y divide-slate-200/80 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-4">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
                </li>
              ))}
            </ul>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <ArrowLeftRight className="h-9 w-9 text-slate-400" />
              <p className="mt-3 text-sm font-extrabold text-slate-950">
                No transactions yet
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Your recent activity will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200/80 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm">
              {recent.map((tx) => {
                const incoming = tx.type === 'received'
                const name = incoming ? tx.sender : tx.receiver

                return (
                  <li key={tx.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={cnTxIcon(incoming)}>
                      {incoming ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-extrabold text-slate-950">
                        {name || 'Wallet transaction'}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {formatDateTime(tx.date)}
                      </p>
                    </div>

                    <span
                      className={
                        'shrink-0 text-sm font-extrabold ' +
                        (incoming
                          ? 'text-[color:var(--color-success)]'
                          : 'text-slate-950')
                      }
                    >
                      {incoming ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

function cnTxIcon(incoming: boolean): string {
  return (
    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full ' +
    (incoming
      ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]'
      : 'bg-slate-100 text-slate-500')
  )
}