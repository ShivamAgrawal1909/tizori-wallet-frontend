import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Search,
  Send,
  SlidersHorizontal,
} from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { StatusBadge } from '../components/StatusBadge'
import { useToast } from '../context/ToastContext'
import { getTransactions, type Transaction } from '../lib/wallet'
import { cn, formatCurrency, formatDate } from '../lib/utils'

type FilterType = 'all' | 'sent' | 'received'

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' },
]

export default function TransactionsPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getTransactions()
        if (active) setTransactions(data)
      } catch {
        if (active) toast('Could not load transactions.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [toast])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((tx) => {
      if (filter !== 'all' && tx.type !== filter) return false
      if (!q) return true
      return (
        tx.sender.toLowerCase().includes(q) ||
        tx.receiver.toLowerCase().includes(q) ||
        tx.note?.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q)
      )
    })
  }, [transactions, filter, query])

  return (
    <AppLayout>
      <div className="animate-in">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Transactions</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Search and review all your account activity.
            </p>
          </div>
          <Link
            to="/send"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-110"
          >
            <Send className="h-4 w-4" />
            Send Money
          </Link>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, note or ID"
              className="w-full rounded-xl border border-border bg-card py-3 pl-10.5 pr-4 text-sm transition-colors placeholder:text-muted-foreground/70 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div
            className="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
            role="group"
            aria-label="Filter by type"
          >
            <SlidersHorizontal className="ml-2 hidden h-4 w-4 text-muted-foreground sm:block" />
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
                  filter === f.value
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {loading ? (
            <TableSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState hasQuery={Boolean(query) || filter !== 'all'} />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-5 py-3 font-semibold">Type</th>
                      <th className="px-5 py-3 font-semibold">Sender</th>
                      <th className="px-5 py-3 font-semibold">Receiver</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((tx) => {
                      const incoming = tx.type === 'received'
                      return (
                        <tr key={tx.id} className="transition-colors hover:bg-muted/40">
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 font-medium capitalize">
                              <span className={iconClass(incoming)}>
                                {incoming ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </span>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">{tx.sender}</td>
                          <td className="px-5 py-4 text-muted-foreground">{tx.receiver}</td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {formatDate(tx.date)}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={tx.status} />
                          </td>
                          <td
                            className={cn(
                              'px-5 py-4 text-right font-bold',
                              incoming
                                ? 'text-[color:var(--color-success)]'
                                : 'text-foreground',
                            )}
                          >
                            {incoming ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="divide-y divide-border md:hidden">
                {filtered.map((tx) => {
                  const incoming = tx.type === 'received'
                  return (
                    <li key={tx.id} className="flex items-start gap-3 px-4 py-4">
                      <span className={iconClass(incoming)}>
                        {incoming ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {incoming ? tx.sender : tx.receiver}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                        <div className="mt-1.5">
                          <StatusBadge status={tx.status} />
                        </div>
                      </div>
                      <span
                        className={cn(
                          'text-sm font-bold',
                          incoming
                            ? 'text-[color:var(--color-success)]'
                            : 'text-foreground',
                        )}
                      >
                        {incoming ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
        )}
      </div>
    </AppLayout>
  )
}

function iconClass(incoming: boolean): string {
  return cn(
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
    incoming
      ? 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]'
      : 'bg-muted text-muted-foreground',
  )
}

function TableSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {[0, 1, 2, 3, 4].map((i) => (
        <li key={i} className="flex items-center gap-3 px-5 py-4">
          <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  )
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Receipt className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-semibold">
        {hasQuery ? 'No matching transactions' : 'No transactions yet'}
      </p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {hasQuery
          ? 'Try adjusting your search or filters.'
          : 'Once you send or receive money, it will appear here.'}
      </p>
    </div>
  )
}
