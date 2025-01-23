import { type LucideIcon } from 'lucide-react'

/** Props for the page header data */
export type PageHeaderData = {
  /** The title of the page */
  pageTitle: string
  /** The description text below the title */
  description?: string
  /** Optional icon component to display */
  icon?: LucideIcon
}

/** Props for the PageHeader component */
export type PageHeaderProps = {
  /** The page header data object */
  pageData?: PageHeaderData
}

const DEFAULT_PAGE_DATA: PageHeaderData = {
  pageTitle: 'Page Not Found',
  description: 'The requested page information could not be found'
} as const

/**
 * Displays a consistent page header with optional icon, title and description
 */
export const PageHeader = ({
  pageData = DEFAULT_PAGE_DATA
}: PageHeaderProps) => {
  const Icon = pageData.icon

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted md:flex">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{pageData.pageTitle}</h1>
          <span className="text-muted-foreground">{pageData.description}</span>
        </div>
      </div>
    </div>
  )
}
