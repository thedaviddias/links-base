import { getJsonApiRoute } from '@/constants/routes'

/**
 * Hook for managing template operations during setup
 */
export const useTemplate = () => {
  /**
   * Applies the template choice by initializing files
   */
  const applyTemplateChoice = async (useTemplate: boolean) => {
    try {
      const response = await fetch(getJsonApiRoute(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ useTemplate })
      })

      if (!response.ok) {
        throw new Error('Failed to apply template choice')
      }

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Error applying template choice:', error)
      return false
    }
  }

  return {
    applyTemplateChoice
  }
}
