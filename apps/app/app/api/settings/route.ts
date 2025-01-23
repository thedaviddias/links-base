import { NextResponse } from 'next/server'

import { readdir, unlink } from 'fs/promises'
import { join } from 'path'

import { SettingsSchema } from '@/features/settings/schemas/settings.schema'
import { type Settings } from '@/features/settings/types/settings.types'
import {
  getSettings,
  updateSettings
} from '@/features/settings/utils/manage-settings'

export async function GET() {
  try {
    const settings = await getSettings()

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error reading settings:', error)
    return NextResponse.json(
      { error: 'Failed to read settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const newSettings: Settings = await request.json()

    // Validate the settings against the schema
    const validatedSettings = SettingsSchema.parse(newSettings)

    // Write the validated settings to the file
    await updateSettings(validatedSettings)

    return NextResponse.json(validatedSettings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const dataDir = join(process.cwd(), 'public', 'data')
    const files = await readdir(dataDir)

    // Delete each file in the directory
    await Promise.all(files.map(file => unlink(join(dataDir, file))))

    return NextResponse.json({ message: 'Data deleted successfully' })
  } catch (error) {
    console.error('Error deleting data:', error)
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    )
  }
}
