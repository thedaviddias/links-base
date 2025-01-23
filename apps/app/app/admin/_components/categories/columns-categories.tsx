'use client'

import { type ColumnDef, type Row } from '@tanstack/react-table'

import { BadgeCount } from '@/components/notifications/badge-count'
import { ActionButtons } from '@/components/table/action-buttons'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { getIconComponent } from '@/utils/icon-mapping'

import { type Category } from '@/features/links/types/category.types'
import { type LinksApp } from '@/features/links/types/link.types'

type CategoriesColumnProps = {
  deleteCategory: (name: string, deleteLinks: boolean) => Promise<void>
  editCategory: (category: Category) => Promise<void>
  links: LinksApp[]
}

export const columnsCategories = ({
  deleteCategory,
  editCategory,
  links
}: CategoriesColumnProps): ColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
    cell: ({ row }: { row: Row<Category> }) => {
      const categoryName = row.getValue<string>('name')
      const icon = row.original.icon || 'Folder'
      const Icon = getIconComponent(icon)

      return (
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="font-medium capitalize">{categoryName}</div>
          </div>
        </div>
      )
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.getValue<string>('name').toLowerCase()
      const b = rowB.getValue<string>('name').toLowerCase()
      return a < b ? -1 : a > b ? 1 : 0
    }
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue<string | undefined>('description')

      return (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {description || 'No description'}
        </div>
      )
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = (
        rowA.getValue<string | undefined>('description') || ''
      ).toLowerCase()
      const b = (
        rowB.getValue<string | undefined>('description') || ''
      ).toLowerCase()
      return a < b ? -1 : a > b ? 1 : 0
    }
  },
  {
    accessorKey: 'linkCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Links Count" />
    ),
    cell: ({ row }) => {
      const categoryName = row.getValue('name')
      const count = links.filter(link => link.category === categoryName).length

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
      const aName = rowA.getValue('name')
      const bName = rowB.getValue('name')
      const aCount = links.filter(link => link.category === aName).length
      const bCount = links.filter(link => link.category === bName).length
      return aCount - bCount
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const category = row.original

      return (
        <ActionButtons
          onEdit={() => editCategory(category)}
          onDelete={async () => await deleteCategory(category.name, false)}
          editTooltip="Edit Category"
          deleteTooltip="Delete Category"
          editLabel="Edit Category"
          deleteLabel="Delete Category"
          itemType="category"
          itemName={category.name}
        />
      )
    }
  }
]
