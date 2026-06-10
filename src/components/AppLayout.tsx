import { useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Send,
  Shield,
  X,
} from 'lucide-react'
import tizoriLogo from '../assets/tizori-logo.png'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const baseNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/send', label: 'Send Money', icon: Send },
  { to: '/add-money', label: 'Add Money', icon: PlusCircle },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
]

const adminNavItem = {
  to: '/admin',
  label: 'Admin',
  icon: Shield,
}

function toTitleCase(name?: string) {
  if (!name) return 'Tizori User'

  return name
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = user?.role === 'ADMIN'
  const displayName = toTitleCase(user?.fullName)

  const navItems = useMemo(() => {
    return isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems
  }, [isAdmin])

  function handleLogout() {
    logout()
    toast('You have been signed out.', 'info')
    navigate('/login', { replace: true })
  }

  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eef2ff_0%,#f8faff_45%,#ffffff_100%)]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl shadow-md shadow-primary/15">
              <img
                src={tizoriLogo}
                alt="Tizori"
                className="h-11 w-11 object-cover"
              />
            </div>

            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-tight text-slate-950">
                Tizori
              </p>
              <p className="text-[11px] font-semibold text-slate-500">
                Secure Digital Wallet
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-slate-950 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/20">
                {initials}
              </div>

              <div className="hidden text-right leading-tight md:block">
                <p className="text-sm font-extrabold text-slate-950">
                  {displayName}
                </p>
                <p className="max-w-[190px] truncate text-xs font-medium text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 md:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="rounded-2xl p-2 text-slate-950 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-slate-200/80 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-slate-950'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>

      <main
        key={location.pathname}
        className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
      >
        {children}
      </main>
    </div>
  )
}