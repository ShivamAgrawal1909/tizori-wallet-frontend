import { CheckCircle2, Mail, Shield, User, Wallet } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  const name = user?.fullName || localStorage.getItem('name') || '-'
  const email = user?.email || localStorage.getItem('email') || '-'
  const role = user?.role || localStorage.getItem('role') || 'USER'

  return (
    <AppLayout>
      <div className="animate-in">
        <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your Tizori wallet account details.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-2xl font-bold text-primary-foreground">
                {name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--color-success)]/15 px-3 py-1.5 text-sm font-semibold text-[color:var(--color-success)]">
              <CheckCircle2 className="h-4 w-4" />
              Active Wallet
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <ProfileItem icon={CheckCircle2} label="Wallet Status" value="Active" />
            <ProfileItem icon={Mail} label="Email" value={email} />
            <ProfileItem icon={Shield} label="Role" value={role} />
            <ProfileItem icon={Wallet} label="Account Type" value="Digital Wallet" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-semibold">{value}</p>
      </div>
    </div>
  )
}