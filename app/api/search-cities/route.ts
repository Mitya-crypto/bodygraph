import { NextRequest, NextResponse } from 'next/server'

/**
 * API route for city search
 * Avoids "Load failed" errors by handling search on server side
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParam = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!queryParam || queryParam.length < 2) {
      return NextResponse.json({ places: [] })
    }

    // Fix encoding issues for Cyrillic text
    let query = queryParam
    try {
      // Try to decode the query if it's URL encoded
      query = decodeURIComponent(queryParam)
    } catch (e) {
      // If decoding fails, use original query
      query = queryParam
    }

    console.log(`🔍 API: Searching for "${query}" (original: "${queryParam}")`)

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
