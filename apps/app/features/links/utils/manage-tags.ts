import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

import {
  type InferTagSchema,
  TagSchema
} from '@/features/links/schemas/tag.schema'

// Custom errors
export class TagError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TagError'
  }
}

export const tagsFilePath = path.join(
  process.cwd(),
  'public',
  'data',
  'tags.json'
)

/**
 * Retrieves all tags from the JSON file
 * @returns {Promise<Tag[]>} Array of tags
 * @throws {TagError} If there's an error reading the file
 */
export async function getAllTags(): Promise<InferTagSchema[]> {
  try {
    const data = await fs.readFile(tagsFilePath, 'utf8')
    const parsed = JSON.parse(data)
    return z.array(TagSchema).parse(parsed)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new TagError('Invalid data format in tags file')
    }
    console.error('Error reading tags:', error)
    return []
  }
}

/**
 * Saves tags to the JSON file
 * @param {Tag[]} tags - Array of tags to save
 * @throws {TagError} If there's an error saving the file
 */
async function saveTags(tags: InferTagSchema[]): Promise<void> {
  try {
    z.array(TagSchema).parse(tags)
    const data = JSON.stringify(tags, null, 2)
    await fs.writeFile(tagsFilePath, data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new TagError('Invalid tag data format')
    }
    throw new TagError('Failed to save tags')
  }
}

/**
 * Adds a new tag to the storage
 * @param {Tag} newTag - Tag to add
 * @returns {Promise<Tag>} Added tag
 * @throws {TagError} If the tag is invalid or if there's an error saving
 */
export async function addTag(newTag: InferTagSchema): Promise<InferTagSchema> {
  try {
    TagSchema.parse(newTag)
    const tags = await getAllTags()

    if (tags.some(tag => tag.name === newTag.name)) {
      throw new TagError(`Tag with name "${newTag.name}" already exists`)
    }

    tags.push(newTag)
    await saveTags(tags)

    return newTag
  } catch (error) {
    if (error instanceof TagError) {
      throw new TagError('Failed to add tag')
    }
    throw error
  }
}

/**
 * Updates an existing tag
 * @param {Tag} updatedTag - Tag with updated information
 * @returns {Promise<Tag>} Updated tag
 * @throws {TagError} If the tag doesn't exist or if there's an error saving
 */
export async function editTag(
  originalName: string,
  updatedTag: InferTagSchema
): Promise<InferTagSchema> {
  try {
    TagSchema.parse(updatedTag)
    const tags = await getAllTags()

    const index = tags.findIndex(tag => tag.name === originalName)

    if (index === -1) {
      throw new TagError(`Tag "${originalName}" not found`)
    }

    // Check if new name conflicts with existing tag (if name is being changed)
    if (
      originalName !== updatedTag.name &&
      tags.some(tag => tag.name === updatedTag.name)
    ) {
      throw new TagError(`Tag "${updatedTag.name}" already exists`)
    }

    tags[index] = updatedTag
    await saveTags(tags)
    return updatedTag
  } catch (error) {
    if (error instanceof TagError) {
      throw error // Pass through our custom errors
    }
    throw new TagError('Failed to update tag')
  }
}

/**
 * Deletes a tag by name
 * @param {string} name - Name of the tag to delete
 * @throws {TagError} If the tag doesn't exist or if there's an error saving
 */
export async function deleteTag(name: string): Promise<void> {
  try {
    const tags = await getAllTags()
    const updatedTags = tags.filter(tag => tag.name !== name)

    if (updatedTags.length === tags.length) {
      throw new TagError(`Tag "${name}" not found`)
    }

    await saveTags(updatedTags)
  } catch (error) {
    if (error instanceof TagError) {
      throw new TagError('Failed to delete tag')
    }

    throw error
  }
}
