import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AlertProps {
  message: string
  variant?: 'error' | 'success'
  onClose?: () => void
}

export function Alert({ message, variant = 'error', onClose }: AlertProps) {
  if (!message) return null
  const isError = variant === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        isError
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-[color:var(--color-success)]/30 bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]',
      )}
    >
      <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" aria-hidden="true" />
      <span className="flex-1 font-medium leading-relaxed">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
