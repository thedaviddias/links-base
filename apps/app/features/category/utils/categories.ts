import { DEFAULT_CATEGORY } from '@/constants'
import { type Category } from '@/features/links/types/category.types'
import { getCategories } from '@/features/setup/utils/load-json-data'

/**
 * Returns a Set of category names in lowercase
 */
export const getCategoryNames = async (): Promise<Set<string>> => {
  const categories = await getCategories()

  return new Set([
    DEFAULT_CATEGORY,
    ...(categories?.map(cat => cat.name.toLowerCase()) || [])
  ])
}

/**
 * Returns all valid categories
 */
export const getValidCategories = async (): Promise<Category[]> => {
  const categories = await getCategories()
  return categories || []
}

/**
 * Validates if a category name exists
 */
export const isCategoryValid = async (
  categoryName: string
): Promise<boolean> => {
  const categoryNames = await getCategoryNames()
  return categoryNames.has(categoryName.toLowerCase())
}

/**
 * Returns a category by its slug
 */
export const getCategoryBySlug = async (slug: string) => {
  const categories = await getCategories()
  return categories?.find(category => category.name === slug) || null
}

// Synchronous versions with default values
export const getDefaultCategoryNames = (): Set<string> => {
  return new Set([DEFAULT_CATEGORY])
}

export const getDefaultCategories = (): Category[] => {
  return []
}
