import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, paymentMethod, amount, cardDetails, upiDetails, bankDetails, walletDetails, netBankingDetails } = body

    // Validate input
    if (!email || !paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate payment method specific details
    switch (paymentMethod) {
      case 'card':
        if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
          return NextResponse.json(
            { success: false, message: 'Please fill all card details' },
            { status: 400 }
          )
        }
        if (cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
          return NextResponse.json(
            { success: false, message: 'Invalid card number' },
            { status: 400 }
          )
        }
        break
      case 'upi':
        if (!upiDetails) {
          return NextResponse.json(
            { success: false, message: 'UPI details required' },
            { status: 400 }
          )
        }
        if (!upiDetails.useQR && !upiDetails.upiId) {
          return NextResponse.json(
            { success: false, message: 'Please enter UPI ID or use QR code' },
            { status: 400 }
          )
        }
        break
      case 'bank':
        if (!bankDetails || !bankDetails.accountNumber || !bankDetails.routingNumber || !bankDetails.accountHolderName) {
          return NextResponse.json(
            { success: false, message: 'Please fill all bank account details' },
            { status: 400 }
          )
        }
        break
      case 'wallet':
        if (!walletDetails || !walletDetails.walletType || !walletDetails.walletId) {
          return NextResponse.json(
            { success: false, message: 'Please fill all wallet details' },
            { status: 400 }
          )
        }
        break
      case 'netbanking':
        if (!netBankingDetails || !netBankingDetails.bankName || !netBankingDetails.userId || !netBankingDetails.password) {
          return NextResponse.json(
            { success: false, message: 'Please fill all net banking details' },
            { status: 400 }
          )
        }
        break
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Dummy payment processing logic
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1

    if (isSuccess) {
      // Generate dummy transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId,
        paymentMethod,
        amount,
        email,
        timestamp: new Date().toISOString(),
        paymentDetails: {
          cardDetails: paymentMethod === 'card' ? { ...cardDetails, cardNumber: '****' + cardDetails.cardNumber.slice(-4) } : undefined,
          upiDetails: paymentMethod === 'upi' ? upiDetails : undefined,
          bankDetails: paymentMethod === 'bank' ? { ...bankDetails, accountNumber: '****' + bankDetails.accountNumber.slice(-4) } : undefined,
          walletDetails: paymentMethod === 'wallet' ? walletDetails : undefined,
          netBankingDetails: paymentMethod === 'netbanking' ? { ...netBankingDetails, password: '****' } : undefined,
        }
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment processing failed. Please try again.',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

