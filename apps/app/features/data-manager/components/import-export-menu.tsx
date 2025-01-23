import { Bookmark, FileDown, FileSpreadsheet, MoreVertical } from 'lucide-react'

import { Button } from '@links-base/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@links-base/ui/dropdown-menu'

interface ImportExportMenuProps {
  onImportTypeSelect: (type: 'csv' | 'bookmarks') => void
  onExport: (format: 'csv' | 'bookmarks') => void
}

export function ImportExportMenu({
  onImportTypeSelect,
  onExport
}: ImportExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 w-9 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Import Links</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onImportTypeSelect('csv')}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-muted-foreground" />
            Import from CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onImportTypeSelect('bookmarks')}>
            <Bookmark className="mr-2 h-4 w-4 text-muted-foreground" />
            Import from Bookmarks
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Export Links</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onExport('csv')}>
            <FileDown className="mr-2 h-4 w-4 text-muted-foreground" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('bookmarks')}>
            <FileDown className="mr-2 h-4 w-4 text-muted-foreground" />
            Export as Bookmarks
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
