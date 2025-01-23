import { expect, test } from '@playwright/test'

import { TEST_CONSTANTS } from '../constants/test.constants'
import { pageFixtures } from '../fixtures/page.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Analytics Page', () => {
  const { PATHS } = TEST_CONSTANTS

  test('should display the analytics page with title', async ({ page }) => {
    await pageFixtures.verifyPageHeading(
      page,
      PATHS.ANALYTICS,
      'Analytics Dashboard'
    )
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PATHS.ANALYTICS)
    await checkA11y(page)
  })

  test('should display overview tab content by default', async ({ page }) => {
    await page.goto(PATHS.ANALYTICS)

    // Verify stats cards are visible
    await expect(
      page.getByRole('heading', { name: 'Total Clicks' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Most Clicked Link' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Unique Links Clicked' })
    ).toBeVisible()
  })
})
