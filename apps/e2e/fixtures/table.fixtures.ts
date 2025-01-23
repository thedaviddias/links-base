import { expect, Page } from '@playwright/test'

import { waitForLoader } from '../helpers/wait-for-loader'

export const tableFixtures = {
  /**
   * Verifies that a table is present with specific columns
   */
  verifyTableColumns: async (page: Page, columns: string[]) => {
    await waitForLoader(page)
    await expect(page.getByRole('table')).toBeVisible()

    for (const column of columns) {
      await expect(page.locator('th', { hasText: column })).toBeVisible()
    }
  }
}
