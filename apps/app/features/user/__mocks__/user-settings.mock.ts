import { type UserSettings } from '@/features/user/stores/useUserSettingsStore'

export const mockUserSettings: UserSettings = {
  cardSize: 'default',
  cardSizeConfigs: {
    compact: {
      containerClasses: '',
      imageClasses: '',
      titleClasses: '',
      padding: 'p-2'
    },
    default: {
      containerClasses: '',
      imageClasses: '',
      titleClasses: '',
      padding: 'p-4'
    }
  },
  showGradients: true,
  showFavorites: false,
  hiddenCategories: [],
  newLinksInHiddenCategories: {},
  setHiddenCategories: jest.fn(),
  toggleHiddenCategory: jest.fn(),
  setCardSize: jest.fn(),
  setShowGradients: jest.fn(),
  setShowFavorites: jest.fn(),
  showDescriptions: true,
  showTags: true,
  showIcons: true,
  showEnvironmentBadges: true,
  setShowDescriptions: jest.fn(),
  setShowTags: jest.fn(),
  setShowIcons: jest.fn(),
  setShowEnvironmentBadges: jest.fn(),
  updateNewLinksCount: jest.fn(),
  resetNewLinksCount: jest.fn(),
  resetToDefaults: jest.fn(),
  previousDescriptionState: true,
  previousTagsState: true
} as const
