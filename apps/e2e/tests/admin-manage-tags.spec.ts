import { test } from '@playwright/test'

import { modalFixtures } from '../fixtures/modal.fixtures'
import { pageFixtures } from '../fixtures/page.fixtures'
import { tableFixtures } from '../fixtures/table.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Admin Manage Tags Page', () => {
  const PAGE_PATH = '/admin/manage/tags'

  const TABLE_COLUMNS = ['Name', 'Brand Color', 'Category', 'Tags', 'Actions']

  test('should display the manage tags page with title', async ({ page }) => {
    await pageFixtures.verifyPageHeading(page, PAGE_PATH, 'Manage Tags')
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await checkA11y(page)
  })

  test.skip('should display tags table with correct columns', async ({
    page
  }) => {
    await page.goto(PAGE_PATH)
    await tableFixtures.verifyTableColumns(page, TABLE_COLUMNS)
  })

  test('should open modal when clicking Add Tag button', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await modalFixtures.verifyModalOpening(page, 'Add Tag', 'Add Tag')
    await modalFixtures.verifyModalClosing(page)
  })
})
