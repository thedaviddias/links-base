'use client'

import { useState } from 'react'
import * as React from 'react'

import { Check } from 'lucide-react'

import { useToast } from '@links-base/ui/hooks'
import { cn } from '@links-base/ui/utils'

interface CopyTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onCopy?: () => void
}

export const CopyTrigger = React.forwardRef<HTMLDivElement, CopyTriggerProps>(
  ({ value, onCopy, className, children, ...props }, ref) => {
    const [showCheck, setShowCheck] = useState(false)
    const { toast } = useToast()

    const handleClick = async () => {
      try {
        await navigator.clipboard.writeText(value)
        setShowCheck(true)
        onCopy?.()

        toast({
          title: 'Copied!',
          description: `${value} has been copied to clipboard`,
          duration: 2000
        })

        setTimeout(() => setShowCheck(false), 2000)
      } catch (error) {
        console.error('Failed to copy:', error)
        toast({
          title: 'Error',
          description: 'Failed to copy to clipboard',
          variant: 'destructive',
          duration: 2000
        })
      }
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={cn('group relative cursor-pointer', className)}
        {...props}
      >
        {children}
        {showCheck && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/50 duration-100 animate-in fade-in-0">
            <Check className="h-3 w-3 text-green-500" />
          </div>
        )}
      </div>
    )
  }
)

CopyTrigger.displayName = 'CopyTrigger'
