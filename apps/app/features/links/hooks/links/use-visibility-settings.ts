'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import { useLocalStorage } from 'usehooks-ts'

import { STORAGE_KEYS } from '@/constants/storage'

export const useVisibilitySettings = () => {
  const [localShowArchived, setLocalShowArchived] = useLocalStorage(
    STORAGE_KEYS.SHOW_ARCHIVED,
    false
  )
  const [showArchived, setShowArchived] = useState(false)
  const searchParams = useSearchParams()

  // URL parameter takes precedence over localStorage
  const urlShowArchived = searchParams.get('archived') === 'true'

  // Only update on mount and when URL/localStorage changes
  useEffect(() => {
    const shouldShow = urlShowArchived ?? localShowArchived
    if (showArchived !== shouldShow) {
      setShowArchived(shouldShow)
    }
  }, [urlShowArchived, localShowArchived])

  const updateShowArchived = (value: boolean) => {
    setLocalShowArchived(value)
    setShowArchived(value)
  }

  return {
    showArchived,
    setShowArchived: updateShowArchived
  }
}
