import { expect, Page } from '@playwright/test'

import { waitForLoader } from '../helpers/wait-for-loader'

type StatCard = {
  title: string
  hasValue: boolean
}

export const statsFixtures = {
  /**
   * Verifies that stats cards are present with correct titles and values
   */
  verifyStatsCards: async (page: Page, cards: StatCard[]) => {
    await waitForLoader(page)

    // Get the stats grid container
    const statsGrid = page.getByTestId('stats-grid')
    await expect(statsGrid).toBeVisible()

    for (const card of cards) {
      // Find the card by its title text
      const cardElement = statsGrid.getByText(card.title).first()
      await expect(cardElement).toBeVisible()

      if (card.hasValue) {
        // Find the value element that follows the title
        const valueElement = cardElement.locator('xpath=following-sibling::*')
        await expect(valueElement).toBeVisible()
        // Verify it's a number
        const value = await valueElement.textContent()
        expect(Number.isNaN(Number(value))).toBeFalsy()
      }
    }
  }
}
