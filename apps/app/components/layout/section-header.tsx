import { type LucideIcon } from 'lucide-react'

export type SectionHeaderProps = {
  title: string
  information?: React.ReactNode | string
  icon?: LucideIcon | null
  children?: React.ReactNode
  description?: string
}

export function SectionHeader({
  title,
  information,
  icon: Icon,
  children,
  description
}: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {Icon && (
        <div className="mt-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted md:flex">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold leading-tight">{title}</h2>
          {information && (
            <span className="text-sm text-muted-foreground">{information}</span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
