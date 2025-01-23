export interface InitOptions {
  template?: string
  typescript?: boolean
  dryRun?: boolean
}

export interface PackageJson {
  dependencies: Record<string, string>
  workspaces?: string[]
  [key: string]: unknown
}
