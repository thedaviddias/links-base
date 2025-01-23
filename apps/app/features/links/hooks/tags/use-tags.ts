import * as React from 'react'

import { getTagApiRoute, getTags } from '@/constants/routes'
import { type InferTagSchema } from '@/features/links/schemas/tag.schema'
import { type Tag } from '@/features/links/types/tag.types'

import { useToast } from '@links-base/ui/hooks'

export function useTags() {
  const [tags, setTags] = React.useState<Tag[]>([])
  const [isLoading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { toast } = useToast()

  const fetchTags = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(getTags())
      if (!response.ok) throw new Error('Failed to fetch tags')
      const data = await response.json()
      setTags(data)
    } catch (error) {
      const errorMessage = 'There was an error loading the tags.'
      setError(errorMessage)
      console.error('Error fetching tags:', error)
      toast({
        title: 'Failed to load tags',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Add a new tag
   * @param tag - The tag object to add
   * @returns {Promise<boolean>} - Returns true if the tag was added successfully
   */
  const addTag = async (tag: { name: string }) => {
    try {
      const response = await fetch(getTagApiRoute(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      })

      if (!response.ok) throw new Error('Failed to add tag')

      await fetchTags()
      toast({
        title: 'Tag added successfully',
        description: 'The tag has been added to the database.'
      })
      return true
    } catch (error) {
      console.error('Error adding tag:', error)
      toast({
        title: 'Failed to add tag',
        description: 'There was an error adding the tag to the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  /**
   * Delete a tag
   * @param tagName - The name of the tag to delete
   * @returns {Promise<boolean>} - Returns true if the tag was deleted successfully
   */
  const deleteTag = async (tagName: string) => {
    try {
      const response = await fetch(getTagApiRoute(), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagName })
      })

      if (!response.ok) throw new Error('Failed to delete tag')

      await fetchTags()
      toast({
        title: 'Tag deleted successfully',
        description: 'The tag has been removed from the database.'
      })
      return true
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast({
        title: 'Failed to delete tag',
        description: 'There was an error removing the tag from the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  /**
   * Edit a tag
   * @param oldName - The old name of the tag
   * @param newTag - The new tag object
   * @returns {Promise<boolean>} - Returns true if the tag was edited successfully
   */
  const editTag = async (
    oldName: string,
    updatedTag: Partial<InferTagSchema>
  ) => {
    try {
      const response = await fetch(getTagApiRoute(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName,
          ...updatedTag
        })
      })

      if (!response.ok) throw new Error('Failed to edit tag')

      await fetchTags()
      toast({
        title: 'Tag updated successfully',
        description: 'The tag has been updated in the database.'
      })
      return true
    } catch (error) {
      toast({
        title: 'Failed to update tag',
        description: 'There was an error updating the tag in the database.',
        variant: 'destructive'
      })
      return false
    }
  }

  React.useEffect(() => {
    void (async () => {
      await fetchTags()
    })()
  }, [])

  return {
    tags,
    isLoading,
    error,
    refreshTags: fetchTags,
    addTag,
    deleteTag,
    editTag
  }
}
