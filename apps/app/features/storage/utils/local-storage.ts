import { CONFIG_KEYS, STORAGE_KEYS } from '@/constants/storage'
import { useLinkClickStore } from '@/features/links/stores/use-link-click-store'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

type ConfigType = 'all' | 'preferences' | 'links' | 'analytics'

interface StorageConfig {
  type: ConfigType
  data: Record<string, any>
  timestamp: string
  version: string
}

type StorageKey = keyof typeof STORAGE_KEYS

/**
 * Gets localStorage items based on the specified configuration type
 */
export const exportLocalStorageConfig = (
  configType: ConfigType = 'all'
): StorageConfig => {
  const config: Record<string, any> = {}

  const getAllowedKeys = (type: ConfigType): StorageKey[] => {
    if (type === 'all') {
      return Object.keys(STORAGE_KEYS) as StorageKey[]
    }
    return Array.from(CONFIG_KEYS[type]).map(key =>
      key.toUpperCase().replace(/-/g, '_')
    ) as StorageKey[]
  }

  const keys = getAllowedKeys(configType)

  keys.forEach(key => {
    try {
      const value = localStorage.getItem(STORAGE_KEYS[key])
      if (value) {
        config[STORAGE_KEYS[key]] = JSON.parse(value)
      }
    } catch (error) {
      console.error(`Error parsing localStorage item: ${key}`, error)
    }
  })

  return {
    type: configType,
    data: config,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
}

/**
 * Imports configuration into localStorage
 */
interface ImportResult {
  success: boolean
  status: {
    success: string[]
    failed: string[]
    skipped: string[]
  }
}

export const importLocalStorageConfig = (
  config: StorageConfig
): ImportResult => {
  const status = {
    success: [] as string[],
    failed: [] as string[],
    skipped: [] as string[]
  }

  try {
    if (!config.type || !config.data || !config.version) {
      throw new Error('Invalid configuration format')
    }

    const allowedKeys =
      config.type === 'all'
        ? Object.values(STORAGE_KEYS)
        : CONFIG_KEYS[config.type].map(
            key =>
              STORAGE_KEYS[
                key
                  .toUpperCase()
                  .replace(/-/g, '_') as keyof typeof STORAGE_KEYS
              ]
          )

    Object.entries(config.data).forEach(([key, value]) => {
      try {
        if (!(key in STORAGE_KEYS)) {
          status.skipped.push(`${key} (not a valid storage key)`)
        } else if (
          !allowedKeys.includes(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS])
        ) {
          status.skipped.push(`${key} (not in selected configuration type)`)
        } else {
          localStorage.setItem(key, JSON.stringify(value))
          status.success.push(key)
        }
      } catch (error) {
        status.failed.push(
          `${key} (${error instanceof Error ? error.message : 'Unknown error'})`
        )
      }
    })

    return {
      success: status.failed.length === 0,
      status
    }
  } catch (error) {
    return {
      success: false,
      status: {
        success: [],
        failed: [error instanceof Error ? error.message : 'Unknown error'],
        skipped: []
      }
    }
  }
}

/**
 * Downloads the configuration as a JSON file
 */
export const downloadConfig = (configType: ConfigType = 'all') => {
  const config = exportLocalStorageConfig(configType)
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)

  const filename = `links-${configType}-config.json`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Resets specified configuration in localStorage
 */
export const resetLocalStorageConfig = (configType: ConfigType = 'all') => {
  try {
    if (configType === 'all') {
      localStorage.clear()
      useLinkClickStore.getState().resetClickCounts()
      useUserSettingsStore.getState().resetToDefaults()
      return true
    }

    const keysToReset = CONFIG_KEYS[configType] || []
    keysToReset.forEach(key => {
      localStorage.removeItem(key)

      // Handle specific Zustand store resets
      if (key === STORAGE_KEYS.LINK_CLICKS) {
        useLinkClickStore.getState().resetClickCounts()
      }
      if (key === STORAGE_KEYS.USER_SETTINGS) {
        useUserSettingsStore.getState().resetToDefaults()
      }
    })

    return true
  } catch (error) {
    console.error('Error resetting configuration:', error)
    return false
  }
}

/**
 * Get a value from local storage
 */
export const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null

  const item = window.localStorage.getItem(key)
  if (!item) return null

  try {
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

/**
 * Set a value in local storage
 */
export const setInStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Clear a value from local storage
 */
export const clearFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(key)
}
