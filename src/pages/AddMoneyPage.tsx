import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { AppLayout } from "../components/AppLayout"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function AddMoneyPage() {
  const { user } = useAuth()
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const quickAmounts = [100, 500, 1000, 2000, 5000]

  const handleAddMoney = async () => {
    if (!amount || Number(amount) < 1) {
      setError("Minimum amount ₹1 hai!")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("tizori_token")
      const userId = localStorage.getItem("userId")

      // Step 1: Create Razorpay Order
      const orderRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(amount) }),
        }
      )

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order create failed!")
      }

      // Step 2: Razorpay Checkout open karo
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "Tizori",
        description: "Add Money to Wallet",
        order_id: orderData.orderId,
        handler: async (response: any) => {
          // Step 3: Verify payment
          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount: Number(amount),
                userId: userId,
              }),
            }
          )

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            setSuccess(`₹${amount} successfully added to your wallet!`)
            setAmount("")
          } else {
            setError("Payment verification failed!")
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: "#6366f1",
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message || "Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Money</h1>
        <p className="text-gray-500 mb-6">Add money to your Tizori wallet</p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Quick Select</p>
          <div className="flex gap-2 flex-wrap">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  amount === String(q)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-400"
                }`}
              >
                ₹{q}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-500 mb-1 block">
            Enter Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Pay Button */}
        <button
          onClick={handleAddMoney}
          disabled={loading || !amount}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Processing..." : `Add ₹${amount || "0"} to Wallet`}
        </button>
      </div>
    </AppLayout>
  )
}