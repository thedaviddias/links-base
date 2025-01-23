'use client'

import { useRef, useState } from 'react'

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  HelpCircle,
  XCircle
} from 'lucide-react'

import { Alert, AlertDescription } from '@links-base/ui/alert'
import { Button } from '@links-base/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@links-base/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@links-base/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@links-base/ui/tooltip'
import { cn } from '@links-base/ui/utils'

import {
  downloadConfig,
  importLocalStorageConfig,
  resetLocalStorageConfig
} from '../utils/local-storage'

type ConfigType = 'all' | 'preferences' | 'links' | 'analytics'

type ImportStatus = {
  success: string[]
  failed: string[]
  skipped: string[]
}

const CONFIG_OPTIONS = [
  {
    value: 'all',
    label: 'Everything',
    description: 'Export all settings and data'
  },
  {
    value: 'preferences',
    label: 'Display Preferences',
    description: 'Theme, sidebar state, and visual preferences'
  },
  {
    value: 'links',
    label: 'Links Configuration',
    description: 'Pinned links, hidden items, and custom tags'
  },
  {
    value: 'analytics',
    label: 'Analytics Data',
    description: 'Usage statistics and history'
  }
] as const

/**
 * Component for importing and exporting localStorage configuration
 */
export const StorageConfig = () => {
  const [error, setError] = useState<string | null>(null)
  const [selectedConfig, setSelectedConfig] = useState<ConfigType>('all')
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [resetType, setResetType] = useState<ConfigType>('all')
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      await handleImport(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleExport = () => {
    try {
      downloadConfig(selectedConfig)
      setError(null)
    } catch (err) {
      setError('Failed to export configuration')
    }
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const config = JSON.parse(text)

      const { success, status } = importLocalStorageConfig(config)
      setImportStatus(status)
      setIsImportDialogOpen(true)

      if (success) {
        setError(null)
      } else {
        setError('Some items failed to import')
      }
    } catch (err) {
      setError('Invalid configuration file')
      setImportStatus({
        success: [],
        failed: ['Failed to parse configuration file'],
        skipped: []
      })
      setIsImportDialogOpen(true)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleImport(file)
    }
  }

  const handleReset = () => {
    try {
      resetLocalStorageConfig(resetType)
      setIsResetDialogOpen(false)
      window.location.reload()
    } catch (err) {
      setError('Failed to reset configuration')
    }
  }

  const handleImportComplete = () => {
    setIsImportDialogOpen(false)
    if (importStatus?.success.length) {
      window.location.reload()
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Import/Export Configuration
            </h2>
            <p className="text-sm text-muted-foreground">
              Export or import your configuration settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={selectedConfig}
              onValueChange={value => setSelectedConfig(value as ConfigType)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select configuration" />
              </SelectTrigger>
              <SelectContent>
                {CONFIG_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 transition-colors',
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
          <FileJson className="mb-4 h-8 w-8 text-muted-foreground" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleFileInput}
          />
          <p className="text-sm text-muted-foreground">
            Click or drag and drop a configuration file to import
          </p>
        </div>

        <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            You can export your configuration and import it later or on another
            device.
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="ml-1 cursor-help underline">
                  Learn more
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-4">
                  <p>The configuration file includes:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>Display preferences</li>
                    <li>Links configuration</li>
                    <li>Analytics data</li>
                    <li>Other user settings</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </div>
      </div>

      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reset Configuration</h2>
            <p className="text-sm text-muted-foreground">
              Reset your configuration to default settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <Select
              value={resetType}
              onValueChange={value => setResetType(value as ConfigType)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select configuration" />
              </SelectTrigger>
              <SelectContent>
                {CONFIG_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog
              open={isResetDialogOpen}
              onOpenChange={setIsResetDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Reset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Configuration</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset{' '}
                    {resetType === 'all'
                      ? 'all settings'
                      : `your ${CONFIG_OPTIONS.find(opt => opt.value === resetType)?.label.toLowerCase()}`}
                    ? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsResetDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Reset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center gap-2 px-1 py-2 text-sm text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Resetting will restore the selected configuration to its default
            state. This action cannot be undone.
          </span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Import Results
            </DialogTitle>
            <DialogDescription>
              Summary of the configuration import process
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-4">
            {importStatus?.success.length ? (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="ml-2">
                  Successfully imported {importStatus.success.length} items:
                  <ul className="ml-6 mt-2 list-disc">
                    {importStatus.success.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            {importStatus?.failed.length ? (
              <Alert className="border-destructive/50 bg-destructive/10">
                <XCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="ml-2">
                  Failed to import {importStatus.failed.length} items:
                  <ul className="ml-6 mt-2 list-disc">
                    {importStatus.failed.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}

            {importStatus?.skipped.length ? (
              <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="ml-2">
                  Skipped {importStatus.skipped.length} items:
                  <ul className="ml-6 mt-2 list-disc">
                    {importStatus.skipped.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <DialogFooter>
            <Button onClick={handleImportComplete}>
              {importStatus?.success.length ? 'Apply Changes' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
