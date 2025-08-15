import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display sign in form', async ({ page }) => {
    // Check if we're on the auth page or if there's a sign in button
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Should show sign in form
    await expect(page.getByRole('heading', { name: /accedi/i })).toBeVisible()
    await expect(page.getByLabel(/email|username/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /accedi/i })).toBeVisible()
  })

  test('should show validation errors for invalid credentials', async ({ page }) => {
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Fill in invalid credentials
    await page.getByLabel(/email|username/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /accedi/i }).click()

    // Should show error message
    await expect(page.getByText(/credenziali non valide|invalid credentials/i)).toBeVisible()
  })

  test('should navigate to sign up form', async ({ page }) => {
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Click sign up link
    await page.getByRole('link', { name: /registrati|sign up/i }).click()

    // Should show sign up form
    await expect(page.getByRole('heading', { name: /registrati/i })).toBeVisible()
    await expect(page.getByLabel(/nome|name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /registrati/i })).toBeVisible()
  })

  test('should show password strength indicator', async ({ page }) => {
    // Navigate to sign up
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }
    await page.getByRole('link', { name: /registrati|sign up/i }).click()

    // Type a weak password
    await page.getByLabel(/password/i).fill('weak')
    await expect(page.getByText(/password troppo debole|password too weak/i)).toBeVisible()

    // Type a strong password
    await page.getByLabel(/password/i).fill('StrongPassword123!')
    await expect(page.getByText(/password forte|strong password/i)).toBeVisible()
  })

  test('should handle forgot password flow', async ({ page }) => {
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Click forgot password link
    await page.getByRole('link', { name: /password dimenticata|forgot password/i }).click()

    // Should show forgot password form
    await expect(page.getByRole('heading', { name: /recupera password|reset password/i })).toBeVisible()
    await expect(page.getByLabel(/email|username/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /invia|send/i })).toBeVisible()

    // Fill in email and submit
    await page.getByLabel(/email|username/i).fill('test@example.com')
    await page.getByRole('button', { name: /invia|send/i }).click()

    // Should show confirmation message
    await expect(page.getByText(/email inviata|email sent/i)).toBeVisible()
  })

  test('should be accessible', async ({ page }) => {
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Check for proper form labels
    const emailInput = page.getByLabel(/email|username/i)
    const passwordInput = page.getByLabel(/password/i)
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // Check keyboard navigation
    await emailInput.focus()
    await expect(emailInput).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(passwordInput).toBeFocused()

    // Check for proper ARIA attributes
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should handle successful authentication', async ({ page }) => {
    // This test would require setting up test user credentials
    // For now, we'll test the UI flow without actual authentication
    
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Fill in test credentials (these would need to be valid test credentials)
    await page.getByLabel(/email|username/i).fill('testuser@example.com')
    await page.getByLabel(/password/i).fill('TestPassword123!')
    
    // The form should be ready to submit
    const submitButton = page.getByRole('button', { name: /accedi/i })
    await expect(submitButton).toBeEnabled()
  })

  test('should show loading state during authentication', async ({ page }) => {
    // Navigate to sign in if needed
    const signInButton = page.getByRole('button', { name: /accedi|sign in/i })
    if (await signInButton.isVisible()) {
      await signInButton.click()
    }

    // Fill in credentials
    await page.getByLabel(/email|username/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Click submit and check for loading state
    await page.getByRole('button', { name: /accedi/i }).click()
    
    // Should show loading indicator
    await expect(page.getByText(/caricamento|loading/i)).toBeVisible()
  })
})