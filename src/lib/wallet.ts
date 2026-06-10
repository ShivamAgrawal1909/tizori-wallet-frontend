import { api } from './api'

export interface Transaction {
  id: string
  type: 'sent' | 'received'
  amount: number
  sender: string
  receiver: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  note?: string
}

export interface WalletSummary {
  balance: number
  totalSent: number
  totalReceived: number
  totalTransactions: number
}

export interface SendMoneyPayload {
  receiverEmail: string
  amount: number
  note?: string
}

function getUserId(): string {
  return localStorage.getItem('userId') ?? ''
}

function normalizeTransaction(t: any, currentUserId: string): Transaction {
  const fromUserId = String(t.fromUserId ?? t.senderUserId ?? t.sender?.id ?? '')
  const toUserId = String(t.toUserId ?? t.receiverUserId ?? t.receiver?.id ?? '')

  const rawType = String(t.type ?? '').toUpperCase()
  const rawStatus = String(t.status ?? '').toUpperCase()

  const isAddMoney = rawType === 'ADD_MONEY'

  const isReceived =
    isAddMoney ||
    toUserId === currentUserId ||
    rawType === 'CREDIT' ||
    rawType === 'RECEIVED'

  const senderDisplay = isAddMoney
    ? 'Wallet Top-up'
    : t.senderEmail ??
      t.sender?.email ??
      t.senderName ??
      t.fromUserEmail ??
      (fromUserId ? `User ${fromUserId}` : '')

  const receiverDisplay =
    t.receiverEmail ??
    t.receiver?.email ??
    t.receiverName ??
    t.toUserEmail ??
    (toUserId ? `User ${toUserId}` : '')

  const status =
    rawStatus === 'SUCCESS'
      ? 'completed'
      : rawStatus === 'FAILED'
        ? 'failed'
        : rawStatus === 'PENDING'
          ? 'pending'
          : 'completed'

  return {
    id: String(t.id ?? t.transactionId ?? Date.now()),
    type: isReceived ? 'received' : 'sent',
    amount: Number(t.amount ?? 0),
    sender: senderDisplay,
    receiver: receiverDisplay,
    status,
    date: t.createdAt ?? t.date ?? t.timestamp ?? new Date().toISOString(),
    note: isAddMoney ? 'Money added to wallet' : t.note ?? t.description ?? '',
  }
}

export async function getWalletSummary(): Promise<WalletSummary> {
  const userId = getUserId()

  const [walletResponse, summaryResponse] = await Promise.allSettled([
    api.get<any>(`/api/wallet/balance/${userId}`),
    api.get<any>(`/api/transactions/summary/${userId}`),
  ])

  const walletData =
    walletResponse.status === 'fulfilled' ? walletResponse.value.data : {}

  const summaryData =
    summaryResponse.status === 'fulfilled' ? summaryResponse.value.data : {}

  return {
    balance: Number(walletData.balance ?? 0),
    totalSent: Number(summaryData.totalSent ?? 0),
    totalReceived: Number(summaryData.totalReceived ?? 0),
    totalTransactions: Number(summaryData.totalTransactions ?? 0),
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const userId = getUserId()

  const { data } = await api.get<any[]>(`/api/transactions/user/${userId}`)

  const list = Array.isArray(data) ? data : []

  return list.map((transaction) => normalizeTransaction(transaction, userId))
}

export async function sendMoney(
  payload: SendMoneyPayload,
): Promise<Transaction> {
  const userId = getUserId()

  const { data: receiver } = await api.get<any>('/api/users/by-email', {
    params: {
      email: payload.receiverEmail.trim(),
    },
  })

  const receiverId = receiver.userId ?? receiver.id

  if (!receiverId) {
    throw new Error('Receiver account not found.')
  }

  const { data } = await api.post<string>('/api/wallet/transfer', null, {
    params: {
      fromUserId: userId,
      toUserId: receiverId,
      amount: payload.amount,
    },
  })

  return {
    id: String(Date.now()),
    type: 'sent',
    amount: payload.amount,
    sender: userId,
    receiver: payload.receiverEmail,
    status: 'completed',
    date: new Date().toISOString(),
    note: payload.note ?? data,
  }
}