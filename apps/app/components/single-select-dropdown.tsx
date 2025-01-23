'use client'

import { useEffect, useState } from 'react'

import { ListFilterIcon } from 'lucide-react'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'

interface SingleSelectDropdownProps {
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
  title: string
  selectedEnvironment: string // Add this prop
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  options,
  onSelect,
  title,
  selectedEnvironment
}) => {
  const [selectedOption, setSelectedOption] =
    useState<string>(selectedEnvironment) // Initialize with selectedEnvironment

  useEffect(() => {
    setSelectedOption(selectedEnvironment) // Sync state when selectedEnvironment changes
  }, [selectedEnvironment])

  const handleSelect = (value: string) => {
    setSelectedOption(value)
    onSelect(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
          <ListFilterIcon className="h-3.5 w-3.5" />
          <span>
            {title}:{' '}
            {options.find(option => option.value === selectedOption)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedOption === option.value}
            onCheckedChange={() => handleSelect(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
