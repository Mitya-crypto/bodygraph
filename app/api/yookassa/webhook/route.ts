// app/api/yookassa/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import YooKassaAPI from '@/lib/yookassaApi'
import { upgradeToPremium, createFreeSubscription } from '@/lib/subscriptionManager'
import { type YooKassaWebhookEvent } from '@/lib/yookassaConfig'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-yookassa-signature') || ''
    
    console.log('🔄 YooKassa webhook received')

    // В реальном проекте здесь должна быть проверка подписи
    // const isValid = YooKassaAPI.validateWebhookSignature(body, signature, YOOKASSA_CONFIG.secretKey)
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const event: YooKassaWebhookEvent = JSON.parse(body)
    
    console.log('📝 Webhook event:', {
      type: event.type,
      paymentId: event.event.object.id,
      status: event.event.object.status
    })

    // Обрабатываем только успешные платежи
    if (event.type === 'payment.succeeded') {
      const paymentData = event.event.object
      
      try {
        const paymentInfo = await YooKassaAPI.handleSuccessfulPayment(paymentData)
        
        console.log('💰 Processing successful payment:', {
          userId: paymentInfo.userId,
          planId: paymentInfo.planId,
          amount: paymentInfo.amount,
          period: paymentInfo.period
        })

        // Обновляем подписку пользователя
        if (paymentInfo.period === 'monthly' || paymentInfo.period === 'yearly') {
          // Подписочный план
          await upgradeToPremium(
            paymentInfo.userId,
            paymentInfo.period as 'monthly' | 'yearly'
          )
          
          console.log('✅ Premium subscription activated:', {
            userId: paymentInfo.userId,
            planId: paymentInfo.planId
          })
        } else {
          // Разовый платеж
          await upgradeToPremium(
            paymentInfo.userId,
            'yearly' // 1 год для разовых покупок
          )
          
          console.log('✅ One-time purchase activated:', {
            userId: paymentInfo.userId,
            planId: paymentInfo.planId
          })
        }

      } catch (subscriptionError) {
        console.error('❌ Subscription update error:', subscriptionError)
        // В реальном проекте здесь должна быть система уведомлений об ошибках
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// YooKassa может отправлять GET запросы для проверки webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'YooKassa webhook endpoint is active'
  })
}



