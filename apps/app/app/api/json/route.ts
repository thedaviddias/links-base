import { NextResponse } from 'next/server'

import { promises as fs } from 'fs'
import path from 'path'

import { type Category } from '@/features/links/types/category.types'
import { type LinksApp } from '@/features/links/types/link.types'
import { type Tag } from '@/features/links/types/tag.types'
import { type Settings } from '@/features/settings/types/settings.types'

const REQUIRED_FILES = [
  'categories.json',
  'links.json',
  'tags.json',
  'settings.json'
] as const

type JsonData = {
  'categories.json': Category[] | null
  'links.json': LinksApp[] | null
  'tags.json': Tag[] | null
  'settings.json': Settings | null
}

/**
 * Gets the template filename for a given data file
 */
const getTemplateFileName = (fileName: string): string => {
  const baseName = fileName.replace('.json', '')
  return `${baseName}.template.json`
}

/**
 * Gets initial content for a file based on whether to use template
 */
const getInitialContent = async (
  fileName: string,
  useTemplate: boolean,
  templateDir: string
): Promise<string> => {
  const templatePath = path.join(templateDir, getTemplateFileName(fileName))
  const templateContent = await fs.readFile(templatePath, 'utf-8')

  if (useTemplate) {
    return templateContent
  }

  // Return empty arrays for data files when starting fresh
  switch (fileName) {
    case 'links.json':
    case 'tags.json':
    case 'categories.json': {
      return '[]'
    }
    case 'settings.json': {
      const settings = JSON.parse(templateContent)
      // Keep the structure but reset user-specific values
      settings.general = {
        ...settings.general,
        name: '',
        title: '',
        description: '',
        bannerText: ''
      }
      // Keep all other template settings as they are defaults
      return JSON.stringify(settings, null, 2)
    }
    default: {
      throw new Error(`Unknown file: ${fileName}`)
    }
  }
}

/**
 * Reads or initializes a JSON file
 */
const getOrCreateFile = async (
  fileName: string,
  dataDir: string,
  templateDir: string,
  useTemplate = true
): Promise<any> => {
  const filePath = path.join(dataDir, fileName)

  try {
    // Try to read existing file first
    const content = await fs.readFile(filePath, 'utf8')
    return JSON.parse(content)
  } catch {
    // If file doesn't exist, initialize with appropriate content
    const content = await getInitialContent(fileName, useTemplate, templateDir)
    await fs.writeFile(filePath, content)
    return JSON.parse(content)
  }
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'public', 'data')
    await fs.mkdir(dataDir, { recursive: true })

    const data = {} as JsonData

    for (const file of REQUIRED_FILES) {
      data[file] = await getOrCreateFile(
        file,
        dataDir,
        path.join(process.cwd(), 'public', 'templates')
      )
    }

    return NextResponse.json({
      data,
      hasRequiredFiles: Object.values(data).every(value => value !== null)
    })
  } catch (error) {
    console.error('Failed to process JSON files:', error)
    return NextResponse.json(
      { error: 'Failed to process JSON files' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { useTemplate = false } = await request.json()
    const dataDir = path.join(process.cwd(), 'public', 'data')
    const templateDir = path.join(process.cwd(), 'public', 'templates')

    await fs.mkdir(dataDir, { recursive: true })

    // Initialize all files
    for (const file of REQUIRED_FILES) {
      await getOrCreateFile(file, dataDir, templateDir, useTemplate)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to initialize files:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize files' },
      { status: 500 }
    )
  }
}
