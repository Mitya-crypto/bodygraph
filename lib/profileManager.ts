// lib/profileManager.ts
'use client'

import { UserProfile } from '@/store/appStore'

export interface ProfileSubscription {
  isActive: boolean
  plan: 'free' | 'premium' | 'pro'
  expiresAt?: Date
  features: string[]
  limits: {
    maxProfiles: number
    maxRequests: number
    maxHistory: number
  }
}

export interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  language_code?: string
}

export interface StoredProfile {
  id: string
  telegramId: number
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export class ProfileManager {
  private static instance: ProfileManager
  private profiles: Map<string, StoredProfile> = new Map()
  private telegramUsers: Map<number, TelegramUser> = new Map()
  private subscriptions: Map<number, ProfileSubscription> = new Map()

  private constructor() {
    this.loadFromStorage()
  }

  public static getInstance(): ProfileManager {
    if (!ProfileManager.instance) {
      ProfileManager.instance = new ProfileManager()
    }
    return ProfileManager.instance
  }

  // Инициализация пользователя Telegram
  public async initializeTelegramUser(telegramUser: TelegramUser): Promise<void> {
    this.telegramUsers.set(telegramUser.id, telegramUser)
    
    // Инициализируем подписку
    if (!this.subscriptions.has(telegramUser.id)) {
      this.subscriptions.set(telegramUser.id, this.getDefaultSubscription())
    }
    
    this.saveToStorage()
  }

  // Получение подписки пользователя
  public getSubscription(telegramId: number): ProfileSubscription {
    return this.subscriptions.get(telegramId) || this.getDefaultSubscription()
  }

  // Проверка лимитов
  public checkLimits(telegramId: number): { canCreate: boolean; canRequest: boolean; reason?: string } {
    const subscription = this.getSubscription(telegramId)
    const userProfiles = this.getUserProfiles(telegramId)
    
    // Проверка лимита профилей
    if (userProfiles.length >= subscription.limits.maxProfiles) {
      return {
        canCreate: false,
        canRequest: false,
        reason: subscription.plan === 'free' 
          ? 'Достигнут лимит бесплатных профилей. Обновите подписку для создания новых профилей.'
          : 'Достигнут лимит профилей для вашего тарифа.'
      }
    }

    // Проверка лимита запросов (если есть система запросов)
    const requestCount = this.getUserRequestCount(telegramId)
    if (requestCount >= subscription.limits.maxRequests) {
      return {
        canCreate: true,
        canRequest: false,
        reason: 'Достигнут лимит запросов. Обновите подписку для продолжения работы.'
      }
    }

    return { canCreate: true, canRequest: true }
  }

  // Создание профиля
  public async createProfile(telegramId: number, profile: UserProfile): Promise<string> {
    const limits = this.checkLimits(telegramId)
    
    if (!limits.canCreate) {
      throw new Error(limits.reason || 'Недостаточно прав для создания профиля')
    }

    const profileId = this.generateProfileId()
    const storedProfile: StoredProfile = {
      id: profileId,
      telegramId,
      profile,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }

    this.profiles.set(profileId, storedProfile)
    this.saveToStorage()
    
    return profileId
  }

  // Получение профилей пользователя
  public getUserProfiles(telegramId: number): StoredProfile[] {
    return Array.from(this.profiles.values())
      .filter(profile => profile.telegramId === telegramId && profile.isActive)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Получение профиля по ID
  public getProfile(profileId: string): StoredProfile | null {
    return this.profiles.get(profileId) || null
  }

  // Обновление профиля
  public async updateProfile(profileId: string, updates: Partial<UserProfile>): Promise<void> {
    console.log('🔧 profileManager.updateProfile called with:', profileId, updates)
    console.log('🔧 Current profiles in storage:', Array.from(this.profiles.keys()))
    
    const profile = this.profiles.get(profileId)
    console.log('🔧 Found profile:', profile)
    
    if (!profile) {
      console.error('❌ Profile not found for ID:', profileId)
      console.error('❌ Available profile IDs:', Array.from(this.profiles.keys()))
      throw new Error('Профиль не найден')
    }

    profile.profile = { ...profile.profile, ...updates }
    profile.updatedAt = new Date()
    
    this.profiles.set(profileId, profile)
    this.saveToStorage()
    console.log('✅ Profile updated successfully')
  }

  // Удаление профиля
  public async deleteProfile(profileId: string): Promise<void> {
    const profile = this.profiles.get(profileId)
    if (!profile) {
      throw new Error('Профиль не найден')
    }

    profile.isActive = false
    this.profiles.set(profileId, profile)
    this.saveToStorage()
  }

  // Обновление подписки
  public updateSubscription(telegramId: number, subscription: Partial<ProfileSubscription>): void {
    const current = this.subscriptions.get(telegramId) || this.getDefaultSubscription()
    this.subscriptions.set(telegramId, { ...current, ...subscription })
    this.saveToStorage()
  }

  // Получение статистики пользователя
  public getUserStats(telegramId: number): {
    totalProfiles: number
    activeProfiles: number
    subscription: ProfileSubscription
    lastActivity: Date | null
  } {
    const profiles = this.getUserProfiles(telegramId)
    const subscription = this.getSubscription(telegramId)
    
    return {
      totalProfiles: profiles.length,
      activeProfiles: profiles.filter(p => p.isActive).length,
      subscription,
      lastActivity: profiles.length > 0 ? profiles[0].updatedAt : null
    }
  }

  // Очистка неактивных профилей
  public cleanupInactiveProfiles(): void {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30) // 30 дней неактивности

    for (const [id, profile] of Array.from(this.profiles.entries())) {
      if (!profile.isActive && profile.updatedAt < cutoffDate) {
        this.profiles.delete(id)
      }
    }
    
    this.saveToStorage()
  }

  // Приватные методы
  private getDefaultSubscription(): ProfileSubscription {
    return {
      isActive: true,
      plan: 'free',
      features: ['basic_profile', 'basic_search'],
      limits: {
        maxProfiles: 1,
        maxRequests: 10,
        maxHistory: 5
      }
    }
  }

  private generateProfileId(): string {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getUserRequestCount(telegramId: number): number {
    // Здесь можно добавить логику подсчета запросов
    // Пока возвращаем 0
    return 0
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('bodygraph_profiles')
        if (stored) {
          const data = JSON.parse(stored)
          
          // Восстанавливаем профили
          if (data.profiles) {
              for (const [id, profile] of Object.entries(data.profiles)) {
                this.profiles.set(id, {
                  ...(profile as any),
                  createdAt: new Date((profile as any).createdAt),
                  updatedAt: new Date((profile as any).updatedAt)
                })
            }
          }
          
          // Восстанавливаем подписки
          if (data.subscriptions) {
              for (const [id, subscription] of Object.entries(data.subscriptions)) {
                this.subscriptions.set(parseInt(id), {
                  ...(subscription as any),
                  expiresAt: (subscription as any).expiresAt ? new Date((subscription as any).expiresAt) : undefined
                })
            }
          }
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки профилей:', error)
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const data = {
          profiles: Object.fromEntries(this.profiles),
          subscriptions: Object.fromEntries(this.subscriptions)
        }
        localStorage.setItem('bodygraph_profiles', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Ошибка сохранения профилей:', error)
    }
  }
}

// Экспорт singleton instance
export const profileManager = ProfileManager.getInstance()
