import { expect, test } from '@playwright/test'

import { TEST_CONSTANTS } from '../constants/test.constants'
import { pageFixtures } from '../fixtures/page.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Admin Dashboard Page', () => {
  const { PATHS } = TEST_CONSTANTS

  test('should display the dashboard page with title', async ({ page }) => {
    await pageFixtures.verifyPageHeading(
      page,
      PATHS.ADMIN_DASHBOARD,
      'Dashboard'
    )
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PATHS.ADMIN_DASHBOARD)
    await checkA11y(page)
  })
})
