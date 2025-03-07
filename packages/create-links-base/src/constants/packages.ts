export const CORE_PACKAGES = [
  '@links-base/ui',
  '@links-base/tsconfig',
  '@links-base/tailwind-config'
] as const

export const PACKAGE_NAME_MAP: Record<string, string> = {
  tsconfig: 'config-tsconfig',
  ui: 'ui',
  'tailwind-config': 'config-tailwind'
}
