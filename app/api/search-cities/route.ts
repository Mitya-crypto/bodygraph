import { NextRequest, NextResponse } from 'next/server'

/**
 * API route for city search
 * Avoids "Load failed" errors by handling search on server side
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!query || query.length < 2) {
      return NextResponse.json({ places: [] })
    }

    console.log(`🔍 API: Searching for "${query}"`)

    // Import search function dynamically
    const { searchCitiesHybrid } = await import('@/lib/hybridGeocodingApi')
    const places = await searchCitiesHybrid(query, limit)

    console.log(`✅ API: Found ${places.length} places`)

    return NextResponse.json({ places })

  } catch (error) {
    console.error('❌ API: Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', places: [] },
      { status: 500 }
    )
  }
}
