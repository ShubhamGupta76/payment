'use client'

import { useState } from 'react'
import styles from './admin.module.css'

export default function AdminPage() {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const paymentMethods = [
    { id: '', name: 'Any Method' },
    { id: 'card', name: 'Card' },
    { id: 'upi', name: 'UPI' },
    { id: 'bank', name: 'Bank Account' },
    { id: 'wallet', name: 'Digital Wallet' },
    { id: 'netbanking', name: 'Net Banking' },
    { id: 'crypto', name: 'Cryptocurrency' }
  ]

  const handleSendPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipientEmail || !amount) {
      setStatus('error')
      setMessage('Please fill in all required fields')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setStatus('error')
      setMessage('Please enter a valid amount')
      return
    }

    setIsSending(true)
    setStatus('idle')
    setMessage('')

    try {
      // Generate payment link - automatically works in both dev and production
      // window.location.origin automatically detects the current domain
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
      
      // Use /pay route for payment page
      let paymentLink = `${baseUrl}/pay?amount=${amountNum}`
      if (paymentMethod) {
        paymentLink += `&method=${paymentMethod}`
      }

      // Send email via API
      const response = await fetch('/api/send-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          amount: amountNum,
          paymentLink,
          paymentMethod: paymentMethod || 'Any Method'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setMessage(`Payment link sent successfully to ${recipientEmail}!`)
        // Reset form
        setRecipientEmail('')
        setAmount('')
        setPaymentMethod('')
      } else {
        setStatus('error')
        setMessage(data.message || 'Failed to send payment link')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error sending payment link. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.adminCard}>
        <h1 className={styles.heading}>Send Payment Link</h1>
        <p className={styles.subtitle}>Create and send a payment link to your customer</p>

        <form onSubmit={handleSendPaymentLink} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Recipient Email <span className={styles.required}>*</span>
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="customer@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amount" className={styles.label}>
              Payment Amount (₹) <span className={styles.required}>*</span>
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              className={styles.input}
              placeholder="1000.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="method" className={styles.label}>
              Preferred Payment Method (Optional)
            </label>
            <select
              id="method"
              className={styles.input}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.sendButton}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Payment Link'}
          </button>
        </form>

        {status === 'success' && (
          <div className={styles.successMessage}>{message}</div>
        )}
        {status === 'error' && (
          <div className={styles.errorMessage}>{message}</div>
        )}

        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>Payment Link Preview:</h3>
          <div className={styles.linkPreview}>
            {amount ? (
              <code>
                {(() => {
                  let baseUrl = ''
                  if (typeof window !== 'undefined') {
                    baseUrl = window.location.origin
                  } else {
                    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
                  }
                  return `${baseUrl}/pay?amount=${amount}${paymentMethod ? `&method=${paymentMethod}` : ''}`
                })()}
              </code>
            ) : (
              <span className={styles.placeholder}>Enter amount to see preview</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

