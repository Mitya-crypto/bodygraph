import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  birthCoordinates: string
  coordinates?: {
    lat: number
    lng: number
  }
  timezone?: string
  language: 'en' | 'ru'
  telegramId?: number
  createdAt?: string
  updatedAt?: string
}

export interface NumerologyData {
  lifePath: number
  expression: number
  soulUrge: number
  personality: number
  dayNumber: number
  monthNumber: number
  yearNumber: number
  biorythms: {
    physical: number
    emotional: number
    intellectual: number
  }
  compatibility?: {
    partnerName: string
    score: number
    description: string
  }
}

export interface HumanDesignData {
  type: string
  strategy: string
  authority: string
  profile: string
  definition: string
  channels: Array<{
    number: string
    name: string
    gates: string[]
  }>
  gates: Array<{
    number: string
    name: string
    line: number
    color: string
  }>
  centers: Array<{
    name: string
    defined: boolean
    color: string
  }>
  incarnationCross: string
  variables?: {
    digestion: string
    environment: string
    motivation: string
    perspective: string
  }
}

export interface AstrologyData {
  sun: {
    sign: string
    degree: number
    house: number
  }
  moon: {
    sign: string
    degree: number
    house: number
  }
  ascendant: {
    sign: string
    degree: number
  }
  planets: Array<{
    name: string
    sign: string
    degree: number
    house: number
    retrograde: boolean
  }>
  houses: Array<{
    number: number
    sign: string
    degree: number
    cusp: number
  }>
  aspects: Array<{
    planet1: string
    planet2: string
    type: string
    degree: number
    orb: number
  }>
}

export interface CalculationResult {
  module: 'numerology' | 'human-design' | 'astrology' | 'compatibility'
  data: NumerologyData | HumanDesignData | AstrologyData
  timestamp: number
  isPremium: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  features: string[]
  duration: number // days
}

export type Screen = 'welcome' | 'profile' | 'profile-management' | 'modules' | 'results' | 'subscription'

interface AppState {
  // Navigation
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void
  
  // Selected module
  selectedModule: string | null
  setSelectedModule: (module: string | null) => void
  
  // User data
  userProfile: UserProfile | null
  setUserProfile: (profile: UserProfile) => void
  
  // Profile update trigger
  profileUpdateTrigger: number
  triggerProfileUpdate: () => void
  
  // Subscription
  subscriptionStatus: 'free' | 'premium' | 'expired'
  subscriptionExpiry: number | null
  setSubscription: (status: 'free' | 'premium' | 'expired', expiry?: number) => void
  
  // Calculations
  calculationHistory: CalculationResult[]
  addCalculation: (result: CalculationResult) => void
  clearHistory: () => void
  
  // Current calculation
  currentCalculation: CalculationResult | null
  setCurrentCalculation: (result: CalculationResult | null) => void
  
  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  
  error: string | null
  setError: (error: string | null) => void
  
  // Language
  language: 'en' | 'ru'
  setLanguage: (lang: 'en' | 'ru') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentScreen: 'welcome',
      setCurrentScreen: (screen) => {
        console.log('🏪 Store: Setting current screen to:', screen)
        console.log('🏪 Store: Previous screen was:', get().currentScreen)
        set({ currentScreen: screen })
        console.log('🏪 Store: New screen is:', get().currentScreen)
      },
      
      // Selected module
      selectedModule: null,
      setSelectedModule: (module) => set({ selectedModule: module }),
      
      // User data
      userProfile: null,
      setUserProfile: (profile) => {
        console.log('🏪 Setting userProfile in store:', profile)
        console.log('🏪 Profile details:', {
          name: profile?.name,
          birthDate: profile?.birthDate,
          birthTime: profile?.birthTime,
          birthPlace: profile?.birthPlace,
          birthCoordinates: profile?.birthCoordinates
        })
        set({ userProfile: profile })
      },
      
      // Profile update trigger
      profileUpdateTrigger: 0,
      triggerProfileUpdate: () => {
        console.log('🔄 Triggering profile update for all components')
        set((state) => ({ profileUpdateTrigger: state.profileUpdateTrigger + 1 }))
      },
      
      // Subscription - теперь все пользователи Premium по умолчанию
      subscriptionStatus: 'premium',
      subscriptionExpiry: null,
      setSubscription: (status, expiry) => set({ 
        subscriptionStatus: status, 
        subscriptionExpiry: expiry 
      }),
      
      // Calculations
      calculationHistory: [],
      addCalculation: (result) => set((state) => ({
        calculationHistory: [...state.calculationHistory, result]
      })),
      clearHistory: () => set({ calculationHistory: [] }),
      
      // Current calculation
      currentCalculation: null,
      setCurrentCalculation: (result) => set({ currentCalculation: result }),
      
      // UI state
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      error: null,
      setError: (error) => set({ error }),
      
      // Language
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'cosmic-bodygraph-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        subscriptionStatus: state.subscriptionStatus,
        subscriptionExpiry: state.subscriptionExpiry,
        calculationHistory: state.calculationHistory,
        language: state.language,
        currentScreen: state.currentScreen, // Добавляем currentScreen в persist
      }),
    }
  )
)
