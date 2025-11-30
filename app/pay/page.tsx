'use client'

import { Suspense } from 'react'
import PaymentPage from '@/components/PaymentPage'

function PaymentPageWrapper() {
  return <PaymentPage />
}

export default function PayPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading payment page...
      </div>
    }>
      <PaymentPageWrapper />
    </Suspense>
  )
}

