'use client'

import { Eye, X } from 'lucide-react'
import { motion } from 'motion/react'

import { getIconComponent } from '@/utils/icon-mapping'

import { type Category } from '@/features/links/types/category.types'

import { Button } from '@links-base/ui/button'

interface HiddenCategoriesAlertProps {
  hiddenCategories: Category[]
  showFullAlert: boolean
  setShowFullAlert: (show: boolean) => void
  onDismiss: () => void
}

export const HiddenCategoriesAlert = ({
  hiddenCategories,
  showFullAlert,
  setShowFullAlert,
  onDismiss
}: HiddenCategoriesAlertProps) => {
  if (hiddenCategories.length === 0) return null

  return showFullAlert ? (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <div className="relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Hidden Categories</h3>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Hidden:</p>
                  <div className="flex flex-wrap gap-1">
                    {hiddenCategories.map(cat => {
                      const Icon = getIconComponent(cat.icon || 'Folder')
                      return (
                        <span
                          key={cat.name}
                          className="inline-flex items-center gap-1.5 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          <Icon className="h-3 w-3" />
                          {cat.name}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const sidebarElement =
                    document.querySelector('[data-show-hidden]')
                  if (sidebarElement) {
                    sidebarElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    })
                    sidebarElement.classList.add(
                      'ring-2',
                      'ring-primary',
                      'ring-offset-2'
                    )
                    setTimeout(() => {
                      sidebarElement.classList.remove(
                        'ring-2',
                        'ring-primary',
                        'ring-offset-2'
                      )
                    }, 2000)
                  }
                }}
              >
                Manage Hidden Categories
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => setShowFullAlert(true)}
      className="group mb-6 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
        <Eye className="h-3 w-3" />
      </div>
      <span>
        {hiddenCategories.length} hidden categor
        {hiddenCategories.length === 1 ? 'y' : 'ies'}
      </span>
    </motion.button>
  )
}
