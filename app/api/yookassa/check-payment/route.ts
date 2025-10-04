// app/api/yookassa/check-payment/route.ts

import { NextRequest, NextResponse } from 'next/server'
import YooKassaAPI from '@/lib/yookassaApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId } = body

    console.log('🔄 Checking payment status:', { paymentId })

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID is required'
      }, { status: 400 })
    }

    // Проверяем статус платежа
    const paymentStatus = await YooKassaAPI.checkPaymentStatus(paymentId)

    console.log('✅ Payment status checked:', {
      paymentId,
      status: paymentStatus.status,
      paid: paymentStatus.paid
    })

    return NextResponse.json({
      success: true,
      payment: {
        id: paymentId,
        status: paymentStatus.status,
        paid: paymentStatus.paid,
        amount: paymentStatus.amount,
        metadata: paymentStatus.metadata
      }
    })

  } catch (error) {
    console.error('❌ Payment check error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to check payment status'
    }, { status: 500 })
  }
}



