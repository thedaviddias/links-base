import { expect, Page } from '@playwright/test'

import { waitForLoader } from '../helpers/wait-for-loader'

type TabTest = {
  tab: string
  content: string
}

export const tabsFixtures = {
  /**
   * Verifies switching between tabs and their content
   */
  verifyTabSwitching: async (page: Page, tabs: TabTest[]) => {
    await waitForLoader(page)

    for (const { tab, content } of tabs) {
      // Click the tab
      await page.getByRole('tab', { name: tab }).click()

      // Verify tab is selected
      await expect(
        page.getByRole('tab', { name: tab, selected: true })
      ).toBeVisible()

      // Verify content is visible
      await expect(page.getByRole('heading', { name: content })).toBeVisible()
    }
  }
}
