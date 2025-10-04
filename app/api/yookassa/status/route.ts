// app/api/yookassa/status/route.ts

import { NextResponse } from 'next/server'
import YooKassaAPI from '@/lib/yookassaApi'

export async function GET() {
  try {
    console.log('🔄 Checking YooKassa configuration...')

    const config = await YooKassaAPI.checkConfiguration()

    console.log('✅ YooKassa configuration check completed:', {
      configured: config.configured,
      hasShopId: !!config.shopId,
      hasSecretKey: config.hasSecretKey,
      testMode: config.testMode
    })

    return NextResponse.json({
      success: true,
      config
    })

  } catch (error) {
    console.error('❌ YooKassa configuration check error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        configured: false,
        shopId: '',
        hasSecretKey: false,
        testMode: true
      }
    })
  }
}



