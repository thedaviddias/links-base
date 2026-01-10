import { Cormorant_Garamond, Libre_Franklin } from 'next/font/google'

import { RootProvider } from '@/components/root-provider'

import '@/styles/globals.css'
import '@/styles/mdx-editor.css'

import { cn } from '@links-base/ui/utils'

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin'
})

const cormorant_garamond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant_garamond',
  weight: '300'
})

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
