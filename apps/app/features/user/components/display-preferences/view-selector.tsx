'use client'

import { Label } from '@links-base/ui/label'
import { RadioGroup, RadioGroupItem } from '@links-base/ui/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'
import { cn } from '@links-base/ui/utils'

import { type CardSize } from '../../stores/useUserSettingsStore'

type ViewSelectorProps = {
  cardSize: CardSize
  onViewChange: (value: CardSize) => void
}

export const ViewSelector = ({ cardSize, onViewChange }: ViewSelectorProps) => {
  return (
    <div className="grid gap-2">
      <Label>View</Label>
      <RadioGroup
        value={cardSize}
        onValueChange={onViewChange}
        className="grid grid-cols-2 gap-2"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <RadioGroupItem
                  value="compact"
                  id="compact"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="compact"
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-colors hover:bg-accent hover:text-accent-foreground',
                    cardSize === 'compact' && 'border-primary'
                  )}
                >
                  <div className="grid w-full gap-1 text-center">
                    <div className="space-y-2">
                      <div className="mx-auto h-6 w-8/12 rounded-md bg-muted" />
                    </div>
                  </div>
                  <span className="mt-2 block w-full text-center text-sm font-normal">
                    Compact
                  </span>
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Compact view with title only</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <RadioGroupItem
                  value="default"
                  id="default"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="default"
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 transition-colors hover:bg-accent hover:text-accent-foreground',
                    cardSize === 'default' && 'border-primary'
                  )}
                >
                  <div className="grid w-full gap-1">
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded-md bg-muted" />
                      <div className="h-1 w-full rounded-md bg-muted" />
                    </div>
                  </div>
                  <span className="mt-2 block w-full text-center text-sm font-normal">
                    Default
                  </span>
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Default view with description and tags</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </RadioGroup>
    </div>
  )
}
