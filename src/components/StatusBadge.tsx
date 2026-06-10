import { cn } from '../lib/utils'
import type { Transaction } from '../lib/wallet'

const styles: Record<Transaction['status'], string> = {
  completed:
    'bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]',
  pending: 'bg-amber-500/15 text-amber-600',
  failed: 'bg-destructive/10 text-destructive',
}

const labels: Record<Transaction['status'], string> = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
}

export function StatusBadge({ status }: { status: Transaction['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  )
}
