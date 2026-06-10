import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboardPage from './pages/AdminDashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SendMoneyPage from './pages/SendMoneyPage'
import TransactionsPage from './pages/TransactionsPage'
import AddMoneyPage from './pages/AddMoneyPage'

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initializing } = useAuth()
  if (initializing) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />

      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      <Route path="/send" element={<ProtectedRoute><SendMoneyPage /></ProtectedRoute>} />

      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="/add-money" element={<ProtectedRoute><AddMoneyPage /></ProtectedRoute>} />

      <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}