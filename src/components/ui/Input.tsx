import { forwardRef, useId, useState } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: LucideIcon
  /** Adds a show/hide toggle and manages type internally. */
  togglePassword?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, togglePassword, type = 'text', className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const [show, setShow] = useState(false)

    const resolvedType = togglePassword ? (show ? 'text' : 'password') : type

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'w-full rounded-xl border bg-card/70 px-4 py-3 text-sm text-foreground transition-colors',
              'placeholder:text-muted-foreground/70',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              Icon && 'pl-10.5',
              togglePassword && 'pr-11',
              error ? 'border-destructive focus:ring-destructive/60' : 'border-border',
              className,
            )}
            {...props}
          />
          {togglePassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
