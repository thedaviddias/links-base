import * as LucideIcons from 'lucide-react'

import {
  CATEGORY_ICON_MAPPINGS,
  SEARCH_TERM_ICON_MAPPINGS
} from '@/features/links/constants/icon-mappings'

// Type for valid icon names from Lucide
type LucideIconName = keyof typeof LucideIcons

/**
 * Validate if an icon name exists in Lucide Icons
 * @param iconName - The name of the icon to validate
 * @returns true if the icon exists, false otherwise
 */
export const getIconNames = (): string[] => {
  return Object.keys(LucideIcons).filter(key => {
    const icon = (LucideIcons as Record<string, any>)[key]
    return typeof icon === 'function' && key !== 'createLucideIcon'
  })
}

/**
 * Get a Lucide icon component by name
 * @param iconName - The name of the icon to get
 * @returns The icon component or Folder icon as fallback
 */
export const getIconComponent = (
  iconName: string | LucideIcons.LucideIcon
): LucideIcons.LucideIcon => {
  // If iconName is already a component, return it directly
  if (typeof iconName === 'function') {
    return iconName
  }

  if (!iconName || typeof iconName !== 'string') {
    console.warn('Invalid icon name:', iconName)
    return LucideIcons.Folder
  }

  // Remove quotes and convert to PascalCase
  const cleanName = iconName
    .replace(/['"]/g, '')
    .trim()
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

  // Try to get the icon component
  const Icon = (
    LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>
  )[cleanName]

  if (Icon) {
    return Icon
  }

  console.warn('Icon not found:', cleanName)
  return LucideIcons.Folder
}

/**
 * Get all available Lucide icon names
 * @returns Array of valid icon names
 */
export const getAvailableIconNames = (): string[] => {
  return Object.keys(LucideIcons)
    .filter(key => typeof LucideIcons[key as LucideIconName] === 'function')
    .map(name =>
      name.replace(/([A-Z])/g, match => `-${match.toLowerCase()}`).slice(1)
    )
}

export const suggestIconForCategory = (categoryName: string): string => {
  const lowercaseName = categoryName.toLowerCase()

  // First check exact category matches
  for (const [category, icons] of Object.entries(CATEGORY_ICON_MAPPINGS)) {
    if (lowercaseName.includes(category)) {
      return icons[0]
    }
  }

  // Then check search term matches
  for (const [term, icons] of Object.entries(SEARCH_TERM_ICON_MAPPINGS)) {
    if (lowercaseName.includes(term)) {
      return icons[0]
    }
  }

  return 'Folder' // Default icon
}

// Helper function to get related icons for a search term
export const getRelatedIcons = (searchTerm: string): string[] => {
  const term = searchTerm.toLowerCase()
  const relatedIcons = new Set<string>()

  // Check category mappings
  Object.entries(CATEGORY_ICON_MAPPINGS).forEach(([category, icons]) => {
    if (category.toLowerCase().includes(term)) {
      icons.forEach(icon => relatedIcons.add(icon))
    }
  })

  // Check search term mappings
  Object.entries(SEARCH_TERM_ICON_MAPPINGS).forEach(([searchKey, icons]) => {
    if (searchKey.toLowerCase().includes(term)) {
      icons.forEach(icon => relatedIcons.add(icon))
    }
  })

  return Array.from(relatedIcons)
}
