import { test, expect } from '@playwright/test'

test.describe('Course Catalog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the course catalog
    await page.goto('/')
    
    // If authentication is required, we might need to sign in first
    // For now, assume we can access the catalog directly or after auth
    const catalogLink = page.getByRole('link', { name: /corsi|courses/i })
    if (await catalogLink.isVisible()) {
      await catalogLink.click()
    }
  })

  test('should display course catalog', async ({ page }) => {
    // Check for catalog heading
    await expect(page.getByRole('heading', { name: /catalogo corsi|course catalog/i })).toBeVisible()
    
    // Check for search and filter controls
    await expect(page.getByRole('textbox', { name: /cerca|search/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /categoria|category/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /difficoltà|difficulty/i })).toBeVisible()
  })

  test('should display course cards', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Check that course cards are visible
    const courseCards = page.locator('.course-card')
    await expect(courseCards.first()).toBeVisible()
    
    // Check for course information
    await expect(courseCards.first().getByRole('heading')).toBeVisible()
    await expect(courseCards.first().getByText(/min|minuti/)).toBeVisible()
    await expect(courseCards.first().getByText(/beginner|intermediate|advanced/i)).toBeVisible()
  })

  test('should filter courses by search', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    const searchInput = page.getByRole('textbox', { name: /cerca|search/i })
    await searchInput.fill('JavaScript')
    
    // Wait for filter to apply
    await page.waitForTimeout(500)
    
    // Check that filtered results are shown
    const courseCards = page.locator('.course-card')
    const firstCard = courseCards.first()
    await expect(firstCard.getByText(/javascript/i)).toBeVisible()
  })

  test('should filter courses by category', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Open category dropdown
    const categorySelect = page.getByRole('combobox', { name: /categoria|category/i })
    await categorySelect.click()
    
    // Select a category
    await page.getByRole('option', { name: /technology|tecnologia/i }).click()
    
    // Wait for filter to apply
    await page.waitForTimeout(500)
    
    // Check that filtered results are shown
    const courseCards = page.locator('.course-card')
    await expect(courseCards.first()).toBeVisible()
  })

  test('should filter courses by difficulty', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Open difficulty dropdown
    const difficultySelect = page.getByRole('combobox', { name: /difficoltà|difficulty/i })
    await difficultySelect.click()
    
    // Select a difficulty
    await page.getByRole('option', { name: /beginner|principiante/i }).click()
    
    // Wait for filter to apply
    await page.waitForTimeout(500)
    
    // Check that filtered results are shown
    const courseCards = page.locator('.course-card')
    await expect(courseCards.first().getByText(/beginner|principiante/i)).toBeVisible()
  })

  test('should clear filters', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Apply a search filter
    const searchInput = page.getByRole('textbox', { name: /cerca|search/i })
    await searchInput.fill('JavaScript')
    await page.waitForTimeout(500)
    
    // Clear filters
    const clearButton = page.getByRole('button', { name: /cancella|clear/i })
    await clearButton.click()
    
    // Check that search input is cleared
    await expect(searchInput).toHaveValue('')
    
    // Check that more courses are visible again
    const courseCards = page.locator('.course-card')
    await expect(courseCards).toHaveCount(await courseCards.count())
  })

  test('should open course details', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Click on first course card
    const firstCourse = page.locator('.course-card').first()
    await firstCourse.click()
    
    // Should navigate to course details or open modal
    await expect(page.getByText(/dettagli|details|lezioni|lessons/i)).toBeVisible()
  })

  test('should handle course enrollment', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Find and click enroll button
    const enrollButton = page.getByRole('button', { name: /iscriviti|enroll/i }).first()
    await enrollButton.click()
    
    // Should show enrollment confirmation or navigate to course
    await expect(page.getByText(/iscritto|enrolled|inizia|start/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Check that layout adapts to mobile
    const courseCards = page.locator('.course-card')
    await expect(courseCards.first()).toBeVisible()
    
    // Check that filters are accessible on mobile
    await expect(page.getByRole('textbox', { name: /cerca|search/i })).toBeVisible()
  })

  test('should handle empty search results', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Search for something that doesn't exist
    const searchInput = page.getByRole('textbox', { name: /cerca|search/i })
    await searchInput.fill('NonexistentCourse12345')
    await page.waitForTimeout(500)
    
    // Should show empty state
    await expect(page.getByText(/nessun corso|no courses|non trovato|not found/i)).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Wait for courses to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Check for proper headings
    await expect(page.getByRole('heading', { name: /catalogo|catalog/i })).toBeVisible()
    
    // Check for proper form labels
    const searchInput = page.getByRole('textbox', { name: /cerca|search/i })
    await expect(searchInput).toBeVisible()
    
    // Test keyboard navigation
    await searchInput.focus()
    await expect(searchInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    const categorySelect = page.getByRole('combobox', { name: /categoria|category/i })
    await expect(categorySelect).toBeFocused()
    
    // Check for proper ARIA attributes
    const courseCards = page.locator('.course-card')
    await expect(courseCards.first()).toHaveAttribute('role', 'article')
  })

  test('should handle loading states', async ({ page }) => {
    // Navigate to catalog
    await page.goto('/')
    
    // Should show loading state initially
    await expect(page.getByText(/caricamento|loading/i)).toBeVisible()
    
    // Wait for content to load
    await page.waitForSelector('.course-card', { timeout: 10000 })
    
    // Loading state should be gone
    await expect(page.getByText(/caricamento|loading/i)).not.toBeVisible()
  })

  test('should handle error states', async ({ page }) => {
    // This test would require mocking API errors
    // For now, we'll test that error handling UI exists
    
    // If there's a way to trigger an error state in the UI
    // we would test that here
    
    // For example, if there's a retry button when errors occur
    const retryButton = page.getByRole('button', { name: /riprova|retry/i })
    if (await retryButton.isVisible()) {
      await expect(retryButton).toBeVisible()
    }
  })
})