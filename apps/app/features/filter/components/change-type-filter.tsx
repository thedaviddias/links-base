'use client'

import { type FC } from 'react'

import { CHANGE_TYPES } from '@/features/filter/constants/filters'
import { useChangeTypeFilter } from '@/features/filter/hooks/useChangeTypeFilter'

import { FilterDropdown } from './filter-dropdown'

export const ChangeTypeFilter: FC = () => {
  const { selectedTypes, toggleType, reset } = useChangeTypeFilter()

  return (
    <FilterDropdown
      options={CHANGE_TYPES}
      selectedFilters={selectedTypes}
      onToggleFilter={toggleType}
      onReset={reset}
      filterTitle="Change Types"
      buttonLabel="Filter Changes"
    />
  )
}
