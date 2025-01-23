'use client'

import { useState } from 'react'

import { InfoIcon } from 'lucide-react'

import { useWarningPreferences } from '@/features/environment/hooks/useWarningPreferences'
import { type Environment } from '@/features/environment/types/environment.types'
import { useEnvironmentConfig } from '@/features/links/hooks/environments/use-environment-config'
import { useMultiEnvironmentCheck } from '@/features/links/hooks/environments/use-multi-environment-check'
import { useEnvironmentStore } from '@/features/links/hooks/environments/useEnvironmentStore'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@links-base/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@links-base/ui/tooltip'
import { cn } from '@links-base/ui/utils'

import { getAbbreviation } from './environment-badge'
import { EnvironmentButton } from './environment-button'

interface EnvironmentSelectorProps {
  categoryId?: string
}

export function EnvironmentSelector({ categoryId }: EnvironmentSelectorProps) {
  const { currentEnvironment, setCurrentEnvironment } = useEnvironmentStore()
  const [pendingEnvironment, setPendingEnvironment] =
    useState<Environment | null>(null)
  const { hasMultipleEnvironments } = useMultiEnvironmentCheck(categoryId)
  const { hasSeenEnvironmentWarning, setHasSeenEnvironmentWarning } =
    useWarningPreferences()
  const { environmentOrder, environmentColors, environmentLabels } =
    useEnvironmentConfig()

  const renderDisabledSelector = (message: string) => (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1 rounded-lg bg-background p-0.5 opacity-50 shadow-sm">
        {environmentOrder.map(env => (
          <button
            key={env}
            disabled
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium',
              'cursor-not-allowed text-muted-foreground'
            )}
          >
            {getAbbreviation(env, environmentLabels) || env}
          </button>
        ))}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>{message}</TooltipContent>
      </Tooltip>
    </div>
  )

  // If there are no multi-environment links at all
  if (!hasMultipleEnvironments) {
    return renderDisabledSelector(
      'No multi-environment links available in this section'
    )
  }

  const handleEnvironmentSwitch = (env: Environment) => {
    if (!env || env === currentEnvironment) return

    if (hasSeenEnvironmentWarning) {
      setCurrentEnvironment(env)
    } else {
      setPendingEnvironment(env)
    }
  }

  const confirmSwitch = () => {
    if (pendingEnvironment) {
      setCurrentEnvironment(pendingEnvironment)
      setHasSeenEnvironmentWarning(true)
      setPendingEnvironment(null)
    }
  }

  return (
    <div
      className="flex flex-col items-end gap-2"
      data-testid="environment-selector"
    >
      <div
        className="inline-flex items-center gap-1 rounded-lg bg-background p-0.5 shadow-sm"
        role="radiogroup"
        aria-label="Filter links by environment"
        title="Filter links by environment (Production/Staging/Development)"
      >
        {environmentOrder.map(env => {
          const color = environmentColors[env]
          const label = environmentLabels[env]

          if (!color || !label) return null

          return (
            <EnvironmentButton
              key={env}
              environment={env}
              isActive={currentEnvironment === env}
              onClick={() => handleEnvironmentSwitch(env)}
              color={color}
              label={getAbbreviation(env, environmentLabels)}
            />
          )
        })}
      </div>

      <AlertDialog
        open={!!pendingEnvironment && !hasSeenEnvironmentWarning}
        onOpenChange={() => setPendingEnvironment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Links Environment View?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to view links from the{' '}
              {pendingEnvironment
                ? environmentLabels[pendingEnvironment]?.toLowerCase()
                : ''}{' '}
              environment?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitch}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
