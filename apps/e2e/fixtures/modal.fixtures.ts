import { expect, Page } from '@playwright/test'

export const modalFixtures = {
  /**
   * Verifies that clicking a button opens a specific modal
   */
  verifyModalOpening: async (
    page: Page,
    buttonName: string,
    modalTitle: string
  ) => {
    await page.getByRole('button', { name: buttonName }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: modalTitle })).toBeVisible()
  },

  /**
   * Verifies modal can be closed
   */
  verifyModalClosing: async (page: Page) => {
    const modal = page.getByRole('dialog')

    await modal.waitFor({ state: 'visible' })
    await page.waitForSelector('[data-state="open"]')

    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()
  }
}
