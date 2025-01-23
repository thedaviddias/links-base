'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { AlertCircle, FileQuestion, Info } from 'lucide-react'

import { CopyTrigger } from '@/components/copy-trigger'
import { ActionButtons } from '@/components/table/action-buttons'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { DEFAULT_CATEGORY } from '@/constants'
import { AccessTypeIcon } from '@/features/links/components/access-type-icon'
import { type AccessType } from '@/features/links/constants/access-types'
import { type LinksApp } from '@/features/links/types/link.types'

import { Badge } from '@links-base/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@links-base/ui/hover-card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

import { LinkPreviewCard } from './link-preview-card'
import { MiniLink } from './mini-link'

type LinksColumnProps = {
  deleteLink: (name: string) => Promise<void>
  onEdit: (link: LinksApp) => void
  registeredCategories?: string[]
}

export const columnsLinks = ({
  deleteLink,
  onEdit,
  registeredCategories = []
}: LinksColumnProps): ColumnDef<LinksApp>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" canHide={false} />
    ),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.name.toLowerCase()
      const b = rowB.original.name.toLowerCase()
      return a < b ? -1 : a > b ? 1 : 0
    },
    filterFn: 'includesString',
    cell: ({ row }) => {
      const link = row.original
      const hasInstructions = Boolean(link.instructions)

      return (
        <div className="flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="hover:cursor-pointer">
                <MiniLink link={link} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <LinkPreviewCard link={link} />
            </HoverCardContent>
          </HoverCard>
          {hasInstructions && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-blue-500/70 transition-colors hover:text-blue-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This link has usage instructions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'color',
    header: 'Brand Color',
    cell: ({ row }) => {
      const color = row.getValue<string>('color')
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CopyTrigger value={color}>
                <div
                  className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              </CopyTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <span className="font-mono">Click to copy: {color}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue<string | undefined>('category')
      const isUnregistered =
        category &&
        category !== DEFAULT_CATEGORY &&
        !registeredCategories.includes(category)

      const needsCategorization = category === DEFAULT_CATEGORY

      return (
        <div className="flex items-center gap-2">
          {needsCategorization ? (
            <span className="text-red-500">{category}</span>
          ) : (
            category
          )}
          {isUnregistered && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This category is not registered. The link won&apos;t be
                    visible until the category is created.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {needsCategorization && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <FileQuestion className="h-4 w-4 text-red-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This link needs to be assigned to a category. Click on edit
                    to assign a category.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue<string[] | undefined>('tags')

      if (!tags?.length) return null

      return (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="border border-muted bg-background/80"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: 'accessType',
    header: 'Access',
    cell: ({ row }) => {
      const accessType = row.getValue<AccessType | undefined>('accessType')

      if (!accessType) return null

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AccessTypeIcon
                type={accessType}
                size={20}
                className="text-muted-foreground"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{`${accessType.charAt(0).toUpperCase() + accessType.slice(1)} Authentication`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const link = row.original

      return (
        <ActionButtons
          onEdit={() => onEdit(link)}
          onDelete={async () => await deleteLink(link.name)}
          editTooltip="Edit Link"
          deleteTooltip="Delete Link"
          editLabel="Edit Link"
          deleteLabel="Delete Link"
          itemType="link"
          itemName={link.name}
        />
      )
    }
  }
]
