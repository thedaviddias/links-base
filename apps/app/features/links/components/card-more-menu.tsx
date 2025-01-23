'use client'

import {
  Archive,
  ArchiveRestore,
  Copy,
  Info,
  Link as LinkIcon,
  MoreVertical,
  PinIcon
} from 'lucide-react'

import type { LinksApp } from '@/features/links/types/link.types'
import { formatLinkDetails } from '@/features/links/utils/format-link-details'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import { useToast } from '@links-base/ui/hooks'

interface CardMoreMenuProps {
  app: LinksApp
  handleAddToFavorites: () => void
  isArchived?: boolean
  onArchiveToggle: () => void
  onShowAccess: (e: React.MouseEvent) => void
  showManageOptions?: boolean
}

export function CardMoreMenu({
  app,
  handleAddToFavorites,
  isArchived = false,
  onArchiveToggle,
  onShowAccess,
  showManageOptions = true
}: CardMoreMenuProps) {
  const { toast } = useToast()

  const handleCopyUrl = async () => {
    const url = app.environments?.production || ''
    if (url) {
      await navigator.clipboard.writeText(url)
      toast({
        description: 'URL copied to clipboard',
        duration: 2000
      })
    }
  }

  const handleCopyDetails = async () => {
    await navigator.clipboard.writeText(formatLinkDetails(app))
    toast({
      description: 'Details copied to clipboard',
      duration: 2000
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="z-30 h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Quick Actions Group */}
        <DropdownMenuItem onClick={handleCopyUrl}>
          <LinkIcon className="mr-2 h-4 w-4" />
          <span>Copy URL</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyDetails}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Details</span>
        </DropdownMenuItem>

        {/* Organization Group - Only show if showManageOptions is true */}
        {showManageOptions && (
          <>
            <DropdownMenuSeparator />
            {!isArchived && (
              <DropdownMenuItem onClick={handleAddToFavorites}>
                <PinIcon className="mr-2 h-4 w-4" />
                <span>Pin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onArchiveToggle}>
              {isArchived ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  <span>Restore</span>
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Archive</span>
                </>
              )}
            </DropdownMenuItem>
          </>
        )}

        {/* Information Group */}
        {(app?.instructions || app?.access) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShowAccess}>
              <Info className="mr-2 h-4 w-4" />
              <span>More Information</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
