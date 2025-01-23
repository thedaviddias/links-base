'use client'

import * as React from 'react'

import { Input } from '@links-base/ui/input'

interface ListFiltersProps {
  onSearch?: (term: string) => void
  addButtonComponent?: React.ReactNode
  searchPlaceholder?: string
}

export const ListFilters = ({
  onSearch,
  addButtonComponent,
  searchPlaceholder = 'Search...'
}: ListFiltersProps) => {
  return (
    <div className="pb-5">
      <div className="flex items-center justify-between space-x-2">
        {onSearch && (
          <div className="relative">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              onChange={e => onSearch(e.target.value)}
            />
          </div>
        )}
        <div>{addButtonComponent}</div>
      </div>
    </div>
  )
}
