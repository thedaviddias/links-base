export const IS_NOT_PRODUCTION = process.env.NODE_ENV !== 'production'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const DEFAULT_CATEGORY = 'Uncategorized'

export const BADGE_STYLE =
  'bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 dark:bg-red-800 z-50 group flex items-center gap-1'

export const DEFAULT_COLOR = '#000000'

export const PINNED_LINKS_GRID_CLASSES = `
  grid
  gap-4
  auto-rows-fr
  grid-cols-2
  [--card-width:300px]
  @[700px]:grid-cols-4
  @[1000px]:grid-cols-5
  @[1200px]:grid-cols-6
  @[1600px]:grid-cols-8
`

export const LINKS_GRID_CLASSES = `
  grid
  gap-4
  auto-rows-fr
  grid-cols-2
  [--card-width:300px]
  @[700px]:grid-cols-3
  @[1000px]:grid-cols-4
  @[1200px]:grid-cols-5
  @[1600px]:grid-cols-7
  @[1900px]:grid-cols-8
  @[2300px]:grid-cols-9
`

export const SUPPORT_LINKS = {
  HELP: 'https://linksbase.app/help',
  FEATURE_REQUESTS:
    'https://github.com/thedaviddias/links-base/issues/new/choose',
  SPONSOR: 'https://linksbase.app/sponsor'
}
