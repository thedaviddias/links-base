'use client'

import { Command } from './command'

export function CommandWrapper() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-background/80 p-2 shadow-sm backdrop-blur-sm">
      <Command />
    </div>
  )
}
