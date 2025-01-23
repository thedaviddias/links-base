'use client'

import { useState } from 'react'

import { XIcon } from 'lucide-react'

import { cn } from '../../utils'

interface BannerProps {
  text: string
  className?: string
}

export function Banner({ text, className }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'relative isolate flex items-center overflow-hidden bg-primary px-6 py-3 text-primary-foreground',
        className
      )}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/10 to-primary-foreground/5 opacity-20" />

      {/* Main content container */}
      <div className="flex w-full items-center justify-between gap-x-4">
        {/* Text container with full width for centering */}
        <div className="flex-1 text-center">
          <p className="text-sm font-medium leading-6">{text}</p>
        </div>

        {/* Close button */}
        <button
          type="button"
          className="flex-none rounded-lg p-1 transition-colors hover:bg-primary-foreground/10"
          onClick={() => setIsVisible(false)}
        >
          <span className="sr-only">Dismiss</span>
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
