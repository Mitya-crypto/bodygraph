// app/api/yookassa/create-payment/route.ts

import { NextRequest, NextResponse } from 'next/server'
import YooKassaAPI from '@/lib/yookassaApi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planId, userId, returnUrl } = body

    console.log('🔄 Creating payment request:', { planId, userId })

    // Валидация входных данных
    if (!planId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Plan ID and User ID are required'
      }, { status: 400 })
    }

    // Проверяем, что план существует
    const plan = YooKassaAPI.getPlanById(planId)
    if (!plan) {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment plan'
      }, { status: 400 })
    }

    // Создаем платеж
    const payment = await YooKassaAPI.createPayment(
      planId,
      userId,
      returnUrl || `${process.env.NEXT_PUBLIC_WEBAPP_URL}/payment/success`
    )

    console.log('✅ Payment created successfully:', payment.id)

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        confirmationUrl: payment.confirmation.confirmation_url,
        amount: payment.amount,
        description: payment.description,
        metadata: payment.metadata
      }
    })

  } catch (error) {
    console.error('❌ Payment creation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to create payment'
    }, { status: 500 })
  }
}



