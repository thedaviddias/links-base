'use client'

import { useState } from 'react'

import { ManageEntityPage } from '@/components/pages/manage-entity-page'

import { useHotkeys } from '@/hooks/use-hotkeys'

import { columnsTags } from '@/app/admin/_components/tags/columns-tags'
import { TagModal } from '@/app/admin/_components/tags/tag-modal'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { useTags } from '@/features/links/hooks/tags/use-tags'
import { type InferTagSchema } from '@/features/links/schemas/tag.schema'
import { type Tag } from '@/features/links/types/tag.types'

import { Button } from '@links-base/ui/button'

const AddTagButton = () => {
  return (
    <Button size="sm">
      <div className="min-w-0 flex-1 truncate text-left">Add Tag</div>
      <kbd className="hidden rounded bg-gray-700 px-2 py-0.5 text-xs font-light text-gray-400 transition-all duration-75 group-hover:bg-gray-600 group-hover:text-gray-300 md:inline-block">
        C
      </kbd>
    </Button>
  )
}

export default function ManageTags() {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [openDialog, setOpenDialog] = useState<'add' | 'edit' | null>(null)

  const { tags, deleteTag, editTag, addTag } = useTags()
  const { links } = useLinks()

  useHotkeys('c', () => setOpenDialog('add'))

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = columnsTags({
    deleteTag: async (name: string) => {
      await deleteTag(name)
    },
    onEdit: (tag: Tag) => {
      setEditingTag(tag)
      setOpenDialog('edit')
    },
    links
  })

  /**
   * Handles the add tag submission
   */
  const handleSubmit = async (values: InferTagSchema) => {
    const tagExists = tags.some(
      tag => tag.name.toLowerCase() === values.name.toLowerCase()
    )

    if (tagExists) {
      throw new Error('A tag with this name already exists')
    }

    await addTag(values)
    setOpenDialog(null)
    return true
  }

  /**
   * Handles the add tag dialog open/close
   */
  const handleAddOpenDialog = async (open: boolean) => {
    setOpenDialog(open ? 'add' : null)
  }

  /**
   * Handles the edit tag dialog open/close
   */
  const handleEditOpenDialog = async (open: boolean) => {
    setOpenDialog(open ? 'edit' : null)

    if (!open) setEditingTag(null)
  }

  /**
   * Handles the edit tag submission
   */
  const handleEdit = async (data: Tag) => {
    if (!editingTag) return false

    await editTag(editingTag.name, data)
    setOpenDialog(null)

    return true
  }

  return (
    <ManageEntityPage
      title="Manage Tags"
      description="Manage tags for your links."
      filteredData={filteredTags}
      columns={columns}
      searchPlaceholder="Filter tags..."
      setSearchTerm={setSearchTerm}
      addButtonComponent={
        <TagModal
          mode="add"
          open={openDialog === 'add'}
          onOpenChange={handleAddOpenDialog}
          onSubmit={handleSubmit}
          trigger={<AddTagButton />}
        />
      }
      editModalComponent={
        editingTag && (
          <TagModal
            mode="edit"
            open={openDialog === 'edit'}
            onOpenChange={handleEditOpenDialog}
            onSubmit={handleEdit}
            initialValues={editingTag}
          />
        )
      }
    />
  )
}
