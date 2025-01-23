import { type ReactElement } from 'react'

import { queries, within } from '@testing-library/dom'
import {
  type RenderOptions,
  type RenderResult,
  render
} from '@testing-library/react'

// Import your actual providers
import { RootProvider } from '@/components/root-provider'

// Add portal setup
beforeAll(() => {
  // Create portal root element
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'radix-portal')
  document.body.appendChild(portalRoot)
})

afterAll(() => {
  // Clean up portal root after all tests
  const portalRoot = document.getElementById('radix-portal')
  if (portalRoot) {
    portalRoot.remove()
  }
})

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string
}

const customQueries = {
  getCustomElement: (container: HTMLElement, text: string) =>
    within(container).getByTestId(`custom-${text}`)
}

export function renderWithProviders(
  ui: ReactElement,
  { ...renderOptions }: CustomRenderOptions = {}
): RenderResult & {
  getCustomElement: (text: string) => HTMLElement
} {
  // Create portal container for each test if it doesn't exist
  if (!document.getElementById('radix-portal')) {
    const portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'radix-portal')
    document.body.appendChild(portalRoot)
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <RootProvider>{children}</RootProvider>
  }

  const renderResult = render(ui, {
    wrapper: Wrapper,
    queries: { ...queries, ...customQueries },
    ...renderOptions
  })

  return {
    ...renderResult,
    getCustomElement: (text: string) =>
      customQueries.getCustomElement(renderResult.container, text)
  }
}

// Export everything from testing-library
export * from '@testing-library/react'

export { renderWithProviders as render }
