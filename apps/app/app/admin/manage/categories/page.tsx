'use client'

import * as React from 'react'

import { ManageEntityPage } from '@/components/pages/manage-entity-page'

import { useHotkeys } from '@/hooks/use-hotkeys'

import { useCategories } from '@/features/category/hooks/use-categories'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { type InferCategorySchema } from '@/features/links/schemas/category.schema'
import { searchTable } from '@/features/search/utils/search-table'

import { Button } from '@links-base/ui/button'

import { CategoryModal } from '../../_components/categories/category-modal'
import { columnsCategories } from '../../_components/categories/columns-categories'
import { UnregisteredCategories } from '../../_components/categories/unregistered-categories'

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [openDialog, setOpenDialog] = React.useState<'add' | 'edit' | null>(
    null
  )
  const [editingCategory, setEditingCategory] =
    React.useState<InferCategorySchema | null>(null)

  const {
    categories,
    uncategorizedCategories,
    addCategory,
    deleteCategory,
    editCategory
  } = useCategories()
  const { links } = useLinks()

  useHotkeys('c', () => setOpenDialog('add'))

  const filteredCategories = searchTable(categories, searchTerm, ['name'])

  const columns = React.useMemo(
    () =>
      columnsCategories({
        deleteCategory: async (name, deleteLinks) => {
          await deleteCategory({ categoryName: name, deleteLinks })
        },
        editCategory: category => {
          setEditingCategory(category)
          setOpenDialog('edit')
          return Promise.resolve()
        },
        links
      }),
    [deleteCategory, links]
  )

  const handleAddCategory = async (values: InferCategorySchema) => {
    const categoryExists = categories.some(
      category => category.name.toLowerCase() === values.name.toLowerCase()
    )

    if (categoryExists) {
      throw new Error('A category with this name already exists')
    }

    await addCategory(values)
    setOpenDialog(null)
    return true
  }

  const handleEditCategory = async (
    values: InferCategorySchema
  ): Promise<boolean> => {
    if (!editingCategory?.name) {
      console.error('Category editing failed: No category selected')
      return false
    }

    const isSameName =
      values.name.toLowerCase() === editingCategory.name.toLowerCase()

    if (!isSameName) {
      const categoryExists = categories.some(
        category => category.name.toLowerCase() === values.name.toLowerCase()
      )

      if (categoryExists) {
        throw new Error('A category with this name already exists')
      }
    }

    try {
      await editCategory({ oldName: editingCategory.name, newCategory: values })
      setOpenDialog(null)
      setEditingCategory(null)
      return true
    } catch (error) {
      console.error(
        'Category editing failed:',
        error instanceof Error ? error.message : 'Unknown error'
      )
      throw error
    }
  }

  return (
    <ManageEntityPage
      title="Manage Categories"
      description="Manage categories for your links."
      filteredData={filteredCategories}
      columns={columns}
      searchPlaceholder="Filter categories..."
      setSearchTerm={setSearchTerm}
      beforeTable={
        <UnregisteredCategories
          uncategorizedCategories={uncategorizedCategories}
          openDialog={openDialog}
          editingCategory={editingCategory}
          setOpenDialog={setOpenDialog}
          setEditingCategory={setEditingCategory}
          addCategory={addCategory}
        />
      }
      addButtonComponent={
        <CategoryModal
          mode="add"
          open={openDialog === 'add'}
          onOpenChange={open => {
            setOpenDialog(open ? 'add' : null)
          }}
          onSubmit={handleAddCategory}
          trigger={
            <Button size="sm">
              <div className="min-w-0 flex-1 truncate text-left">
                Add Category
              </div>
              <kbd className="hidden rounded bg-gray-700 px-2 py-0.5 text-xs font-light text-gray-400 transition-all duration-75 group-hover:bg-gray-600 group-hover:text-gray-300 md:inline-block">
                C
              </kbd>
            </Button>
          }
        />
      }
      editModalComponent={
        editingCategory && (
          <CategoryModal
            mode="edit"
            open={openDialog === 'edit'}
            onOpenChange={open => {
              setOpenDialog(open ? 'edit' : null)
              if (!open) setEditingCategory(null)
            }}
            onSubmit={handleEditCategory}
            initialValues={editingCategory}
          />
        )
      }
    />
  )
}
