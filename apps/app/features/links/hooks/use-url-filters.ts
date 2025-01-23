import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface UseUrlFiltersReturn {
  urlHiddenCategories: string[]
  urlSelectedTags: string[]
  updateUrlParams: (updates: Record<string, string | null>) => void
  handleToggleTag: (tag: string) => void
  handleReset: () => void
}

/** Hook to manage URL parameters for filtering */
export const useUrlFilters = (): UseUrlFiltersReturn => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const urlHiddenCategories =
    searchParams.get('hidden')?.split(',').filter(Boolean) || []
  const urlSelectedTags =
    searchParams.get('tags')?.split(',').filter(Boolean) || []

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

  const handleToggleTag = (tag: string) => {
    const newTags = urlSelectedTags.includes(tag)
      ? urlSelectedTags.filter(t => t !== tag)
      : [...urlSelectedTags, tag]

    updateUrlParams({
      tags: newTags.length ? newTags.join(',') : null
    })
  }

  const handleReset = () => {
    updateUrlParams({
      tags: null,
      hidden: null,
      archived: null
    })
  }

  return {
    urlHiddenCategories,
    urlSelectedTags,
    updateUrlParams,
    handleToggleTag,
    handleReset
  }
}
