# Payment Gateway Application

A Next.js payment gateway application with EmailJS integration for sending payment links. The admin panel opens directly when you visit the website.

## Features

- **Admin Panel (Home Page)**: Direct access to create and send payment links
- Multiple payment methods: Card, UPI, Bank Account, Digital Wallet, Net Banking, Cryptocurrency
- Pre-selected payment method via URL parameter
- EmailJS integration for sending payment links
- Dynamic payment amount from URL
- Email validation
- Dummy payment API integration
- Modern, responsive UI

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - **Admin panel opens directly!**

## Project Structure

- **`/` (Home)**: Admin panel to create and send payment links
- **`/pay`**: Payment page where customers complete payment
- **`/admin`**: Alternative admin panel route (same as home)

## Usage

### 1. Admin Panel (Home Page)

When you open the website, you'll see the admin panel directly:

1. Enter recipient email address
2. Enter payment amount (₹)
3. (Optional) Select preferred payment method
4. Click "Send Payment Link"
5. The system sends an email with the payment link

### 2. Payment Links

Payment links are automatically generated in the format:
```
https://yourdomain.com/pay?amount=1000&method=upi
```

### 3. Customer Payment Flow

When customers click the payment link:
- They see the payment page with the pre-set amount
- The payment method is pre-selected (if specified)
- They can fill in payment details and complete payment

## Payment Methods

1. **Card** - Credit or Debit Card (with card number, name, expiry, CVV)
2. **UPI** - Unified Payments Interface (with UPI ID or QR code)
3. **US Bank Account** - Direct bank transfer
4. **Digital Wallet** - Paytm, PhonePe, Google Pay, Amazon Pay
5. **Net Banking** - Internet Banking
6. **Cryptocurrency** - Bitcoin, Ethereum, etc.

## EmailJS Configuration

Your EmailJS credentials are configured:
- Service ID: `service_v0850sl`
- Public Key: `QphDE4xgozefDEeuS`
- Template ID: `template_kfn1g8l`

### Email Template Variables

Make sure your EmailJS template includes:
- `{{to_email}}` - Recipient email address
- `{{amount}}` - Payment amount (e.g., ₹1000.00)
- `{{payment_link}}` - The payment link URL
- `{{payment_method}}` - Preferred payment method
- `{{subject}}` - Email subject line

## Production Deployment

### Environment Variables

For production, set the base URL in your environment variables:

```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

The system automatically detects the base URL from the browser, but setting this ensures correct links in emails.

### Build and Deploy

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/payment

Process a payment using dummy API.

**Request Body:**
```json
{
  "email": "user@example.com",
  "paymentMethod": "card",
  "amount": 1000,
  "cardDetails": {
    "cardNumber": "1234 5678 9012 3456",
    "cardName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

### POST /api/send-payment-link

Send payment link via EmailJS.

**Request Body:**
```json
{
  "recipientEmail": "customer@example.com",
  "amount": 1000,
  "paymentLink": "https://yourdomain.com/pay?amount=1000",
  "paymentMethod": "UPI"
}
```

## Technologies

- Next.js 14
- React 18
- TypeScript
- CSS Modules
- EmailJS

## Example Workflow

1. **Admin**: Opens website → Sees admin panel
2. **Admin**: Enters customer email and amount (₹5000)
3. **Admin**: Selects "UPI" as preferred method
4. **Admin**: Clicks "Send Payment Link"
5. **System**: Sends email to customer with link: `https://yourdomain.com/pay?amount=5000&method=upi`
6. **Customer**: Opens email and clicks link
7. **Customer**: Sees payment page with ₹5000 and UPI pre-selected
8. **Customer**: Fills UPI details and completes payment

## Support

For issues or questions, please check the EmailJS setup guide in `EMAILJS_SETUP.md`.
