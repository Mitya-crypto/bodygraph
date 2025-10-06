'use client'

import { useSearchParams } from 'next/navigation'
import { ResultsScreen } from '@/components/ResultsScreen'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const module = searchParams.get('module')
  
  return <ResultsScreen selectedModule={module || 'numerology'} />
}

