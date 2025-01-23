import { expect, test } from '@playwright/test'

import { checkA11y } from '../utils/accessibility'

test.describe('Homepage', () => {
  test('should display the homepage with title', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/')

    // Check for the "Home" heading
    await expect(
      page.getByRole('heading', { name: 'Home', level: 1 })
    ).toBeVisible()
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto('/')
    await checkA11y(page)
  })
})
