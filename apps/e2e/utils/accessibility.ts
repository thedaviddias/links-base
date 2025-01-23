import AxeBuilder from '@axe-core/playwright'
import { expect, Page } from '@playwright/test'

/**
 * Runs accessibility tests on the current page
 */
export const checkA11y = async (page: Page) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(accessibilityScanResults.violations).toEqual([])
}
