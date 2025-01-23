import { expect, test } from '@playwright/test'

import { pageFixtures } from '../fixtures/page.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Admin Settings Page', () => {
  const PAGE_PATH = '/admin/settings'

  test('should display the settings page with title', async ({ page }) => {
    await pageFixtures.verifyPageHeading(page, PAGE_PATH, 'Settings')
    await expect(
      page.getByRole('heading', { name: 'General Settings' })
    ).toBeVisible()
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await checkA11y(page)
  })
})
