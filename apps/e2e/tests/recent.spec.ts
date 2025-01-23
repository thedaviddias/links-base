import { expect, test } from '@playwright/test'

import { TEST_CONSTANTS } from '../constants/test.constants'
import { pageFixtures } from '../fixtures/page.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Recent Activity Page', () => {
  const { PATHS } = TEST_CONSTANTS

  test('should display the recent activity page with title', async ({
    page
  }) => {
    await pageFixtures.verifyPageHeading(
      page,
      PATHS.RECENT,
      'Recently Added Links'
    )
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PATHS.RECENT)
    await checkA11y(page)
  })
})
