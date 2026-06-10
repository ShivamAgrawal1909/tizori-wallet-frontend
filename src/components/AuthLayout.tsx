import { useEffect, useRef, type ReactNode } from 'react'
import tizoriLogo from '../assets/tizori-logo.png'
import walletIllustration from '../assets/wallet-illustration.png'

type AuthLayoutProps = {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const walletRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = walletRef.current
    if (!el) return

    el.style.transform = 'translateY(-140px) rotate(-8deg) scale(0.92)'
    el.style.opacity = '0'
    el.style.transition = 'none'

    const timer = setTimeout(() => {
      el.style.transition =
        'transform 1.35s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease'
      el.style.transform = 'translateY(0) rotate(0deg) scale(1)'
      el.style.opacity = '0.95'
    }, 160)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#eef2ff_0%,#f8faff_50%,#ffffff_100%)] p-4 lg:fixed lg:inset-0 lg:overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1500px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)] lg:h-full lg:min-h-0 lg:grid-cols-[1.05fr_1fr]">
        <section className="relative hidden overflow-hidden border-r border-slate-200/80 bg-[radial-gradient(circle_at_73%_53%,#e5e9ff_0%,#f8faff_38%,#ffffff_76%)] px-14 py-7 lg:block">
          <div className="flex items-center gap-3">
            <img
              src={tizoriLogo}
              alt="Tizori"
              className="h-11 w-11 rounded-xl object-contain"
            />
            <div>
              <h2 className="text-3xl font-extrabold leading-none text-slate-950">
                Tizori
              </h2>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Secure Digital Wallet
              </p>
            </div>
          </div>

          <div className="mt-14">
            <p className="max-w-[380px] text-4xl font-extrabold leading-tight tracking-tight text-slate-950">
              Your money,<br />
              your control
            </p>
            <p className="mt-3 max-w-[330px] text-base leading-relaxed text-slate-500">
              Secure, fast, and simple digital payments for everyday use.
            </p>
          </div>

          <div className="relative z-20 mt-8 space-y-4">
            <Feature
              icon="🛡️"
              title="Secure & Private"
              text="JWT authentication keeps your account protected"
            />
            <Feature
              icon="⚡"
              title="Instant Transfers"
              text="Send and receive money in real-time"
            />
            <Feature
              icon="💳"
              title="Smart Wallet"
              text="Manage your balance and transactions effortlessly"
            />
          </div>

          <img
            ref={walletRef}
            src={walletIllustration}
            alt="Wallet illustration"
            className="pointer-events-none absolute right-8 top-[230px] z-10 w-[350px] select-none drop-shadow-[0_28px_42px_rgba(79,70,229,0.20)]"
          />

          <div className="absolute bottom-6 left-12 h-20 w-40 bg-[radial-gradient(circle,#a5b4fc_2px,transparent_3px)] bg-[length:18px_18px] opacity-25" />
          <div className="absolute right-36 top-40 h-20 w-32 bg-[radial-gradient(circle,#c4b5fd_2px,transparent_3px)] bg-[length:18px_18px] opacity-25" />
        </section>

        <section className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center bg-[radial-gradient(circle_at_90%_90%,#eef2ff_0%,#ffffff_42%)] px-6 py-10 sm:px-10 lg:min-h-0 lg:px-20 lg:py-10">
          <div className="absolute right-8 top-8 h-24 w-36 bg-[radial-gradient(circle,#c7d2fe_2px,transparent_3px)] bg-[length:18px_18px] opacity-30 lg:right-14 lg:top-12 lg:opacity-35" />

          <div className="relative z-10 w-full max-w-[560px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <img
                src={tizoriLogo}
                alt="Tizori"
                className="h-11 w-11 rounded-xl object-contain"
              />
              <div>
                <p className="text-3xl font-extrabold leading-none text-slate-950">
                  Tizori
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  Secure Digital Wallet
                </p>
              </div>
            </div>

            {(title || subtitle) && (
              <div className="mb-10">
                {title && (
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-4 text-xl font-medium text-slate-500">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </section>
      </div>
    </div>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-lg shadow-[0_10px_25px_rgba(99,102,241,0.12)]">
        {icon}
      </div>

      <div>
        <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
        <p className="mt-1 max-w-[230px] text-sm leading-relaxed text-slate-500">
          {text}
        </p>
      </div>
    </div>
  )
}