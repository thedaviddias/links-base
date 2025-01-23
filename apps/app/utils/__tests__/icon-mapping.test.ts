import * as LucideIcons from 'lucide-react'

import { CATEGORY_ICON_MAPPINGS } from '@/features/links/constants/icon-mappings'

import {
  getAvailableIconNames,
  getIconComponent,
  getRelatedIcons,
  suggestIconForCategory
} from '../icon-mapping'

// Mock Lucide Icons
jest.mock('lucide-react', () => ({
  Folder: jest.fn(),
  Home: jest.fn(),
  Settings: jest.fn()
}))

describe('iconMapping', () => {
  it('iconMapping should render correctly', () => {
    expect(getAvailableIconNames).toBeDefined()
    expect(suggestIconForCategory).toBeDefined()
    expect(getIconComponent).toBeDefined()
    expect(getRelatedIcons).toBeDefined()
  })

  describe('getAvailableIconNames', () => {
    it('should return array of valid icon names', () => {
      const result = getAvailableIconNames()

      expect(result).toEqual(['folder', 'home', 'settings'])

      expect(result).not.toContain('createLucideIcon')
    })
  })

  describe('suggestIconForCategory', () => {
    it('should return matching icon from category mappings', () => {
      // Mock a category mapping
      const mockCategoryMappings = {
        development: ['Code', 'Terminal']
      }
      jest.mock('@/features/links/constants/icon-mappings', () => ({
        CATEGORY_ICON_MAPPINGS: mockCategoryMappings,
        SEARCH_TERM_ICON_MAPPINGS: {}
      }))

      const result = suggestIconForCategory('Development Tools')
      expect(result).toBe(CATEGORY_ICON_MAPPINGS.development[0])
    })

    it('should return Folder icon when no match is found', () => {
      const result = suggestIconForCategory('NonexistentCategory')
      expect(result).toBe('Folder')
    })

    it('should be case insensitive', () => {
      const result = suggestIconForCategory('DEVELOPMENT')
      expect(result).toBe(CATEGORY_ICON_MAPPINGS.development[0])
    })
  })

  describe('getIconComponent', () => {
    it('should return correct icon component when icon exists', () => {
      const result = getIconComponent('Home')
      expect(result).toBe(LucideIcons.Home)
    })

    it('should return Folder icon when icon does not exist', () => {
      const result = getIconComponent('NonexistentIcon')
      expect(result).toBe(LucideIcons.Folder)
    })
  })

  describe('getRelatedIcons', () => {
    it('should return related icons from category mappings', () => {
      const mockCategoryMappings = {
        development: ['Code', 'Terminal']
      }
      jest.mock('@/features/links/constants/icon-mappings', () => ({
        CATEGORY_ICON_MAPPINGS: mockCategoryMappings,
        SEARCH_TERM_ICON_MAPPINGS: {}
      }))

      const result = getRelatedIcons('dev')
      expect(result).toContain(CATEGORY_ICON_MAPPINGS.development[0])
      expect(result).toContain(CATEGORY_ICON_MAPPINGS.development[1])
    })

    it('should return empty array when no matches found', () => {
      const result = getRelatedIcons('nonexistent')
      expect(result).toEqual([])
    })

    it('should be case insensitive', () => {
      const result = getRelatedIcons('DEV')
      expect(result).toContain(CATEGORY_ICON_MAPPINGS.development[0])
    })

    it('should return unique icons when same icon appears in multiple matches', () => {
      const mockMappings = {
        dev: ['Code', 'Terminal'],
        development: ['Code', 'Git']
      }
      jest.mock('@/features/links/constants/icon-mappings', () => ({
        CATEGORY_ICON_MAPPINGS: mockMappings,
        SEARCH_TERM_ICON_MAPPINGS: {}
      }))

      const result = getRelatedIcons('dev')
      const uniqueResults = new Set(result)
      expect(result.length).toBe(uniqueResults.size)
    })
  })
})
