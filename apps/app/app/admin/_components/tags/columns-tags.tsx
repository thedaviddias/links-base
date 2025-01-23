'use client'

import { type ColumnDef } from '@tanstack/react-table'

import { BadgeCount } from '@/components/notifications/badge-count'
import { ActionButtons } from '@/components/table/action-buttons'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { type LinksApp } from '@/features/links/types/link.types'
import { type Tag } from '@/features/links/types/tag.types'

type TagsColumnProps = {
  deleteTag: (name: string) => Promise<void>
  onEdit: (tag: Tag) => void
  links: LinksApp[]
}

export const columnsTags = ({
  deleteTag,
  onEdit,
  links
}: TagsColumnProps): ColumnDef<Tag>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tag Name" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue<string>('name')}</div>
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue<string>('name').toLowerCase()
      const b = rowB.getValue<string>('name').toLowerCase()
      return a < b ? -1 : a > b ? 1 : 0
    }
  },
  {
    accessorKey: 'linkCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Links Count" />
    ),
    cell: ({ row }) => {
      const tagName = row.getValue<string>('name')
      const count = links.filter(link => link.tags?.includes(tagName)).length

      return (
        <BadgeCount
          count={count}
          singularLabel="link"
          pluralLabel="links"
          emptyLabel="No links yet"
        />
      )
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aName = rowA.getValue<string>('name')
      const bName = rowB.getValue<string>('name')
      const aCount = links.filter(link => link.tags?.includes(aName)).length
      const bCount = links.filter(link => link.tags?.includes(bName)).length
      return aCount - bCount
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const tag = row.original

      return (
        <ActionButtons
          onEdit={() => onEdit(tag)}
          onDelete={async () => await deleteTag(tag.name)}
          editTooltip="Edit Tag"
          deleteTooltip="Delete Tag"
          editLabel="Edit Tag"
          deleteLabel="Delete Tag"
          itemType="tag"
          itemName={tag.name}
        />
      )
    }
  }
]
