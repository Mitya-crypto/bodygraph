// AI-powered place search utility
import { Place } from './places'

export interface AIPlaceSearchResult {
  place: Place | null
  confidence: number
  suggestions: Place[]
  error?: string
}

// AI-powered place search using fuzzy matching and intelligent suggestions
export class AIPlaceSearchAgent {
  private places: Place[]
  private searchHistory: Map<string, Place[]> = new Map()

  constructor(places: Place[]) {
    this.places = places
  }

  // Main AI search method
  async searchPlace(query: string, limit: number = 5): Promise<AIPlaceSearchResult> {
    if (!query || query.length < 2) {
      return {
        place: null,
        confidence: 0,
        suggestions: []
      }
    }

    const normalizedQuery = this.normalizeQuery(query)
    
    // Check search history first
    if (this.searchHistory.has(normalizedQuery)) {
      const cachedResults = this.searchHistory.get(normalizedQuery)!
      return {
        place: cachedResults[0] || null,
        confidence: 0.9,
        suggestions: cachedResults.slice(0, limit)
      }
    }

    // AI-powered search with multiple strategies
    const results = await this.performAISearch(normalizedQuery, limit)
    
    // Cache results
    this.searchHistory.set(normalizedQuery, results)
    
    return {
      place: results[0] || null,
      confidence: this.calculateConfidence(normalizedQuery, results[0]),
      suggestions: results.slice(0, limit)
    }
  }

  // Normalize query for better matching
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[ё]/g, 'е')
      .replace(/[ъь]/g, '')
      .replace(/[^а-яa-z0-9\s\-]/g, '')
      .replace(/\s+/g, ' ')
  }

  // Perform AI-powered search with multiple strategies
  private async performAISearch(query: string, limit: number): Promise<Place[]> {
    const strategies = [
      () => this.exactMatch(query),
      () => this.fuzzyMatch(query),
      () => this.partialMatch(query),
      () => this.soundexMatch(query),
      () => this.transliterationMatch(query),
      () => this.abbreviationMatch(query)
    ]

    const allResults: Place[] = []
    const seenIds = new Set<string>()

    for (const strategy of strategies) {
      try {
        const results = strategy()
        for (const place of results) {
          if (!seenIds.has(place.id)) {
            allResults.push(place)
            seenIds.add(place.id)
          }
        }
      } catch (error) {
        console.warn('AI search strategy failed:', error)
      }
    }

    // Sort by relevance score
    return allResults
      .sort((a, b) => this.calculateRelevanceScore(query, b) - this.calculateRelevanceScore(query, a))
      .slice(0, limit)
  }

  // Exact match strategy
  private exactMatch(query: string): Place[] {
    return this.places.filter(place => 
      place.name.toLowerCase() === query ||
      place.name.toLowerCase().includes(query)
    )
  }

  // Fuzzy match strategy
  private fuzzyMatch(query: string): Place[] {
    return this.places.filter(place => {
      const name = place.name.toLowerCase()
      const country = place.country.toLowerCase()
      const state = place.state?.toLowerCase() || ''
      
      return this.calculateSimilarity(query, name) > 0.6 ||
             this.calculateSimilarity(query, country) > 0.6 ||
             this.calculateSimilarity(query, state) > 0.6
    })
  }

  // Partial match strategy
  private partialMatch(query: string): Place[] {
    const queryWords = query.split(' ')
    return this.places.filter(place => {
      const name = place.name.toLowerCase()
      const country = place.country.toLowerCase()
      const state = place.state?.toLowerCase() || ''
      
      return queryWords.every(word => 
        name.includes(word) || 
        country.includes(word) || 
        state.includes(word)
      )
    })
  }

  // Soundex-like phonetic matching
  private soundexMatch(query: string): Place[] {
    const querySoundex = this.soundex(query)
    return this.places.filter(place => {
      const nameSoundex = this.soundex(place.name.toLowerCase())
      return nameSoundex === querySoundex
    })
  }

  // Transliteration matching (Cyrillic <-> Latin)
  private transliterationMatch(query: string): Place[] {
    const transliteratedQuery = this.transliterate(query)
    return this.places.filter(place => {
      const transliteratedName = this.transliterate(place.name.toLowerCase())
      return transliteratedName.includes(transliteratedQuery) ||
             transliteratedQuery.includes(transliteratedName)
    })
  }

  // Abbreviation matching
  private abbreviationMatch(query: string): Place[] {
    return this.places.filter(place => {
      const name = place.name.toLowerCase()
      const country = place.country.toLowerCase()
      
      // Check if query could be an abbreviation
      if (query.length <= 3) {
        const words = name.split(' ')
        const abbreviation = words.map(w => w[0]).join('')
        return abbreviation.includes(query)
      }
      
      return false
    })
  }

  // Calculate similarity between two strings
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  // Levenshtein distance calculation
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // Soundex algorithm for phonetic matching
  private soundex(str: string): string {
    const s = str.toUpperCase().replace(/[^A-Z]/g, '')
    if (!s) return ''
    
    let result = s[0]
    const mapping = { B: 1, F: 1, P: 1, V: 1, C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2, D: 3, T: 3, L: 4, M: 5, N: 5, R: 6 }
    
    for (let i = 1; i < s.length && result.length < 4; i++) {
      const code = mapping[s[i] as keyof typeof mapping]
      if (code && code !== mapping[s[i - 1] as keyof typeof mapping]) {
        result += code
      }
    }
    
    return result.padEnd(4, '0')
  }

  // Transliteration between Cyrillic and Latin
  private transliterate(str: string): string {
    const cyrillic = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    const latin = 'abvgdeezhziyklmnoprstufkhtschshschyeyuya'
    
    let result = str
    for (let i = 0; i < cyrillic.length; i++) {
      result = result.replace(new RegExp(cyrillic[i], 'g'), latin[i])
    }
    
    return result
  }

  // Calculate relevance score for ranking
  private calculateRelevanceScore(query: string, place: Place): number {
    let score = 0
    const name = place.name.toLowerCase()
    const country = place.country.toLowerCase()
    const state = place.state?.toLowerCase() || ''
    
    // Exact match bonus
    if (name === query) score += 100
    if (name.includes(query)) score += 50
    
    // Country/state match bonus
    if (country.includes(query)) score += 30
    if (state.includes(query)) score += 20
    
    // Population bonus (larger cities get higher scores)
    score += Math.log10(place.population || 1) * 10
    
    // Similarity bonus
    score += this.calculateSimilarity(query, name) * 40
    
    return score
  }

  // Calculate confidence based on match quality
  private calculateConfidence(query: string, place: Place | null): number {
    if (!place) return 0
    
    const name = place.name.toLowerCase()
    const similarity = this.calculateSimilarity(query, name)
    
    if (name === query) return 1.0
    if (name.includes(query)) return 0.9
    if (similarity > 0.8) return 0.8
    if (similarity > 0.6) return 0.6
    if (similarity > 0.4) return 0.4
    
    return 0.2
  }

  // Get search suggestions based on partial input
  getSuggestions(partialQuery: string, limit: number = 3): Place[] {
    if (!partialQuery || partialQuery.length < 1) return []
    
    const normalizedQuery = this.normalizeQuery(partialQuery)
    const suggestions = this.places.filter(place => {
      const name = place.name.toLowerCase()
      const country = place.country.toLowerCase()
      const state = place.state?.toLowerCase() || ''
      
      return name.startsWith(normalizedQuery) ||
             country.startsWith(normalizedQuery) ||
             state.startsWith(normalizedQuery)
    })
    
    return suggestions
      .sort((a, b) => this.calculateRelevanceScore(normalizedQuery, b) - this.calculateRelevanceScore(normalizedQuery, a))
      .slice(0, limit)
  }

  // Clear search history
  clearHistory(): void {
    this.searchHistory.clear()
  }
}

// Create global AI search agent instance
let aiAgent: AIPlaceSearchAgent | null = null

export function getAIPlaceSearchAgent(places: Place[]): AIPlaceSearchAgent {
  if (!aiAgent) {
    aiAgent = new AIPlaceSearchAgent(places)
  }
  return aiAgent
}

// Enhanced search function using AI agent
export async function searchPlacesWithAI(query: string, places: Place[], limit: number = 5): Promise<Place[]> {
  const agent = getAIPlaceSearchAgent(places)
  const result = await agent.searchPlace(query, limit)
  return result.suggestions
}

