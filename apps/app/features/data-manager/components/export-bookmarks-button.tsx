'use client'

import { type FC, useEffect, useState } from 'react'

import { FileUp } from 'lucide-react'

import { STORAGE_KEYS } from '@/constants/storage'
import { getValidCategories } from '@/features/category/utils/categories'
import { exportAsHtml } from '@/features/data-manager/utils/export'
import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useVisibilitySettings } from '@/features/links/hooks/links/use-visibility-settings'
import { useArchivedLinks } from '@/features/links/hooks/use-archived-links'
import { type Category } from '@/features/links/types/category.types'
import { groupLinksByCategory } from '@/features/links/utils/links'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@links-base/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import { useIsMobile, useToast } from '@links-base/ui/hooks'

type ExportBookmarksButtonProps = {
  disabled: boolean
}

export const ExportBookmarksButton: FC<ExportBookmarksButtonProps> = ({
  disabled
}) => {
  const [showImportModal, setShowImportModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const isMobile = useIsMobile()

  const { links } = useLinks()
  const { hiddenCategories } = useUserSettingsStore()
  const { toast } = useToast()
  const { isFavourite } = useFavourites()
  const { isArchived } = useArchivedLinks()
  const { showArchived } = useVisibilitySettings()

  useEffect(() => {
    const loadCategories = async () => {
      const validCategories = await getValidCategories()
      setCategories(validCategories)
    }
    void loadCategories().catch(error => {
      console.error('Failed to load categories:', error)
    })
  }, [])

  const handleHtmlExport = async () => {
    const linksByCategory = groupLinksByCategory({
      links,
      isFavourite,
      isArchived,
      showArchived,
      hiddenCategories,
      validCategories: categories.map(category => category.name)
    })

    exportAsHtml({ links: linksByCategory, toast })

    const hasSeenImportModal = localStorage.getItem(
      STORAGE_KEYS.HAS_SEEN_IMPORT_MODAL
    )
    if (!hasSeenImportModal) {
      setShowImportModal(true)
      localStorage.setItem(STORAGE_KEYS.HAS_SEEN_IMPORT_MODAL, 'true')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex items-center gap-2"
            variant="outline"
            size="sm"
            disabled={disabled}
            aria-label="Export Bookmarks"
          >
            <FileUp className="h-5 w-5" />
            {!isMobile && 'Export Bookmarks'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleHtmlExport}>
            Export as HTML Bookmarks
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Import Your Bookmarks</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <h3 className="font-medium">Chrome / Edge:</h3>
            <ol className="ml-4 list-decimal">
              <li>Open your browser settings</li>
              <li>Go to Bookmarks &gt; Import bookmarks and settings</li>
              <li>Choose &quot;Bookmarks HTML File&quot;</li>
              <li>Select the exported file</li>
            </ol>

            <h3 className="mt-4 font-medium">Firefox:</h3>
            <ol className="ml-4 list-decimal">
              <li>Click the Library button (book icon)</li>
              <li>Click &quot;Import and Backup&quot;</li>
              <li>Select &quot;Import Bookmarks from HTML...&quot;</li>
              <li>Select the exported file</li>
            </ol>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowImportModal(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
