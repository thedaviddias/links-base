'use client'

import { AlertCircle } from 'lucide-react'

import { type InferCategorySchema } from '@/features/links/schemas/category.schema'

import { Alert, AlertDescription, AlertTitle } from '@links-base/ui/alert'
import { Badge } from '@links-base/ui/badge'
import { Button } from '@links-base/ui/button'
import { DialogTrigger } from '@links-base/ui/dialog'
import { TableCell, TableRow } from '@links-base/ui/table'

import { CategoryModal } from './category-modal'

interface UnregisteredCategoriesProps {
  uncategorizedCategories: Set<string>
  openDialog: 'add' | 'edit' | null
  editingCategory: { name: string } | null
  setOpenDialog: (value: 'add' | 'edit' | null) => void
  setEditingCategory: (value: { name: string } | null) => void
  addCategory: (data: InferCategorySchema) => Promise<boolean>
}

export function UnregisteredCategories({
  uncategorizedCategories,
  openDialog,
  editingCategory,
  setOpenDialog,
  setEditingCategory,
  addCategory
}: UnregisteredCategoriesProps) {
  if (uncategorizedCategories.size === 0) return null

  return (
    <div>
      {uncategorizedCategories.size > 0 && (
        <div className="my-8">
          <h2 className="mb-4 text-xl font-bold">Unregistered Categories</h2>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unregistered Categories Found</AlertTitle>
            <AlertDescription>
              Some links in your collection are using categories that
              haven&apos;t been officially created yet. These categories are
              marked with an &quot;Unregistered&quot; badge below. Click the
              &quot;Create Category&quot; button next to each one to properly
              set them up.
            </AlertDescription>
          </Alert>

          <div className="rounded-md border">
            <table className="w-full">
              <tbody>
                {Array.from(uncategorizedCategories).map(categoryName => (
                  <TableRow key={`uncategorized-${categoryName}`}>
                    <TableCell className="font-medium">
                      {categoryName}
                      <Badge variant="destructive" className="ml-2">
                        Unregistered
                      </Badge>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      <CategoryModal
                        mode="add"
                        open={
                          openDialog === 'add' &&
                          editingCategory?.name === categoryName
                        }
                        onOpenChange={open => {
                          setOpenDialog(open ? 'add' : null)
                          if (open) {
                            setEditingCategory({ name: categoryName })
                          } else setEditingCategory(null)
                        }}
                        onSubmit={addCategory}
                        initialValues={{ name: categoryName }}
                        trigger={
                          <DialogTrigger asChild>
                            <Button variant="outline">Create Category</Button>
                          </DialogTrigger>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
