import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('🧪 Test assistant data received:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Test data received successfully',
      data: {
        received: data,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ Error in test assistant:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error processing test data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
