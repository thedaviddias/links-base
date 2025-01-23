import { writeFile } from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import settingsTemplate from '@/public/templates/settings.template.json'

import {
  type InferSettingsSchema,
  SettingsSchema
} from '@/features/settings/schemas/settings.schema'
import { getSettingsJson } from '@/features/setup/utils/load-json-data'

// Custom errors
export class SettingsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SettingsError'
  }
}

export const settingsFilePath = path.join(
  process.cwd(),
  'public',
  'data',
  'settings.json'
)

/**
 * Retrieves settings from the JSON file
 * @returns {Promise<Settings>} Settings object
 * @throws {SettingsError} If there's an error reading the file
 */
export async function getSettings(): Promise<InferSettingsSchema> {
  try {
    const settings = await getSettingsJson()

    if (!settings) {
      return SettingsSchema.parse(settingsTemplate)
    }

    return SettingsSchema.parse(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors)
      throw new SettingsError('Invalid data format in settings file')
    }
    console.error('Error reading settings:', error)
    throw new SettingsError('Failed to read settings')
  }
}

/**
 * Updates the settings
 * @param {Settings} settings - New settings to save
 * @throws {SettingsError} If there's an error saving the file
 */
export async function updateSettings(
  settings: InferSettingsSchema
): Promise<InferSettingsSchema> {
  try {
    SettingsSchema.parse(settings)
    const data = JSON.stringify(settings, null, 2)
    await writeFile(settingsFilePath, data)
    return settings
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new SettingsError('Invalid settings data format')
    }
    throw new SettingsError('Failed to save settings')
  }
}
