import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { calculateLinkCounts } from '@/utils/calculate-link-counts'

import { getCategoriesPath, getCategoryApiRoute } from '@/constants/routes'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { type InferCategorySchema } from '@/features/links/schemas/category.schema'
import { type Category } from '@/features/links/types/category.types'

import { useToast } from '@links-base/ui/hooks'

export function useCategories() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { links, isLoading: linksLoading } = useLinks()

  // Main categories query
  const {
    data: categories = [] as InferCategorySchema[],
    isLoading: categoriesLoading,
    error,
    refetch: refreshCategories
  } = useQuery({
    queryKey: ['categories', links?.length],
    queryFn: async () => {
      const response = await fetch(getCategoriesPath(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      const categoriesData = await response.json()

      if (!Array.isArray(categoriesData)) {
        throw new Error('Invalid categories data')
      }

      // Wait for links to be loaded
      if (linksLoading || !links) {
        return categoriesData.map((category: Category) => ({
          ...category,
          linkCount: 0
        }))
      }

      const linkCounts = calculateLinkCounts(categoriesData, links)

      return categoriesData.map((category: Category) => ({
        ...category,
        linkCount: linkCounts.get(category.name.toLowerCase()) || 0
      })) as InferCategorySchema[]
    },
    enabled: true
  })

  // Calculate uncategorized categories
  const uncategorizedCategories = new Set(
    !linksLoading && links
      ? links
          .map(link => link.category.toLowerCase())
          .filter(
            category =>
              !categories.some(cat => cat.name.toLowerCase() === category)
          )
      : []
  )

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, 'id'>) => {
      const response = await fetch(getCategoryApiRoute(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      })
      if (!response.ok) throw new Error('Failed to add category')
      return response.json()
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: 'Category added successfully',
        description: 'The category has been added to the database.'
      })
    },
    onError: error => {
      console.error('Error adding category:', error)
      toast({
        title: 'Failed to add category',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    }
  })

  // Edit category mutation
  const editCategoryMutation = useMutation({
    mutationFn: async ({
      oldName,
      newCategory
    }: {
      oldName: string
      newCategory: InferCategorySchema
    }) => {
      const response = await fetch(getCategoryApiRoute(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName,
          newName: newCategory.name,
          icon: newCategory.icon,
          description: newCategory.description
        })
      })
      if (!response.ok) throw new Error('Failed to edit category')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })

      toast({
        title: 'Category updated successfully',
        description: 'The category has been updated in the database.'
      })
    },
    onError: () => {
      toast({
        title: 'Failed to update category',
        description:
          'There was an error updating the category in the database.',
        variant: 'destructive'
      })
    }
  })

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async ({
      categoryName,
      deleteLinks
    }: {
      categoryName: string
      deleteLinks: boolean
    }) => {
      const response = await fetch(getCategoryApiRoute(), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName })
      })
      if (!response.ok) throw new Error('Failed to delete category')
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: 'Category deleted successfully',
        description: 'The category has been removed from the database.'
      })
    },
    onError: error => {
      console.error('Error deleting category:', error)
      toast({
        title: 'Failed to delete category',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    }
  })

  const isLoading = linksLoading || categoriesLoading

  return {
    categories,
    uncategorizedCategories,
    isLoading,
    error,
    refreshCategories,
    editCategory: editCategoryMutation.mutateAsync,
    addCategory: addCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync
  }
}
