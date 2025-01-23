import { type Category } from '@/features/links/types/category.types'
import { type LinksApp } from '@/features/links/types/link.types'
import { type Tag } from '@/features/links/types/tag.types'
import { type Settings } from '@/features/settings/types/settings.types'

interface JsonDataMap {
  'categories.json': Category[]
  'links.json': LinksApp[]
  'tags.json': Tag[]
  'settings.json': Settings
}

/**
 * Safely loads JSON data with fallback values
 * Returns null if file doesn't exist (for setup wizard handling)
 */
export const loadJsonData = async <T extends keyof JsonDataMap>(
  filename: T
): Promise<JsonDataMap[T] | null> => {
  try {
    const response = await fetch(`/data/${filename}`)
    if (!response.ok) {
      return null
    }
    const data = await response.json()

    if (data === null) {
      return null
    }

    // For arrays, return empty array if invalid, for objects return empty object
    if (filename === 'settings.json') {
      return (typeof data === 'object' ? data : {}) as JsonDataMap[T]
    }

    return (Array.isArray(data) ? data : []) as JsonDataMap[T]
  } catch (error) {
    return null
  }
}

/**
 * Helper functions that return null if data isn't initialized yet
 */
export const getCategories = async () => loadJsonData('categories.json')
export const getTags = async () => loadJsonData('tags.json')
export const getLinks = async () => loadJsonData('links.json')
export const getSettingsJson = async () => loadJsonData('settings.json')

/**
 * Saves JSON data to a file
 */
export const saveJsonData = async <T extends keyof JsonDataMap>(
  filename: T,
  data: JsonDataMap[T]
): Promise<boolean> => {
  try {
    const response = await fetch('/api/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename,
        data
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to save ${filename}`)
    }

    return true
  } catch (error) {
    console.error(`Error saving ${filename}:`, error)
    return false
  }
}
