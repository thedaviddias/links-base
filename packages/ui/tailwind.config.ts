import type { Config } from 'tailwindcss'

import baseConfig from '@links-base/tailwind-config'

export default {
  darkMode: ['class'],
  content: baseConfig.content,
  presets: [baseConfig]
} satisfies Config
