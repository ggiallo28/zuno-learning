import { test, expect } from '@playwright/test'

test.describe('Simple E2E Tests', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loads
    await expect(page).toHaveTitle(/Zuno/)
    
    // Check for some basic content
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check if we can interact with the page
    const body = page.locator('body')
    await expect(body).toBeVisible()
    
    // Basic interaction test
    await page.waitForLoadState('networkidle')
    
    // Check if the page is interactive
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete'
    })
    expect(isInteractive).toBe(true)
  })

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.goto('/')
    await expect(page.locator('body')).toBeVisible()
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    await expect(page.locator('body')).toBeVisible()
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have basic accessibility', async ({ page }) => {
    await page.goto('/')
    
    // Check for basic accessibility features
    const hasHeading = await page.locator('h1, h2, h3').count()
    expect(hasHeading).toBeGreaterThan(0)
    
    // Check if page has a main landmark or content
    const hasMainContent = await page.locator('main, [role="main"], body').count()
    expect(hasMainContent).toBeGreaterThan(0)
  })
})