import { expect, Page } from '@playwright/test'

export const pageFixtures = {
  /**
   * Verifies page title and heading
   */
  verifyPageHeading: async (
    page: Page,
    path: string,
    headingText: string,
    level = 1
  ) => {
    await page.goto(path)
    await expect(
      page.getByRole('heading', { name: headingText, level })
    ).toBeVisible()
  }
}
