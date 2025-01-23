import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

import { getLinksPath } from '@/constants/routes'
import { LinkSchema } from '@/features/links/schemas/link.schema'
import { type LinksApp } from '@/features/links/types/link.types'

// Custom errors
export class LinkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LinkError'
  }
}

export const linksPath = path.join(
  process.cwd(),
  'public',
  'data',
  'links.json'
)

/**
 * Retrieves all links from the JSON file
 * @returns {Promise<LinksApp[]>} Array of links
 * @throws {LinkError} If there's an error reading the file
 */
export async function getLinks(): Promise<LinksApp[]> {
  try {
    const response = await fetch(getLinksPath())

    if (!response.ok) {
      throw new Error('Failed to fetch links')
    }

    const parsed = await response.json()

    // Validate entire array
    const validated = z.array(LinkSchema).parse(parsed)

    return validated.map(link => ({
      ...link,
      createdAt: link.createdAt || new Date().toISOString(),
      timestamp: link.timestamp || new Date().toISOString()
    }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors)
      throw new LinkError('Invalid data format in links file')
    }

    console.error('Error reading links:', error)
    return []
  }
}

/**
 * Saves links to the JSON file
 * @param {LinksApp[]} links - Array of links to save
 * @throws {LinkError} If there's an error saving the file
 */
export async function saveLinks(links: LinksApp[]): Promise<void> {
  try {
    // Validate before saving
    z.array(LinkSchema).parse(links)

    const data = JSON.stringify(links, null, 2)

    await fs.writeFile(linksPath, data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new LinkError('Invalid link data format')
    }
    throw new LinkError('Failed to save links')
  }
}

/**
 * Adds a new link to the storage
 * @param {LinksApp} link - Link to add
 * @throws {LinkError} If the link is invalid or if there's an error saving
 */
export async function addLink(link: LinksApp): Promise<LinksApp> {
  try {
    // Validate new link
    LinkSchema.parse(link)
    const links = await getLinks()

    // Check for duplicate names
    if (links.some(l => l.name === link.name)) {
      throw new LinkError(`Link with name "${link.name}" already exists`)
    }

    links.push(link)

    await saveLinks(links)

    return link
  } catch (error) {
    if (error instanceof LinkError) throw error
    throw new LinkError('Failed to add link')
  }
}

/**
 * Edits a link's name
 * @param {string} linkName - Current name of the link
 * @param {Partial<LinksApp>} updatedLink - New name for the link
 * @throws {LinkError} If the link doesn't exist or if there's an error saving
 */
export async function editLink(
  linkName: string,
  updatedLink: Partial<LinksApp>
): Promise<void> {
  try {
    const links = await getLinks()
    const linkToUpdate = links.find(l => l.name === linkName)

    if (!linkToUpdate) {
      throw new LinkError(`Link "${linkName}" not found`)
    }

    // Check if new name already exists (excluding the current link)
    if (
      updatedLink.name !== linkName &&
      links.some(l => l.name === updatedLink.name)
    ) {
      throw new LinkError(`Link with name "${updatedLink.name}" already exists`)
    }

    const updatedLinks = links.map(l =>
      l.name === linkName ? { ...linkToUpdate, ...updatedLink } : l
    )

    await saveLinks(updatedLinks)
  } catch (error) {
    console.error('Edit link error:', error)
    if (error instanceof LinkError) throw error
    throw new LinkError('Failed to edit link')
  }
}

/**
 * Deletes a link by name
 * @param {string} name - Name of the link to delete
 * @throws {LinkError} If the link doesn't exist or if there's an error saving
 */
export async function deleteLink(name: string): Promise<void> {
  try {
    const links = await getLinks()
    const updatedLinks = links.filter(link => link.name !== name)

    if (updatedLinks.length === links.length) {
      throw new LinkError(`Link "${name}" not found`)
    }

    await saveLinks(updatedLinks)
  } catch (error) {
    if (error instanceof LinkError) {
      throw new LinkError('Failed to delete link')
    }

    throw error
  }
}
