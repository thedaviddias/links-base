import { useState } from 'react'

import { toast } from 'sonner'

import { DEFAULT_CATEGORY, DEFAULT_COLOR } from '@/constants'
import { type ImportResult } from '@/features/data-manager/types/import'
import { processBookmarksFile } from '@/features/data-manager/utils/bookmarks-processor'
import { processCSVFile } from '@/features/data-manager/utils/csv-processor'
import {
  LinksExporter,
  downloadFile
} from '@/features/data-manager/utils/links-exporter'
import { type LinksApp } from '@/features/links/types/link.types'

interface UseLinksImportExportProps {
  links: LinksApp[]
  addLink: (link: LinksApp) => Promise<void>
}

export const useLinksImportExport = ({
  links,
  addLink
}: UseLinksImportExportProps) => {
  const [importType, setImportType] = useState<'csv' | 'bookmarks' | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [importResults, setImportResults] = useState<ImportResult | null>(null)

  const handleFileImport = async (file: File) => {
    try {
      const importedLinks = await (importType === 'csv'
        ? processCSVFile(file)
        : processBookmarksFile(file))

      const result: ImportResult = {
        success: { added: [], updated: [] },
        failed: [],
        categories: { new: [], existing: [] }
      }

      const existingCategories = new Set(links.map(link => link.category))

      for (const importedLink of importedLinks) {
        try {
          if (!importedLink.name || !importedLink.environments?.production) {
            result.failed.push({
              name: importedLink.name || 'Unnamed',
              url: importedLink.environments?.production || 'No URL',
              reason: 'invalid'
            })
            continue
          }

          const existingLink = links.find(
            l => l.name?.toLowerCase() === importedLink.name?.toLowerCase()
          )

          if (existingLink) {
            result.failed.push({
              name: importedLink.name,
              url: importedLink.environments.production,
              reason: 'duplicate'
            })
            continue
          }

          if (importedLink.category) {
            if (!existingCategories.has(importedLink.category)) {
              result.categories.new.push(importedLink.category)
              existingCategories.add(importedLink.category)
            } else {
              result.categories.existing.push(importedLink.category)
            }
          } else {
            importedLink.category = DEFAULT_CATEGORY
          }

          const processedLink = {
            name: importedLink.name,
            color: importedLink.color || DEFAULT_COLOR,
            tags: importedLink.tags,
            description: importedLink.description || '',
            category: importedLink.category,
            environments: {
              production: importedLink.environments.production,
              ...(importedLink.environments.staging && {
                staging: importedLink.environments.staging
              }),
              ...(importedLink.environments.integration && {
                integration: importedLink.environments.integration
              })
            }
          }

          await addLink(processedLink as LinksApp)
          result.success.added.push({
            name: importedLink.name,
            url: importedLink.environments.production
          })
        } catch (error) {
          result.failed.push({
            name: importedLink.name || 'Unnamed',
            url: importedLink.environments?.production || 'No URL',
            reason: 'error'
          })
        }
      }

      setImportType(null)

      if (result.success.added.length > 0) {
        toast.success(`Added ${result.success.added.length} new links`)
      }
      if (result.failed.length > 0) {
        const duplicates = result.failed.filter(
          f => f.reason === 'duplicate'
        ).length
        const invalid = result.failed.filter(f => f.reason === 'invalid').length
        const errors = result.failed.filter(f => f.reason === 'error').length

        if (duplicates > 0) {
          toast.error(`${duplicates} link(s) already exist`)
        }
        if (invalid > 0) {
          toast.error(`${invalid} link(s) are invalid`)
        }
        if (errors > 0) {
          toast.error(`${errors} link(s) failed to import`)
        }
      }
      if (result.categories.new.length > 0) {
        toast.info(`Added ${result.categories.new.length} new categories`)
      }

      setTimeout(() => {
        setImportResults(result)
        setShowResultsModal(true)
      }, 100)
    } catch (error) {
      toast.error('Import failed: ' + (error as Error).message)
    }
  }

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

  return {
    importType,
    setImportType,
    showResultsModal,
    setShowResultsModal,
    importResults,
    setImportResults,
    handleFileImport,
    handleExport
  }
}
