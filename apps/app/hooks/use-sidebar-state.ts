import { useEffect, useState } from 'react'

import { STORAGE_KEYS } from '@/constants/storage'

/**
 * A custom hook to manage the sidebar open state, persisting it in localStorage.
 * @returns An object with the `open` state and a `setOpen` function to update it.
 */
export const useSidebarState = () => {
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const storedOpen = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE)
    if (storedOpen !== null) {
      setOpen(JSON.parse(storedOpen))
    } else {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open !== null) {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(open))
    }
  }, [open])

  return { open, setOpen }
}
