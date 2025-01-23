'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'

import {
  LinksExporter,
  downloadFile
} from '@/features/data-manager/utils/links-exporter'
import { useLinks } from '@/features/links/hooks/links/use-links'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'

interface ExportLinksButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function ExportLinksButton({
  variant = 'default',
  size = 'sm'
}: ExportLinksButtonProps) {
  const { links } = useLinks()

  const handleExport = (format: 'csv' | 'bookmarks') => {
    try {
      const exporter = new LinksExporter(links)
      const { content, filename, type } = exporter.export(format)
      downloadFile(content, filename, type)

      toast.success(
        `Links exported successfully as ${format === 'csv' ? 'CSV' : 'Bookmarks'}`
      )
    } catch (error) {
      toast.error(`Failed to export links: ${(error as Error).message}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          Export Links
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('bookmarks')}>
          Export as Bookmarks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
