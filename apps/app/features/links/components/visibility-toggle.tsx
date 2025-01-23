'use client'

import { useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Archive, RotateCcw } from 'lucide-react'

import { BadgeCount } from '@/components/notifications/badge-count'

import { useVisibilitySettings } from '@/features/links/hooks/links/use-visibility-settings'
import { useArchivedLinks } from '@/features/links/hooks/use-archived-links'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@links-base/ui/alert-dialog'
import { Button } from '@links-base/ui/button'

interface VisibilityToggleProps {
  showOnHomepageOnly?: boolean
}

/** Component to toggle visibility of archived links */
export const VisibilityToggle = ({
  showOnHomepageOnly = true
}: VisibilityToggleProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showArchived, setShowArchived } = useVisibilitySettings()
  const { archivedLinks, unarchiveAll } = useArchivedLinks()
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)

  // Don't render if there are no archived links
  if (archivedLinks.length === 0) return null

  // Don't render if we're not on the homepage and showOnHomepageOnly is true
  if (showOnHomepageOnly && pathname !== '/') return null

  const handleToggleArchived = () => {
    const newShowArchived = !showArchived
    setShowArchived(newShowArchived)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (newShowArchived) {
      params.set('archived', 'true')
    } else {
      params.delete('archived')
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleUnarchiveAll = () => {
    unarchiveAll()
    // Remove archived params from URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('archived')
    params.delete('archivedLinks')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setShowRestoreDialog(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleArchived}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          {showArchived ? 'Hide Archived' : 'Show Archived'}
          <BadgeCount
            count={archivedLinks.length}
            singularLabel="link"
            pluralLabel="links"
            emptyLabel="No archived links"
          />
        </Button>
        {showArchived && archivedLinks.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRestoreDialog(true)}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restore All
          </Button>
        )}
      </div>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore all archived links. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnarchiveAll}>
              Restore All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
