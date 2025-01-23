'use client'

import { SearchIcon } from 'lucide-react'

import { useCommandStore } from '@/features/search/stores/use-command-store'

import { Button } from '@links-base/ui/button'
import { useIsMobile } from '@links-base/ui/hooks'

export const SearchBarButton = () => {
  return (
    <kbd
      className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100"
      role="textbox"
      aria-label="keyboard shortcut"
    >
      <span className="text-xs">⌘</span>K
    </kbd>
  )
}

export const SearchBar = () => {
  const { setOpen: setCommandOpen } = useCommandStore()
  const isMobile = useIsMobile()

  const handleClick = () => {
    setCommandOpen(true)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={'w-full gap-2'}
        onClick={handleClick}
      >
        <SearchIcon className={'mr-2 h-4 w-4'} aria-label="search icon" />
        {!isMobile && <span>Search</span>}
        <SearchBarButton />
      </Button>
    </div>
  )
}
