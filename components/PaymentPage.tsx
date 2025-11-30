'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './PaymentPage.module.css'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  description?: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Card',
    icon: '💳',
    description: 'Credit or Debit Card'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    description: 'Unified Payments Interface'
  },
  {
    id: 'bank',
    name: 'US Bank Account',
    icon: '🏦',
    description: 'Direct bank transfer'
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: '👛',
    description: 'Paytm, PhonePe, Google Pay'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🌐',
    description: 'Internet Banking'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '₿',
    description: 'Bitcoin, Ethereum, etc.'
  }
]

interface CardDetails {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

interface UPIDetails {
  upiId: string
  useQR: boolean
}

interface BankDetails {
  accountNumber: string
  routingNumber: string
  accountHolderName: string
}

interface WalletDetails {
  walletType: string
  walletId: string
}

interface NetBankingDetails {
  bankName: string
  userId: string
  password: string
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [amount, setAmount] = useState<number>(1000) // Default amount
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isMounted, setIsMounted] = useState(false)

  // Payment details states
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })
  const [upiDetails, setUpiDetails] = useState<UPIDetails>({
    upiId: '',
    useQR: false
  })
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: ''
  })
  const [walletDetails, setWalletDetails] = useState<WalletDetails>({
    walletType: '',
    walletId: ''
  })
  const [netBankingDetails, setNetBankingDetails] = useState<NetBankingDetails>({
    bankName: '',
    userId: '',
    password: ''
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      // Set default method if not mounted yet
      setSelectedMethod(paymentMethods[0].id)
      return
    }
    
    // Get pre-selected payment method and amount from URL parameters
    try {
      if (searchParams) {
        // Get amount from URL
        const amountParam = searchParams.get('amount')
        if (amountParam) {
          const parsedAmount = parseFloat(amountParam)
          if (!isNaN(parsedAmount) && parsedAmount > 0) {
            setAmount(parsedAmount)
          }
        }

        // Get payment method from URL
        const methodParam = searchParams.get('method')
        if (methodParam && paymentMethods.find(m => m.id === methodParam)) {
          setSelectedMethod(methodParam)
          return
        }
      }
      // Default to first method if no parameter
      if (!selectedMethod) {
        setSelectedMethod(paymentMethods[0].id)
      }
    } catch (error) {
      // Fallback to default method if searchParams fails
      console.error('Error reading search params:', error)
      if (!selectedMethod) {
        setSelectedMethod(paymentMethods[0].id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, searchParams])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = (): boolean => {
    if (!email) {
      alert('Please enter your email')
      return false
    }

    switch (selectedMethod) {
      case 'card':
        if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
          alert('Please fill all card details')
          return false
        }
        if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
          alert('Please enter a valid card number')
          return false
        }
        if (cardDetails.cvv.length < 3) {
          alert('Please enter a valid CVV')
          return false
        }
        break
      case 'upi':
        if (!upiDetails.useQR && !upiDetails.upiId) {
          alert('Please enter UPI ID or scan QR code')
          return false
        }
        break
      case 'bank':
        if (!bankDetails.accountNumber || !bankDetails.routingNumber || !bankDetails.accountHolderName) {
          alert('Please fill all bank account details')
          return false
        }
        break
      case 'wallet':
        if (!walletDetails.walletType || !walletDetails.walletId) {
          alert('Please fill all wallet details')
          return false
        }
        break
      case 'netbanking':
        if (!netBankingDetails.bankName || !netBankingDetails.userId || !netBankingDetails.password) {
          alert('Please fill all net banking details')
          return false
        }
        break
      case 'crypto':
        // Crypto validation can be added later
        break
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('idle')

    try {
      const paymentData: any = {
        email,
        paymentMethod: selectedMethod,
        amount: amount,
      }

      // Add method-specific details
      switch (selectedMethod) {
        case 'card':
          paymentData.cardDetails = cardDetails
          break
        case 'upi':
          paymentData.upiDetails = upiDetails
          break
        case 'bank':
          paymentData.bankDetails = bankDetails
          break
        case 'wallet':
          paymentData.walletDetails = walletDetails
          break
        case 'netbanking':
          paymentData.netBankingDetails = netBankingDetails
          break
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentStatus('success')
        alert(`Payment successful! Transaction ID: ${data.transactionId}`)
      } else {
        setPaymentStatus('error')
        alert(`Payment failed: ${data.message}`)
      }
    } catch (error) {
      setPaymentStatus('error')
      alert('Payment processing error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>Card Details</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Card Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cardholder Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="John Doe"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Expiry Date</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>CVV</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="123"
                  maxLength={4}
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>
          </div>
        )

      case 'upi':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>UPI Payment</h3>
            <div className={styles.upiOptions}>
              <button
                type="button"
                className={`${styles.upiOption} ${!upiDetails.useQR ? styles.active : ''}`}
                onClick={() => setUpiDetails({ ...upiDetails, useQR: false })}
              >
                Enter UPI ID
              </button>
              <button
                type="button"
                className={`${styles.upiOption} ${upiDetails.useQR ? styles.active : ''}`}
                onClick={() => setUpiDetails({ ...upiDetails, useQR: true })}
              >
                Scan QR Code
              </button>
            </div>
            {!upiDetails.useQR ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>UPI ID</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="yourname@paytm"
                  value={upiDetails.upiId}
                  onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                />
              </div>
            ) : (
              <div className={styles.qrContainer}>
                <div className={styles.qrCode}>
                  <div className={styles.qrPlaceholder}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                      <rect width="200" height="200" fill="white"/>
                      <rect x="20" y="20" width="40" height="40" fill="black"/>
                      <rect x="140" y="20" width="40" height="40" fill="black"/>
                      <rect x="20" y="140" width="40" height="40" fill="black"/>
                      <rect x="80" y="80" width="40" height="40" fill="black"/>
                      <rect x="80" y="120" width="40" height="20" fill="black"/>
                      <rect x="120" y="80" width="20" height="40" fill="black"/>
                      <text x="100" y="190" textAnchor="middle" fontSize="12" fill="#666">Scan with UPI App</text>
                    </svg>
                  </div>
                </div>
                <p className={styles.qrText}>Scan this QR code with your UPI app to pay</p>
              </div>
            )}
          </div>
        )

      case 'bank':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>Bank Account Details</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Account Holder Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="John Doe"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Account Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="1234567890"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Routing Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="123456789"
                maxLength={9}
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
        )

      case 'wallet':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>Digital Wallet</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Wallet Type</label>
              <select
                className={styles.input}
                value={walletDetails.walletType}
                onChange={(e) => setWalletDetails({ ...walletDetails, walletType: e.target.value })}
              >
                <option value="">Select Wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="googlepay">Google Pay</option>
                <option value="amazonpay">Amazon Pay</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Wallet ID / Mobile Number</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter wallet ID or mobile number"
                value={walletDetails.walletId}
                onChange={(e) => setWalletDetails({ ...walletDetails, walletId: e.target.value })}
              />
            </div>
          </div>
        )

      case 'netbanking':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>Net Banking</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Bank</label>
              <select
                className={styles.input}
                value={netBankingDetails.bankName}
                onChange={(e) => setNetBankingDetails({ ...netBankingDetails, bankName: e.target.value })}
              >
                <option value="">Select Bank</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>User ID</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your user ID"
                value={netBankingDetails.userId}
                onChange={(e) => setNetBankingDetails({ ...netBankingDetails, userId: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter your password"
                value={netBankingDetails.password}
                onChange={(e) => setNetBankingDetails({ ...netBankingDetails, password: e.target.value })}
              />
            </div>
          </div>
        )

      case 'crypto':
        return (
          <div className={styles.paymentForm}>
            <h3 className={styles.formTitle}>Cryptocurrency Payment</h3>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Cryptocurrency</label>
              <select className={styles.input}>
                <option value="">Select Crypto</option>
                <option value="bitcoin">Bitcoin (BTC)</option>
                <option value="ethereum">Ethereum (ETH)</option>
                <option value="usdt">Tether (USDT)</option>
                <option value="bnb">Binance Coin (BNB)</option>
              </select>
            </div>
            <div className={styles.cryptoInfo}>
              <p>You will be redirected to complete the cryptocurrency payment.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isMounted) {
    return (
      <div className={styles.container}>
        <div className={styles.paymentCard}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <h1 className={styles.heading}>Enter payment details</h1>
        
        {amount > 0 && (
          <div className={styles.amountDisplay}>
            <span className={styles.amountLabel}>Amount to Pay:</span>
            <span className={styles.amountValue}>₹{amount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={styles.emailSection}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            className={styles.emailInput}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <h2 className={styles.sectionHeading}>Payment method</h2>
        
        <div className={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.paymentOption} ${
                selectedMethod === method.id ? styles.selected : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <input
                type="radio"
                id={method.id}
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className={styles.radio}
              />
              <label htmlFor={method.id} className={styles.paymentLabel}>
                <span className={styles.icon}>{method.icon}</span>
                <div className={styles.methodInfo}>
                  <span className={styles.methodName}>{method.name}</span>
                  {method.description && (
                    <span className={styles.methodDescription}>{method.description}</span>
                  )}
                </div>
              </label>
              {method.id === 'card' && (
                <div className={styles.cardLogos}>
                  <span className={styles.visa}>VISA</span>
                  <span className={styles.mastercard}>MC</span>
                  <span className={styles.amex}>AM EX</span>
                  <span className={styles.discover}>DISCOVER</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedMethod && renderPaymentForm()}

        <button
          className={styles.payButton}
          onClick={handlePayment}
          disabled={isProcessing || !email || !selectedMethod}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>

        {paymentStatus === 'success' && (
          <div className={styles.successMessage}>Payment successful!</div>
        )}
        {paymentStatus === 'error' && (
          <div className={styles.errorMessage}>Payment failed. Please try again.</div>
        )}
      </div>
    </div>
  )
}
