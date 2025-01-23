import { FileIcon } from 'lucide-react'

import { type LinksApp } from '@/features/links/types/link.types'

import { Button } from '@links-base/ui/button'

import { handleExport } from '../utils/handle-export'

interface ExportBookmarksButtonProps {
  webappsByCategory: Record<string, LinksApp[]>
}

export const ExportBookmarksButton: React.FC<ExportBookmarksButtonProps> = ({
  webappsByCategory
}) => {
  return (
    <Button
      onClick={() => handleExport(webappsByCategory)}
      size="sm"
      variant="outline"
      className="h-7 gap-1 text-sm"
    >
      <FileIcon className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only">Export to Bookmarks</span>
    </Button>
  )
}
