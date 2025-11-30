# EmailJS Setup Guide

## Email Template Variables

Your EmailJS template (`template_kfn1g8l`) should include these variables:

- `{{to_email}}` - Recipient email address
- `{{amount}}` - Payment amount (e.g., ₹1000.00)
- `{{payment_link}}` - The payment link URL
- `{{payment_method}}` - Preferred payment method
- `{{subject}}` - Email subject line

## Example Email Template

```
Subject: {{subject}}

Hello,

You have a payment request of {{amount}}.

Please click on the link below to complete your payment:
{{payment_link}}

Preferred Payment Method: {{payment_method}}

Thank you!
```

## Configuration

Your EmailJS credentials are already configured:
- Service ID: `service_v0850sl`
- Public Key: `QphDE4xgozefDEeuS`
- Template ID: `template_kfn1g8l`

## How to Use

1. Go to `/admin` page
2. Enter recipient email
3. Enter payment amount
4. (Optional) Select preferred payment method
5. Click "Send Payment Link"
6. The recipient will receive an email with the payment link
7. When they click the link, they'll see the payment page with the pre-set amount

