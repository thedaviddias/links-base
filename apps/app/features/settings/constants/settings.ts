export const SETTINGS_TABS = [
  {
    value: 'general',
    label: 'General'
  },
  {
    value: 'links',
    label: 'Links'
  },
  {
    value: 'requests',
    label: 'Requests'
  },
  {
    value: 'help',
    label: 'Help'
  },
  {
    value: 'services',
    label: 'Services'
  },
  {
    value: 'danger',
    label: 'Danger Zone'
  }
] as const

export type SettingsTabValue = (typeof SETTINGS_TABS)[number]['value']
