import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  accent?: 'primary' | 'success' | 'muted'
  loading?: boolean
}

const accents: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]',
  muted: 'bg-muted text-muted-foreground',
}

export function StatCard({ label, value, icon: Icon, accent = 'primary', loading }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', accents[accent])}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-28 animate-pulse rounded-md bg-muted" />
      ) : (
        <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      )}
    </div>
  )
}
