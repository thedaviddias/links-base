'use client'

import * as React from 'react'

import { Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@links-base/ui/alert-dialog'
import { Button } from '@links-base/ui/button'

interface DeleteCategoryAlertProps {
  categoryName: string
  hasLinks: boolean
  onDelete: (deleteLinks: boolean) => Promise<void>
}

export function DeleteCategoryAlert({
  categoryName,
  hasLinks,
  onDelete
}: DeleteCategoryAlertProps) {
  const [open, setOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async (deleteLinks: boolean) => {
    setIsDeleting(true)
    try {
      await onDelete(deleteLinks)
      setOpen(false)
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete &quot;{categoryName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasLinks
              ? 'This category contains links. If you remove this category, all links in this category will be deleted (You can always revert this action, discarting the changes in the database).'
              : 'This action can be reverted if you discard the changes in Git.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          {hasLinks ? (
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDelete(true)}
              disabled={isDeleting}
            >
              Delete Category and Links
            </AlertDialogAction>
          ) : (
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleDelete(false)}
              disabled={isDeleting}
            >
              Delete Category
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
