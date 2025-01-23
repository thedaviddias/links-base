import { test } from '@playwright/test'

import { modalFixtures } from '../fixtures/modal.fixtures'
import { pageFixtures } from '../fixtures/page.fixtures'
import { tableFixtures } from '../fixtures/table.fixtures'
import { checkA11y } from '../utils/accessibility'

test.describe('Admin Manage Categories Page', () => {
  const PAGE_PATH = '/admin/manage/categories'

  const TABLE_COLUMNS = ['Name', 'Brand Color', 'Category', 'Tags', 'Actions']

  test('should display the manage categories page with title', async ({
    page
  }) => {
    await pageFixtures.verifyPageHeading(page, PAGE_PATH, 'Manage Categories')
  })

  test.skip('should pass accessibility tests', async ({ page }) => {
    await page.goto(PAGE_PATH)
    await checkA11y(page)
  })

  test.skip('should display categories table with correct columns', async ({
    page
  }) => {
    await page.goto(PAGE_PATH)
    await tableFixtures.verifyTableColumns(page, TABLE_COLUMNS)
  })

  test('should open modal when clicking Add Category button', async ({
    page
  }) => {
    await page.goto(PAGE_PATH)
    await modalFixtures.verifyModalOpening(page, 'Add Category', 'Add Category')
    await modalFixtures.verifyModalClosing(page)
  })
})
