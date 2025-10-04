// app/admin/telegram/page.tsx
'use client'

import { TelegramBotSetup } from '@/components/TelegramBotSetup'

export default function TelegramAdminPage() {
  return (
    <div className="min-h-screen bg-space-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TelegramBotSetup />
        </div>
      </div>
    </div>
  )
}



