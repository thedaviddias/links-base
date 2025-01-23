import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

import { CategorySchema } from '@/features/links/schemas/category.schema'
import { type Category } from '@/features/links/types/category.types'

// Custom errors
export class CategoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CategoryError'
  }
}

export const categoriesPath = path.join(
  process.cwd(),
  'public',
  'data',
  'categories.json'
)

/**
 * Retrieves all categories from the JSON file
 * @returns {Promise<Category[]>} Array of categories
 * @throws {CategoryError} If there's an error reading the file
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await fs.readFile(categoriesPath, 'utf8')

    if (data.trim().length === 0) {
      console.warn('The category file is empty')
      return []
    }

    try {
      const parsedData = JSON.parse(data)

      // Sort categories alphabetically by name (case-insensitive)
      return parsedData.sort((a: Category, b: Category) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      )
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError)
      return []
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors)
      throw new CategoryError('Invalid data format in categories file')
    }
    console.error('Error reading category:', error)
    return []
  }
}

/**
 * Saves categories to the JSON file
 * @param {Category[]} category - Array of categories to save
 * @throws {CategoryError} If there's an error saving the file
 */
export async function saveCategories(category: Category[]): Promise<void> {
  try {
    const data = JSON.stringify(category, null, 2)
    await fs.writeFile(categoriesPath, data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new CategoryError('Invalid category data format')
    }
    throw new CategoryError('Failed to save categories')
  }
}

/**
 * Adds a new category to the storage
 * @param {Category} newCategory - Category to add
 * @returns {Promise<Category>} Added category
 * @throws {CategoryError} If the category is invalid or if there's an error saving
 */
export async function addCategory(category: Category): Promise<Category> {
  try {
    CategorySchema.parse(category)

    const categories = await getCategories()

    categories.push(category)
    await saveCategories(categories)

    return category
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new CategoryError('Invalid category data format')
    }
    throw new CategoryError('Failed to add category')
  }
}

export async function editCategory(
  oldName: string,
  newName: string,
  icon?: string,
  description?: string
): Promise<void> {
  try {
    if (!oldName?.trim() || !newName?.trim()) {
      throw new CategoryError('Invalid category name')
    }

    const categories = await getCategories()

    const categoryExists = categories.some(
      category => category.name === oldName
    )

    if (!categoryExists) {
      throw new CategoryError('Category not found')
    }

    const isDuplicate = categories.some(
      category => category.name === newName && category.name !== oldName
    )
    if (isDuplicate) {
      throw new CategoryError('A category with this name already exists')
    }

    const updatedCategories = categories.map((category: Category) => {
      if (category.name === oldName) {
        const updatedCategory = {
          ...category,
          name: newName,
          icon: icon || category.icon,
          description: description || category.description
        }

        // Validate the updated category
        CategorySchema.parse(updatedCategory)
        return updatedCategory
      }
      return category
    })

    await saveCategories(updatedCategories)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new CategoryError('Invalid category data format')
    }
    throw new CategoryError('Failed to edit category')
  }
}

/**
 * Deletes a category from the storage
 * @param {string} name - Name of the category to delete
 * @throws {CategoryError} If the category name is invalid
 */
export async function deleteCategory(name: string): Promise<void> {
  try {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new CategoryError('Invalid category name')
    }

    const categories = await getCategories()
    const updatedCategories = categories.filter(
      category => category.name !== name
    )
    await saveCategories(updatedCategories)
  } catch (error) {
    if (error instanceof CategoryError) {
      throw new CategoryError('Failed to delete category')
    }
    throw error
  }
}
