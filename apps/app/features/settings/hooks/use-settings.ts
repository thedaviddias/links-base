'use client'

import { useEffect, useState } from 'react'

import { getSettingsApiRoute, getSettingsPath } from '@/constants/routes'
import { type Settings } from '@/features/settings/types/settings.types'

import { useToast } from '@links-base/ui/hooks'

interface UseSettingsOptions {
  suppressErrors?: boolean
}

export const useSettings = (options: UseSettingsOptions = {}) => {
  const { toast } = useToast()

  const [settings, setSettings] = useState<Settings>()

  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch settings from the API
   */
  const fetchSettings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(getSettingsPath())

      if (!response.ok) throw new Error('Failed to fetch settings')

      const data = await response.json()
      setSettings(data)
      return data
    } catch (error) {
      const errorMessage = 'There was an error loading the settings.'
      setError(errorMessage)
      console.error('Error fetching settings:', error)

      if (!options.suppressErrors) {
        toast({
          title: 'Failed to load settings',
          description: errorMessage,
          variant: 'destructive'
        })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Settings) => {
    try {
      const response = await fetch(getSettingsApiRoute(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })

      if (!response.ok) throw new Error('Failed to update settings')

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      toast({
        title: 'Settings updated successfully',
        description: 'Your changes have been saved.'
      })
      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: 'Failed to update settings',
        description: 'There was an error saving your changes.',
        variant: 'destructive'
      })
      return false
    }
  }

  const deleteSettings = async () => {
    try {
      const response = await fetch(getSettingsApiRoute(), { method: 'DELETE' })

      if (!response.ok) throw new Error('Failed to delete settings')

      setSettings(undefined)
      toast({
        title: 'Data deleted successfully',
        description: 'All data has been deleted successfully.'
      })
      return true
    } catch (error) {
      console.error('Error deleting data:', error)
      toast({
        title: 'Failed to delete data',
        description: 'There was an error deleting the data.',
        variant: 'destructive'
      })
      return false
    }
  }

  // Fetch settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        await fetchSettings()
      } catch (error) {
        if (!options.suppressErrors) {
          toast({
            title: 'Failed to load settings',
            description: 'There was an error loading the settings.',
            variant: 'destructive'
          })
        }
      }
    }

    void loadSettings()
  }, [options.suppressErrors])

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    deleteSettings,
    refreshSettings: fetchSettings
  }
}
