import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { getLinkApiRoute, getLinksPath } from '@/constants/routes'
import { type InferLinkSchema } from '@/features/links/schemas/link.schema'
import { type LinksApp } from '@/features/links/types/link.types'
import { useSetupStore } from '@/features/setup/stores/setupStore'

import { useToast } from '@links-base/ui/hooks'
import { ToastAction } from '@links-base/ui/toast'

/**
 * Hook to manage links
 * @returns {Object} - Returns an object with the links, isLoading, error, refreshLinks, addLink, deleteLink, and editLink functions
 */
export function useLinks() {
  const [links, setLinks] = useState<LinksApp[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isComplete, resetSetup } = useSetupStore()

  const fetchLinks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(getLinksPath(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        // Check if the error is due to missing files
        if (response.status === 404) {
          resetSetup()
          router.push('/setup')
          return
        }
        throw new Error('Failed to fetch links')
      }

      const data = await response.json()
      setLinks(data || [])
    } catch (error) {
      const errorMessage = 'There was an error loading the links.'
      setError(errorMessage)
      console.error('Error fetching links:', error)

      // Only show error toast if setup is complete
      if (isComplete) {
        toast({
          title: 'Failed to load links',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new link
   * @param link - The link object to add
   * @returns {Promise<boolean>} - Returns true if the link was added successfully
   */
  const addLink = async (link: InferLinkSchema) => {
    try {
      const response = await fetch(getLinkApiRoute(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link)
      })

      if (!response.ok) throw new Error('Failed to add link')

      await fetchLinks() // Refresh links after adding
      toast({
        title: 'Link added successfully',
        description: 'The link has been added to the database.'
      })
      return true
    } catch (error) {
      console.error('Error adding link:', error)
      toast({
        title: 'Failed to add link',
        description: 'There was an error adding the link to the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  /**
   * Delete a link with undo capability
   * @param linkName - The name of the link to delete
   * @returns {Promise<boolean>} - Returns true if the link was deleted successfully
   */
  const deleteLink = async (linkName: string) => {
    const linkToDelete = links.find(link => link.name === linkName)

    try {
      const response = await fetch(getLinkApiRoute(), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkName })
      })

      if (!response.ok) throw new Error('Failed to delete link')

      await fetchLinks() // Refresh links after deleting
      toast({
        title: 'Link deleted successfully',
        description: 'The link has been removed from the database.',
        action: linkToDelete ? (
          <ToastAction
            altText="Undo link deletion"
            onClick={() => {
              void addLink(linkToDelete).catch(error => {
                console.error('Error restoring link:', error)
                toast({
                  title: 'Failed to restore link',
                  description: 'There was an error restoring the link.',
                  variant: 'destructive'
                })
              })
            }}
          >
            Undo
          </ToastAction>
        ) : undefined
      })
      return true
    } catch (error) {
      toast({
        title: 'Failed to delete link',
        description: 'There was an error removing the link from the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  /**
   * Edit a link
   * @param linkName - The name of the link to edit
   * @param updatedLink - The updated link data
   * @returns {Promise<boolean>} - Returns true if the link was edited successfully
   */
  const editLink = async (
    linkName: string,
    updatedLink: Partial<InferLinkSchema>
  ) => {
    try {
      const response = await fetch(getLinkApiRoute(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkName,
          ...updatedLink
        })
      })

      if (!response.ok) throw new Error('Failed to edit link')

      await fetchLinks() // Refresh links after editing
      toast({
        title: 'Link updated successfully',
        description: 'The link has been updated in the database.'
      })
      return true
    } catch (error) {
      console.error('Error editing link:', error)
      toast({
        title: 'Failed to update link',
        description: 'There was an error updating the link in the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  useEffect(() => {
    void fetchLinks()
  }, []) // Only fetch on mount

  return {
    links,
    isLoading,
    error,
    refreshLinks: fetchLinks,
    addLink,
    deleteLink,
    editLink
  }
}
