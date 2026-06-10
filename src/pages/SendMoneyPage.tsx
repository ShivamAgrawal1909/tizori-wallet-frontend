import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AtSign, IndianRupee, FileText, Send } from 'lucide-react'
import { AppLayout } from '../components/AppLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../context/ToastContext'
import {
  getWalletSummary,
  sendMoney,
  type WalletSummary,
} from '../lib/wallet'
import { validateEmail } from '../lib/validation'
import { formatCurrency } from '../lib/utils'

interface Errors {
  receiverEmail?: string
  amount?: string
}

export default function SendMoneyPage() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [receiverEmail, setReceiverEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [summary, setSummary] = useState<WalletSummary | null>(null)

  useEffect(() => {
    let active = true
    getWalletSummary()
      .then((s) => active && setSummary(s))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  function validate(): boolean {
    const next: Errors = {}
    next.receiverEmail = validateEmail(receiverEmail)
    const num = Number(amount)
    if (!amount.trim()) next.amount = 'Amount is required'
    else if (Number.isNaN(num) || num <= 0) next.amount = 'Enter a valid amount'
    else if (summary && num > summary.balance) next.amount = 'Insufficient balance'
    setErrors(next)
    return !next.receiverEmail && !next.amount
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) setConfirmOpen(true)
  }

  async function handleConfirm() {
    setSending(true)
    try {
      await sendMoney({
        receiverEmail: receiverEmail.trim(),
        amount: Number(amount),
        note: note.trim() || undefined,
      })
      setConfirmOpen(false)
      toast(`${formatCurrency(Number(amount))} sent to ${receiverEmail}.`, 'success')
      navigate('/transactions')
    } catch {
      setConfirmOpen(false)
      toast('Transfer failed. Please try again.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg animate-in">
        <h1 className="text-2xl font-extrabold tracking-tight">Send Money</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Transfer funds instantly to any Tizori account.
        </p>

        {summary && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <span className="text-sm text-muted-foreground">Available balance</span>
            <span className="text-sm font-bold">{formatCurrency(summary.balance)}</span>
          </div>
        )}

        <form
          onSubmit={handleReview}
          className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5">
            <Input
              label="Receiver email"
              type="email"
              placeholder="recipient@example.com"
              icon={AtSign}
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              error={errors.receiverEmail}
              autoComplete="off"
            />
            <Input
              label="Amount (INR)"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              icon={IndianRupee}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
            />
            <Input
              label="Note (optional)"
              placeholder="What's this for?"
              icon={FileText}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Button type="submit" fullWidth>
              <Send className="h-4 w-4" />
              Review &amp; Send
            </Button>
          </div>
        </form>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => !sending && setConfirmOpen(false)}
        title="Confirm transfer"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} loading={sending}>
              Confirm &amp; Send
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          You&apos;re about to send the following transfer. Please review the details.
        </p>
        <div className="mt-4 space-y-3 rounded-xl bg-muted/50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Recipient</span>
            <span className="font-semibold">{receiverEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-lg font-extrabold">
              {formatCurrency(Number(amount) || 0)}
            </span>
          </div>
          {note.trim() && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Note</span>
              <span className="font-medium">{note}</span>
            </div>
          )}
        </div>
      </Modal>
    </AppLayout>
  )
}
