'use client'

import * as React from 'react'

import { Download, FileSpreadsheet, HelpCircle } from 'lucide-react'

import {
  LinksExporter,
  downloadFile
} from '@/features/data-manager/utils/links-exporter'
import { useLinks } from '@/features/links/hooks/links/use-links'

import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@links-base/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'
import { cn } from '@links-base/ui/utils'

interface ImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'csv' | 'bookmarks'
  onFileSelect: (file: File) => Promise<void>
}

export function ImportModal({
  open,
  onOpenChange,
  type,
  onFileSelect
}: ImportModalProps) {
  const { links } = useLinks()
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handleFile = async (file: File) => {
    const fileExtension = type === 'csv' ? '.csv' : '.html'
    if (!file.name.toLowerCase().endsWith(fileExtension)) {
      alert(`Please select a valid ${fileExtension} file`)
      return
    }
    await onFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const downloadTemplate = () => {
    const exporter = new LinksExporter(links)
    const { content, filename, type } = exporter.exportTemplate()
    downloadFile(content, filename, type)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Links From a {type === 'csv' ? 'CSV File' : 'Bookmarks File'}
          </DialogTitle>
          <DialogDescription>
            Easily import all your links into the application with just a few
            clicks.
          </DialogDescription>
        </DialogHeader>

        {type === 'csv' && (
          <div className="flex items-center justify-between px-1 py-2">
            <span className="text-sm text-muted-foreground">
              Need a template to get started?
            </span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={downloadTemplate}
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
        )}

        {type === 'bookmarks' && (
          <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              You can export your bookmarks as HTML from your browser&apos;s
              bookmarks manager.
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="ml-1 cursor-help underline">
                    Learn more
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] p-4">
                    <p>Most browsers allow you to:</p>
                    <ol className="mt-2 list-inside list-decimal space-y-1">
                      <li>Open your browser&apos;s bookmarks manager</li>
                      <li>
                        Look for an &quot;Export&quot; or &quot;Export as
                        HTML&quot; option
                      </li>
                      <li>Save the bookmarks HTML file</li>
                      <li>Import it here</li>
                    </ol>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </div>
        )}

        <div
          className={cn(
            'mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 transition-colors',
            isDragging
              ? 'border-primary bg-muted'
              : 'border-muted-foreground/25',
            'cursor-pointer'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={type === 'csv' ? '.csv' : '.html'}
            onChange={handleFileInput}
          />
          <p className="text-sm text-muted-foreground">
            Click or drag and drop a {type === 'csv' ? 'CSV' : 'HTML'} file.
          </p>
        </div>

        {type === 'csv' && (
          <div className="mt-2 text-xs text-muted-foreground">
            <p>The CSV should include the following columns:</p>
            <ul className="mt-1 list-inside list-disc">
              <li>name (required)</li>
              <li>description</li>
              <li>category</li>
              <li>color (hex format)</li>
              <li>tags (semicolon-separated)</li>
              <li>production_url (required)</li>
              <li>staging_url</li>
              <li>development_url</li>
              <li>integration_url</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
