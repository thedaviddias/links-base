'use client'

import { Button } from '@links-base/ui/button'
import { cn } from '@links-base/ui/utils'

type DisplayProperty = {
  id: string
  label: string
  isEnabled: boolean
  onToggle: (value: boolean) => void
}

type DisplayPropertiesProps = {
  properties: DisplayProperty[]
}

export const DisplayProperties = ({ properties }: DisplayPropertiesProps) => {
  if (properties.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium" id="display-properties-heading">
        Display Properties
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-labelledby="display-properties-heading"
      >
        {properties.map(({ id, label, isEnabled, onToggle }) => (
          <Button
            key={id}
            variant={isEnabled ? 'default' : 'outline'}
            className={cn(
              'h-7 rounded-full px-3 text-xs',
              isEnabled ? 'hover:bg-primary/80' : 'hover:bg-muted'
            )}
            onClick={() => onToggle(!isEnabled)}
            role="switch"
            id={`display-property-${id}`}
          >
            <span className="sr-only">Show </span>
            {label}
            <span className="sr-only">
              {isEnabled ? ' (enabled)' : ' (disabled)'}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
