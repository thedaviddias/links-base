'use client'

import { Settings2 } from 'lucide-react'

import { useWarningPreferences } from '@/features/environment/hooks/useWarningPreferences'
import {
  type CardSize,
  useNonDefaultSettings,
  useUserSettingsStore
} from '@/features/user/stores/useUserSettingsStore'

import { Button } from '@links-base/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@links-base/ui/popover'
import { Separator } from '@links-base/ui/separator'

import { AdditionalFeatures } from './additional-features'
import { DisplayProperties } from './display-properties'
import { ResetOptions } from './reset-options'
import { ViewSelector } from './view-selector'

export const DisplayPreferences = () => {
  const {
    cardSize,
    showGradients,
    showFavorites,
    showTags,
    showDescriptions,
    showIcons,
    showEnvironmentBadges,
    setCardSize,
    setShowGradients,
    setShowFavorites,
    setShowTags,
    setShowDescriptions,
    setShowIcons,
    setShowEnvironmentBadges,
    resetToDefaults,
    previousDescriptionState,
    previousTagsState
  } = useUserSettingsStore()
  const { resetAllWarnings } = useWarningPreferences()
  const hasNonDefaultSettings = useNonDefaultSettings()

  const handleGradientToggle = (checked: boolean) => {
    setShowGradients(checked)
  }

  const handleViewChange = (value: CardSize) => {
    setCardSize(value)

    if (value === 'default') {
      setShowDescriptions(previousDescriptionState)
      setShowTags(previousTagsState)
    }

    if (value === 'compact') {
      setShowDescriptions(false)
      setShowTags(false)
    }
  }

  const displayProperties = [
    {
      id: 'icon',
      label: 'Icon',
      isEnabled: showIcons,
      onToggle: setShowIcons
    },
    {
      id: 'environment',
      label: 'Environment',
      isEnabled: showEnvironmentBadges,
      onToggle: setShowEnvironmentBadges
    },
    ...(cardSize === 'default'
      ? [
          {
            id: 'description',
            label: 'Description',
            isEnabled: showDescriptions,
            onToggle: setShowDescriptions
          },
          {
            id: 'tags',
            label: 'Tags',
            isEnabled: showTags,
            onToggle: setShowTags
          }
        ]
      : []),
    {
      id: 'gradients',
      label: 'Gradients',
      isEnabled: showGradients,
      onToggle: handleGradientToggle
    }
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          {hasNonDefaultSettings && (
            <span className="absolute right-0 top-0 flex h-2 w-2 -translate-y-1/4 translate-x-1/4">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
                data-testid="settings-indicator"
              ></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
          )}
          <Settings2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Display Preferences</h4>
            <p className="text-sm text-muted-foreground">
              Customize how your dashboard looks
            </p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="text-sm font-medium">Layout</div>
            <ViewSelector cardSize={cardSize} onViewChange={handleViewChange} />
          </div>
          <Separator />
          <DisplayProperties properties={displayProperties} />
          <Separator />
          <AdditionalFeatures
            showFavorites={showFavorites}
            onShowFavoritesChange={setShowFavorites}
          />
          <Separator />
          <ResetOptions
            onResetWarnings={resetAllWarnings}
            onResetDefaults={resetToDefaults}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
