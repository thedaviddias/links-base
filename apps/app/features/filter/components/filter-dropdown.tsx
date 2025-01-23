'use client'

import { type KeyboardEvent, useMemo, useRef, useState } from 'react'

import { ChevronDown, Filter, Search } from 'lucide-react'

import { type FilterOption } from '@/features/filter/types/filters'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import { Input } from '@links-base/ui/input'

interface FilterDropdownProps<T> {
  options: FilterOption[]
  selectedFilters: T[]
  onToggleFilter: (value: T) => void
  onReset: () => void
  filterTitle: string
  buttonLabel?: string
  category?: string
}

const SEARCH_THRESHOLD = 7

export function FilterDropdown<T>(props: FilterDropdownProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const optionsRef = useRef<HTMLDivElement>(null)

  const showSearch = props.options.length > SEARCH_THRESHOLD

  const filteredOptions = useMemo(() => {
    let options = props.options

    if (props.category) {
      options = options.filter(option => option.label === props.category)
    }

    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [props.options, props.category, searchQuery])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    switch (e.key) {
      case 'Escape':
        setOpen(false)
        setSearchQuery('')
        setFocusedIndex(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        // Scroll into view if needed
        if (optionsRef.current) {
          const item = optionsRef.current.children[focusedIndex + 1]
          item?.scrollIntoView({ block: 'nearest' })
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
        // Scroll into view if needed
        if (optionsRef.current) {
          const item = optionsRef.current.children[focusedIndex - 1]
          item?.scrollIntoView({ block: 'nearest' })
        }
        break
      case 'Tab':
        e.preventDefault()
        if (e.shiftKey) {
          setFocusedIndex(prev =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          )
        } else {
          setFocusedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          )
        }
        break
      case 'Enter':
      case ' ': // Space key
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          props.onToggleFilter(filteredOptions[focusedIndex].id as T)
        }
        break
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSearchQuery('')
    setFocusedIndex(-1)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 px-3">
          <Filter className="mr-2 h-4 w-4" />
          {props.buttonLabel}
          {props.selectedFilters.length > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {props.selectedFilters.length}
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-[300px] w-[200px]"
        onCloseAutoFocus={e => {
          e.preventDefault()
        }}
        onEscapeKeyDown={handleClose}
        onInteractOutside={handleClose}
      >
        <div className="sticky top-0 z-50 bg-background">
          <DropdownMenuLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span>{props.filterTitle}</span>
            </div>
            {props.selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  props.onReset()
                  handleClose()
                }}
              >
                Reset
              </Button>
            )}
          </DropdownMenuLabel>
          {showSearch && (
            <div className="px-2 py-2">
              <div
                className="flex items-center gap-2 rounded-md border bg-muted px-2"
                onClick={e => e.stopPropagation()}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setFocusedIndex(-1) // Reset focus when searching
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="h-8 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          )}
          <DropdownMenuSeparator />
        </div>
        <div ref={optionsRef} className="max-h-[200px] overflow-y-auto">
          {props.options.length > 0 ? (
            props.options.map((option, index) => {
              const Icon = option.icon
              return (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={props.selectedFilters.includes(option.id as T)}
                  onCheckedChange={() => props.onToggleFilter(option.id as T)}
                  className={`gap-2 ${focusedIndex === index ? 'bg-accent' : ''}`}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onFocus={() => setFocusedIndex(index)}
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  <span className="flex-grow">{option.label}</span>
                </DropdownMenuCheckboxItem>
              )
            })
          ) : (
            <div className="px-2 py-2 text-center text-sm text-muted-foreground">
              No tags found
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
