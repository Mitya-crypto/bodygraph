import { NextRequest, NextResponse } from 'next/server'
import { checkN8NApiStatus, getN8NPlanInfo } from '@/lib/n8nApi'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking n8n API status...')
    
    const status = await checkN8NApiStatus()
    const planInfo = getN8NPlanInfo()

    console.log('✅ n8n status check completed:', {
      connected: status.connected,
      workflowsCount: status.workflowsCount,
      hasUser: !!status.user,
    })

    return NextResponse.json({
      status: status.connected ? 'connected' : 'disconnected',
      connected: status.connected,
      user: status.user,
      workflowsCount: status.workflowsCount,
      error: status.error,
      plan: planInfo,
    })
  } catch (error) {
    console.error('❌ Error checking n8n status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check n8n status',
        details: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        connected: false,
        workflowsCount: 0,
      },
      { status: 500 }
    )
  }
}



