'use client'

import { forwardRef } from 'react'

import { Edit, MoreVertical, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@links-base/ui/alert-dialog'
import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'

interface ActionButtonsProps {
  /**
   * Function to handle edit action
   */
  onEdit: () => void
  /**
   * Function to handle delete action
   */
  onDelete: () => Promise<void>
  /**
   * Tooltip text for edit action
   */
  editTooltip?: string
  /**
   * Tooltip text for delete action
   */
  deleteTooltip?: string
  /**
   * Label for edit action
   */
  editLabel?: string
  /**
   * Label for delete action
   */
  deleteLabel?: string
  /**
   * Type of item being deleted
   */
  itemType?: 'link' | 'category' | 'tag' | 'item'
  /**
   * Name of the item being deleted
   */
  itemName?: string
  /**
   * Class name for the delete button
   */
  className?: string
}

export function ActionButtons({
  onEdit,
  onDelete,
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  itemType = 'item',
  itemName = 'this item',
  className
}: ActionButtonsProps) {
  const handleDelete = async () => {
    try {
      await onDelete()
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const DeleteButton = forwardRef<HTMLButtonElement, ActionButtonsProps>(
    (props, ref) => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50 ${className}`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{deleteLabel}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete {itemType} &quot;{itemName}&quot;.
              <br />
              <br />
              This action can be reverted if you discard the changes in Git.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Delete {itemType}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  )

  DeleteButton.displayName = 'DeleteButton'

  return (
    <div className="flex items-center justify-end">
      {/* Desktop view - show icons only */}
      <div className="hidden items-center gap-2 md:flex">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">{editLabel}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{editTooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteButton onEdit={onEdit} onDelete={onDelete} />
            </TooltipTrigger>
            <TooltipContent>{deleteTooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile view - show dropdown */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>{editLabel}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-50 focus:text-red-500 dark:focus:bg-red-950/50"
                  onSelect={e => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{deleteLabel}</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete {itemType} &quot;{itemName}&quot;. This
                    action can be reverted if you discard the changes in Git.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  >
                    Delete {itemType}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
