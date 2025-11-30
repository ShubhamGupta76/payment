import { NextRequest, NextResponse } from 'next/server'

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_v0850sl'
const EMAILJS_PUBLIC_KEY = 'QphDE4xgozefDEeuS' // Public key for reference
// Note: For server-side API calls, use Private Key from EmailJS dashboard
// Private Key should be set as environment variable for security
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'QphDE4xgozefDEeuS'
const EMAILJS_TEMPLATE_ID = 'template_kfn1g8l'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipientEmail, amount, paymentLink, paymentMethod } = body

    // Validate input
    if (!recipientEmail || !amount || !paymentLink) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare email template parameters
    const templateParams = {
      to_email: recipientEmail,
      amount: `₹${parseFloat(amount).toFixed(2)}`,
      payment_link: paymentLink,
      payment_method: paymentMethod || 'Any Payment Method',
      subject: `Payment Request - ₹${parseFloat(amount).toFixed(2)}`,
    }

    // Send email using EmailJS REST API
    // Using URLSearchParams format as required by EmailJS
    const formData = new URLSearchParams()
    formData.append('service_id', EMAILJS_SERVICE_ID)
    formData.append('template_id', EMAILJS_TEMPLATE_ID)
    formData.append('user_id', EMAILJS_PRIVATE_KEY)
    formData.append('template_params', JSON.stringify(templateParams))

    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    const responseText = await emailjsResponse.text()

    if (emailjsResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Payment link sent successfully',
        emailId: responseText,
      })
    } else {
      // Try to parse error if it's JSON
      let errorMessage = 'Failed to send email'
      try {
        const errorJson = JSON.parse(responseText)
        errorMessage = errorJson.message || errorJson.text || errorMessage
      } catch {
        errorMessage = responseText || errorMessage
      }

      console.error('EmailJS Error:', responseText)
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: emailjsResponse.status || 500 }
      )
    }
  } catch (error: any) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

