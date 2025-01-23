import { useState } from 'react'

import { type SortingState } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'

import { ListFilters } from '@/app/admin/_components/list-filters'

export type ManageEntityPageProps<T> = {
  /** Page title */
  title: string
  /** Page description */
  description: string
  /** Filtered data array */
  filteredData: T[]
  /** Table columns configuration */
  columns: any
  /** Search placeholder text */
  searchPlaceholder: string
  /** Search term setter */
  setSearchTerm: (term: string) => void
  /** Add button component */
  addButtonComponent: React.ReactNode
  /** Modal component for editing */
  editModalComponent?: React.ReactNode
  /** Additional components to render before the table */
  beforeTable?: React.ReactNode
  /** Additional components to render after the filters */
  afterFilters?: React.ReactNode
  /** Custom no results message (optional) */
  noResultsMessage?: string
}

/**
 * Manage entity page component
 *
 * @param props - ManageEntityPageProps
 * @returns React.ReactNode
 */
export const ManageEntityPage = <T extends object>({
  title,
  description,
  filteredData,
  columns,
  searchPlaceholder,
  setSearchTerm,
  addButtonComponent,
  editModalComponent,
  beforeTable,
  afterFilters,
  noResultsMessage = 'No results found'
}: ManageEntityPageProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const hasData = filteredData.length > 0
  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>

      <div className="space-between flex space-x-2">
        {beforeTable}

        <div className="flex flex-1 justify-end gap-2">
          <ListFilters
            onSearch={setSearchTerm}
            addButtonComponent={addButtonComponent}
            searchPlaceholder={searchPlaceholder}
          />
          {afterFilters}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        {hasData ? (
          <DataTable
            columns={columns}
            data={filteredData}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground">{noResultsMessage}</p>
          </div>
        )}

        {editModalComponent}
      </div>
    </main>
  )
}
