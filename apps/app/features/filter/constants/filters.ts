import { Clock, FolderX, Server } from 'lucide-react'

import { type ChangeType } from '@/features/filter/hooks/useChangeTypeFilter'
import type { FilterOption } from '@/features/filter/types/filters'

import { DEFAULT_CATEGORY } from '../../../constants'

export const LINK_FILTERS: FilterOption[] = [
  {
    id: 'recent',
    label: 'Recent (7 days)',
    type: 'date',
    icon: Clock
  },
  {
    id: 'multi-env',
    label: 'Multiple Environments',
    type: 'environment',
    icon: Server
  },
  {
    id: 'uncategorized',
    label: DEFAULT_CATEGORY,
    type: 'category',
    icon: FolderX
  }
]

export const CHANGE_TYPES: FilterOption[] = [
  { id: 'feat' as ChangeType, label: 'Features' },
  { id: 'fix' as ChangeType, label: 'Bug Fixes' },
  { id: 'docs' as ChangeType, label: 'Documentation' },
  { id: 'chore' as ChangeType, label: 'Chores' },
  { id: 'style' as ChangeType, label: 'Styles' },
  { id: 'refactor' as ChangeType, label: 'Refactors' },
  { id: 'perf' as ChangeType, label: 'Performance' },
  { id: 'test' as ChangeType, label: 'Tests' }
]
