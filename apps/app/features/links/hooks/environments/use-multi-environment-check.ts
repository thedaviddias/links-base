import { useMemo } from 'react'

import { useLinks } from '../links/use-links'

/** Checks if there are any multi-environment links in the specified category */
export const useMultiEnvironmentCheck = (categoryId?: string) => {
  const { links } = useLinks()

  const filteredLinks = useMemo(() => {
    if (!categoryId) return links
    return links.filter(link => link.category === categoryId)
  }, [links, categoryId])

  const hasMultipleEnvironments = useMemo(() => {
    return filteredLinks.some(link => {
      const environments = link.environments || {}
      // Check if there are any non-production environments (staging or integration) with valid URLs
      return environments.staging || environments.integration
    })
  }, [filteredLinks])

  return {
    hasMultipleEnvironments
  }
}
