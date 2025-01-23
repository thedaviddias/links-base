import { useSearchParams } from 'next/navigation'

import { Share2 } from 'lucide-react'

import { useFavourites } from '@/features/favourite/hooks/use-favourites'
import { useArchivedLinks } from '@/features/links/hooks/use-archived-links'
import { useUserSettingsStore } from '@/features/user/stores/useUserSettingsStore'

import { Button } from '@links-base/ui/button'
import { toast, useIsMobile } from '@links-base/ui/hooks'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

import { type LinksApp } from '../types/link.types'

/** Share current view configuration */
const ShareViewButton = ({ links }: { links: LinksApp[] }) => {
  const searchParams = useSearchParams()
  const { favourites } = useFavourites()
  const { archivedLinks } = useArchivedLinks()
  const { hiddenCategories } = useUserSettingsStore()
  const isMobile = useIsMobile()

  const handleShare = async () => {
    const params = new URLSearchParams(searchParams.toString())

    // Add favorites to URL if any exist
    const favoriteNames = favourites.map(app => app.name)
    if (favoriteNames.length > 0) {
      params.set('favorites', favoriteNames.join(','))
    }

    // Add archived links to URL if any exist
    if (archivedLinks.length > 0) {
      params.set('archived', 'true')
      params.set('archivedLinks', archivedLinks.join(','))
    }

    // Add hidden categories to URL if any exist
    if (hiddenCategories.length > 0) {
      params.set('hidden', hiddenCategories.join(','))
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Link copied!',
        description:
          'The URL has been copied to your clipboard. Anyone with this link will see the same configuration.'
      })
    } catch (error) {
      toast({
        title: 'Failed to copy link',
        description: 'Please try again or copy the URL manually.',
        variant: 'destructive'
      })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={links.length === 0}
          >
            <Share2 className="h-4 w-4" />
            {!isMobile && 'Share View'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share your current view configuration with others</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ShareViewButton
