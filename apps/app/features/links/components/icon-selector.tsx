'use client'

import { useState } from 'react'

import {
  getAvailableIconNames,
  getIconComponent,
  getRelatedIcons
} from '@/utils/icon-mapping'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@links-base/ui/dialog'
import { Input } from '@links-base/ui/input'

export interface IconSelectorProps {
  onIconSelect: (iconName: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function IconSelector({
  onIconSelect,
  open,
  onOpenChange
}: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const iconNames = getAvailableIconNames()
  const filteredIcons = searchTerm
    ? Array.from(
        new Set([
          ...getRelatedIcons(searchTerm),
          ...iconNames.filter(iconName => {
            const searchLower = searchTerm.toLowerCase()
            const nameLower = iconName.toLowerCase()

            // Convert camelCase to space-separated words for searching
            const searchableText = iconName
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()

            return (
              nameLower.includes(searchLower) ||
              searchableText.includes(searchLower)
            )
          })
        ])
      )
    : iconNames

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select an icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search icons... (e.g., 'home', 'user', 'settings')"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-4"
            autoComplete="off"
            autoFocus
          />
          <div className="grid max-h-[60vh] grid-cols-6 gap-2 overflow-y-auto p-1">
            {filteredIcons.length > 0 ? (
              filteredIcons.map(iconName => {
                const Icon = getIconComponent(iconName)
                return (
                  <Button
                    key={iconName}
                    variant="outline"
                    className="group flex aspect-square h-auto flex-col items-center justify-center gap-2 p-4 hover:bg-accent"
                    onClick={() => {
                      onIconSelect(iconName)
                    }}
                    title={iconName}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="line-clamp-1 text-[10px] text-muted-foreground group-hover:text-accent-foreground">
                      {iconName}
                    </span>
                  </Button>
                )
              })
            ) : (
              <div className="col-span-6 py-8 text-center text-muted-foreground">
                No icons found for &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
