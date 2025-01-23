import { test } from '@playwright/test'

import { modalFixtures } from '../fixtures/modal.fixtures'
import { pageFixtures } from '../fixtures/page.fixtures'
import { tableFixtures } from '../fixtures/table.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Admin Manage Links Page', () => {
  const PAGE_PATH = '/admin/manage/links'
  const TABLE_COLUMNS = ['Name', 'Brand Color', 'Category', 'Tags', 'Actions']

  test('should display the manage links page with title', async ({ page }) => {
    await pageFixtures.verifyPageHeading(page, PAGE_PATH, 'Manage Links')
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await checkA11y(page)
  })

  test.skip('should display links table with correct columns', async ({
    page
  }) => {
    await page.goto(PAGE_PATH)
    await tableFixtures.verifyTableColumns(page, TABLE_COLUMNS)
  })

  test('should open modal when clicking Add Link button', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await modalFixtures.verifyModalOpening(page, 'Add Link', 'Add Link')
    await modalFixtures.verifyModalClosing(page)
  })
})
