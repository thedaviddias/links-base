import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react'

import { type ImportResult } from '@/features/data-manager/types/import'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@links-base/ui/dialog'
import { ScrollArea } from '@links-base/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@links-base/ui/tabs'

interface ImportResultsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: ImportResult
}

export function ImportResultsModal({
  open,
  onOpenChange,
  results
}: ImportResultsModalProps) {
  // Group failed imports by reason
  const failedByReason = {
    duplicate: results.failed.filter(f => f.reason === 'duplicate'),
    invalid: results.failed.filter(f => f.reason === 'invalid'),
    error: results.failed.filter(f => f.reason === 'error')
  }

  const totalFailed = results.failed.length
  const totalSuccess = results.success.added.length
  const totalCategories =
    results.categories.new.length + results.categories.existing.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Results</DialogTitle>
          <DialogDescription>Summary of the import operation</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={
            totalSuccess > 0
              ? 'success'
              : totalFailed > 0
                ? 'failed'
                : 'categories'
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="success" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Success ({totalSuccess})
            </TabsTrigger>
            <TabsTrigger value="failed" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Failed ({totalFailed})
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Categories ({totalCategories})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="success">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {results.success.added.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Added ({results.success.added.length})
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {results.success.added.map((link, i) => (
                        <li key={i} className="text-sm">
                          {link.name} -{' '}
                          <span className="text-muted-foreground">
                            {link.url}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No links were successfully added
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="failed">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {totalFailed > 0 ? (
                <div className="space-y-6">
                  {failedByReason.duplicate.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium">
                        <XCircle className="h-4 w-4 text-yellow-500" />
                        Already Exists ({failedByReason.duplicate.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {failedByReason.duplicate.map((link, i) => (
                          <li key={i} className="text-sm">
                            {link.name} -{' '}
                            <span className="text-muted-foreground">
                              {link.url}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {failedByReason.invalid.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Invalid Links ({failedByReason.invalid.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {failedByReason.invalid.map((link, i) => (
                          <li key={i} className="text-sm">
                            {link.name} -{' '}
                            <span className="text-muted-foreground">
                              {link.url}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {failedByReason.error.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Failed to Import ({failedByReason.error.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {failedByReason.error.map((link, i) => (
                          <li key={i} className="text-sm">
                            {link.name} -{' '}
                            <span className="text-muted-foreground">
                              {link.url}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No failed imports
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="categories">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {totalCategories > 0 ? (
                <>
                  {results.categories.new.length > 0 && (
                    <div>
                      <h3 className="flex items-center gap-2 font-medium">
                        <AlertCircle className="h-4 w-4 text-green-500" />
                        New Categories ({results.categories.new.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {results.categories.new.map((category, i) => (
                          <li key={i} className="text-sm">
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {results.categories.existing.length > 0 && (
                    <div className="mt-4">
                      <h3 className="flex items-center gap-2 font-medium">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        Existing Categories (
                        {results.categories.existing.length})
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {results.categories.existing.map((category, i) => (
                          <li key={i} className="text-sm">
                            {category}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No categories were affected
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            data-testid="close-button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
