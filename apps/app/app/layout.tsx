'use client'

import { RootProvider } from '@/components/root-provider'

import '@/styles/globals.css'
import '@/styles/mdx-editor.css'

import { cn } from '@links-base/ui/utils'

import { cormorant_garamond, libre_franklin } from '../lib/fonts'

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen font-sans',
          libre_franklin.variable + ' ' + cormorant_garamond.variable
        )}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
