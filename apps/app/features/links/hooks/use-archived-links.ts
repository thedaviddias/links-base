import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useLocalStorage } from 'usehooks-ts'

import { toast } from '@links-base/ui/hooks'

import { useVisibilitySettings } from './links/use-visibility-settings'

export const useArchivedLinks = () => {
  const [archivedLinks, setArchivedLinks] = useLocalStorage<string[]>(
    'archivedLinks',
    []
  )
  const { setShowArchived } = useVisibilitySettings()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const toggleArchived = (linkName: string) => {
    setArchivedLinks(prev => {
      const isArchiving = !prev.includes(linkName)
      const newArchivedLinks = isArchiving
        ? [...prev, linkName]
        : prev.filter(name => name !== linkName)

      // If we're archiving a new link, always ensure archived links are hidden
      if (isArchiving) {
        setShowArchived(false)
        // Update URL to hide archived links
        const params = new URLSearchParams(searchParams.toString())
        params.delete('archived')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }

      return newArchivedLinks
    })
  }

  const isArchived = (linkName: string) => {
    return archivedLinks.includes(linkName)
  }

  const unarchiveAll = () => {
    setArchivedLinks([])

    // Hide archived view
    setShowArchived(false)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('archived')
    params.delete('archivedLinks')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })

    // Show toast
    toast({
      title: 'All links unarchived',
      description: `${archivedLinks.length} links have been restored`
    })
  }

  const getArchivedLinks = () => {
    return archivedLinks
  }

  return {
    archivedLinks,
    toggleArchived,
    isArchived,
    unarchiveAll,
    getArchivedLinks
  }
}
