'use client'

import * as React from 'react'

import { ManageEntityPage } from '@/components/pages/manage-entity-page'

import { useHotkeys } from '@/hooks/use-hotkeys'

import { columnsLinks } from '@/app/admin/_components/links/columns-links'
import { LinkModal } from '@/app/admin/_components/links/link-modal'
import { DEFAULT_CATEGORY } from '@/constants'
import { useCategories } from '@/features/category/hooks/use-categories'
import { ImportExportMenu } from '@/features/data-manager/components/import-export-menu'
import { useLinksImportExport } from '@/features/data-manager/hooks/use-links-import-export'
import { FilterDropdown } from '@/features/filter/components/filter-dropdown'
import { LINK_FILTERS } from '@/features/filter/constants/filters'
import { useLinks } from '@/features/links/hooks/links/use-links'
import { type LinksApp } from '@/features/links/types/link.types'
import { searchTable } from '@/features/search/utils/search-table'

type LinkFilter = (typeof LINK_FILTERS)[number]['id']

export default function AdminManagePage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [openDialog, setOpenDialog] = React.useState<'add' | 'edit' | null>(
    null
  )
  const [editingLink, setEditingLink] = React.useState<LinksApp | null>(null)

  const [selectedLinkFilters, setSelectedLinkFilters] = React.useState<
    LinkFilter[]
  >([])

  const { categories } = useCategories()
  const { links, deleteLink, editLink, addLink } = useLinks()

  const { setImportType, handleExport } = useLinksImportExport({
    links,
    addLink: async link => {
      await addLink(link)
      return
    }
  })

  const applyFilters = (links: LinksApp[]): LinksApp[] => {
    if (selectedLinkFilters.length === 0) return links

    return links.filter(link => {
      return selectedLinkFilters.every(filter => {
        switch (filter) {
          case 'recent': {
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            return new Date(link.createdAt || '') >= sevenDaysAgo
          }
          case 'multi-env': {
            const envCount = Object.values(link.environments || {}).filter(
              Boolean
            ).length
            return envCount > 1
          }
          case 'uncategorized': {
            return !link.category || link.category === DEFAULT_CATEGORY
          }
          default: {
            return true
          }
        }
      })
    })
  }

  const filteredLinks = applyFilters(
    searchTable(links, searchTerm, ['name', 'category'])
  )

  const columns = columnsLinks({
    deleteLink: async (name: string) => {
      await deleteLink(name)
    },
    onEdit: (link: LinksApp) => {
      setEditingLink(link)
      setOpenDialog('edit')
    },
    registeredCategories: categories.map(cat => cat.name)
  })

  const handleAddLink = async (values: LinksApp) => {
    if (!values.environments?.production) {
      throw new Error('Production URL is required')
    }

    const linkExists = links.some(
      link => link.name.toLowerCase() === values.name.toLowerCase()
    )

    if (linkExists) {
      throw new Error('A link with this name already exists')
    }

    await addLink({
      ...values,
      environments: {
        production: values.environments.production,
        staging: values.environments.staging,
        integration: values.environments.integration
      }
    })
    setOpenDialog(null)
  }

  useHotkeys('c', () => setOpenDialog('add'))

  return (
    <ManageEntityPage
      title="Manage Links"
      description="Manage your internal links."
      filteredData={filteredLinks}
      columns={columns}
      searchPlaceholder="Search links..."
      setSearchTerm={setSearchTerm}
      beforeTable={
        <FilterDropdown
          options={LINK_FILTERS}
          selectedFilters={selectedLinkFilters}
          onToggleFilter={value => {
            setSelectedLinkFilters(current =>
              current.includes(value)
                ? current.filter(f => f !== value)
                : [...current, value]
            )
          }}
          onReset={() => setSelectedLinkFilters([])}
          filterTitle="Link Filters"
          buttonLabel={`Filter${selectedLinkFilters.length > 0 ? ` (${selectedLinkFilters.length})` : ''}`}
        />
      }
      afterFilters={
        <ImportExportMenu
          onImportTypeSelect={setImportType}
          onExport={handleExport}
        />
      }
      addButtonComponent={
        <LinkModal
          mode="add"
          open={openDialog === 'add'}
          onOpenChange={open => {
            setOpenDialog(open ? 'add' : null)
          }}
          onSubmit={handleAddLink}
        />
      }
      editModalComponent={
        editingLink && (
          <LinkModal
            mode="edit"
            open={openDialog === 'edit'}
            onOpenChange={open => {
              setOpenDialog(open ? 'edit' : null)
              if (!open) setEditingLink(null)
            }}
            onSubmit={data => editLink(editingLink.name, data)}
            initialValues={editingLink}
          />
        )
      }
    />
  )
}
