import type { Config } from 'tailwindcss'

import baseConfig from '@links-base/tailwind-config'

export default {
  content: [
    ...baseConfig.content,
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './packages/ui/**/*.{ts,tsx}'
  ],
  presets: [baseConfig]
} satisfies Config
