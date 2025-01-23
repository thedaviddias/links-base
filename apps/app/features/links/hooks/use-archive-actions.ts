'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useVisibilitySettings } from './links/use-visibility-settings'

import { useArchivedLinks } from './use-archived-links'

export const useArchiveActions = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { showArchived, setShowArchived } = useVisibilitySettings()
  const { toggleArchived, isArchived } = useArchivedLinks()

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleToggleArchived = (linkName: string) => {
    toggleArchived(linkName)
    // When archiving a new link, hide archived links
    if (!isArchived(linkName)) {
      setShowArchived(false)
      updateUrlParams({ archived: 'false' })
    }
  }

  return {
    showArchived,
    isArchived,
    handleToggleArchived
  }
}
