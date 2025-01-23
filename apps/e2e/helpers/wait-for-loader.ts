import { Page } from '@playwright/test'

/**
 * Helper function to wait for the loading spinner to disappear
 */
export const waitForLoader = async (page: Page) => {
  await page.waitForSelector('[role="status"]', { state: 'hidden' })
}
