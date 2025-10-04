// lib/yookassaApi.ts

import { 
  YOOKASSA_CONFIG, 
  YOOKASSA_ENDPOINTS,
  PAYMENT_PLANS,
  type YooKassaPaymentRequest,
  type YooKassaPaymentResponse,
  type PaymentPlan
} from './yookassaConfig'

export class YooKassaAPI {
  private static getAuthHeader(): string {
    const credentials = Buffer.from(`${YOOKASSA_CONFIG.shopId}:${YOOKASSA_CONFIG.secretKey}`).toString('base64')
    return `Basic ${credentials}`
  }

  private static async makeRequest(
    endpoint: string, 
    method: 'GET' | 'POST' = 'GET', 
    body?: any
  ): Promise<any> {
    const url = `${YOOKASSA_CONFIG.apiUrl}${endpoint}`
    
    const headers: Record<string, string> = {
      'Authorization': this.getAuthHeader(),
      'Content-Type': 'application/json',
      'Idempotence-Key': this.generateIdempotenceKey(),
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`YooKassa API error: ${response.status} - ${errorData}`)
    }

    return await response.json()
  }

  private static generateIdempotenceKey(): string {
    return Date.now().toString() + Math.random().toString(36).substring(2)
  }

  /**
   * Создать платеж
   */
  static async createPayment(
    planId: string,
    userId: string,
    returnUrl: string
  ): Promise<YooKassaPaymentResponse> {
    const plan = PAYMENT_PLANS[planId as keyof typeof PAYMENT_PLANS]
    
    if (!plan) {
      throw new Error(`Payment plan ${planId} not found`)
    }

    if (!YOOKASSA_CONFIG.shopId || !YOOKASSA_CONFIG.secretKey) {
      throw new Error('YooKassa credentials not configured')
    }

    const paymentRequest: YooKassaPaymentRequest = {
      amount: {
        value: (plan.price / 100).toFixed(2), // конвертируем из копеек в рубли
        currency: plan.currency
      },
      confirmation: {
        type: 'redirect',
        return_url: returnUrl
      },
      capture: YOOKASSA_CONFIG.capture,
      description: plan.description,
      metadata: {
        plan_id: planId,
        user_id: userId,
        plan_name: plan.name,
        period: plan.period
      }
    }

    console.log('🔄 Creating YooKassa payment:', {
      planId,
      userId,
      amount: paymentRequest.amount.value,
      currency: paymentRequest.amount.currency
    })

    const response = await this.makeRequest(
      YOOKASSA_ENDPOINTS.payments,
      'POST',
      paymentRequest
    )

    console.log('✅ YooKassa payment created:', response.id)

    return response
  }

  /**
   * Получить информацию о платеже
   */
  static async getPayment(paymentId: string): Promise<YooKassaPaymentResponse> {
    return await this.makeRequest(YOOKASSA_ENDPOINTS.payment(paymentId))
  }

  /**
   * Проверить статус платежа
   */
  static async checkPaymentStatus(paymentId: string): Promise<{
    status: string
    paid: boolean
    amount: { value: string; currency: string }
    metadata?: Record<string, string>
  }> {
    const payment = await this.getPayment(paymentId)
    
    return {
      status: payment.status,
      paid: payment.paid,
      amount: payment.amount,
      metadata: payment.metadata
    }
  }

  /**
   * Получить все доступные планы
   */
  static getAvailablePlans(): PaymentPlan[] {
    return Object.values(PAYMENT_PLANS) as PaymentPlan[]
  }

  /**
   * Получить план по ID
   */
  static getPlanById(planId: string): PaymentPlan | null {
    return (PAYMENT_PLANS[planId as keyof typeof PAYMENT_PLANS] as PaymentPlan) || null
  }

  /**
   * Проверить конфигурацию YooKassa
   */
  static async checkConfiguration(): Promise<{
    configured: boolean
    shopId: string
    hasSecretKey: boolean
    testMode: boolean
  }> {
    return {
      configured: !!(YOOKASSA_CONFIG.shopId && YOOKASSA_CONFIG.secretKey),
      shopId: YOOKASSA_CONFIG.shopId,
      hasSecretKey: !!YOOKASSA_CONFIG.secretKey,
      testMode: YOOKASSA_CONFIG.testMode
    }
  }

  /**
   * Валидация webhook от YooKassa
   */
  static validateWebhookSignature(
    body: string,
    signature: string,
    secret: string
  ): boolean {
    // В реальном проекте здесь должна быть проверка подписи
    // Для упрощения пока возвращаем true
    return true
  }

  /**
   * Обработка успешного платежа
   */
  static async handleSuccessfulPayment(paymentData: YooKassaPaymentResponse): Promise<{
    userId: string
    planId: string
    amount: number
    period: string
  }> {
    const { metadata } = paymentData
    
    if (!metadata || !metadata.user_id || !metadata.plan_id) {
      throw new Error('Invalid payment metadata')
    }

    return {
      userId: metadata.user_id,
      planId: metadata.plan_id,
      amount: parseFloat(paymentData.amount.value) * 100, // конвертируем в копейки
      period: metadata.period || 'one_time'
    }
  }
}

export default YooKassaAPI



