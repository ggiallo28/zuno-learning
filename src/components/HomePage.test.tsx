import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from './HomePage'
import { BrowserRouter } from 'react-router-dom'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

// Mock YouTube iframe
Object.defineProperty(global, 'HTMLIFrameElement', {
  value: class MockHTMLIFrameElement {
    src = ''
    style = {}
    setAttribute = vi.fn()
    getAttribute = vi.fn()
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('HomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render hero section', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Zuno://')).toBeInTheDocument()
    expect(screen.getByText(/Intelligenza Adattiva per l'Apprendimento Professionale/i)).toBeInTheDocument()
    expect(screen.getByText(/Trasforma il tuo apprendimento/i)).toBeInTheDocument()
  })

  it('should render all four coaches', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Elia l\'Elefante')).toBeInTheDocument()
    expect(screen.getByText('Skippy lo Scoiattolo')).toBeInTheDocument()
    expect(screen.getByText('Lupa la Lupa')).toBeInTheDocument()
    expect(screen.getByText('Polpo il Polpo')).toBeInTheDocument()
  })

  it('should render pricing tiers', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText('Piano Gratuito')).toBeInTheDocument()
    expect(screen.getByText('Piano Premium')).toBeInTheDocument()
    expect(screen.getByText('Piano Flex')).toBeInTheDocument()
  })

  it('should handle coach video preview', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    // Find and click a coach preview button
    const previewButton = screen.getAllByText(/Guarda Demo/i)[0]
    await user.click(previewButton)
    
    // Should open video dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  it('should close video dialog', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    // Open video dialog
    const previewButton = screen.getAllByText(/Guarda Demo/i)[0]
    await user.click(previewButton)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Close dialog
    const closeButton = screen.getByRole('button', { name: /chiudi/i })
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should handle newsletter signup', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    const emailInput = screen.getByPlaceholderText(/inserisci la tua email/i)
    const signupButton = screen.getByRole('button', { name: /iscriviti/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(signupButton)
    
    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/grazie per l'iscrizione/i)).toBeInTheDocument()
    })
  })

  it('should validate newsletter email', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    const emailInput = screen.getByPlaceholderText(/inserisci la tua email/i)
    const signupButton = screen.getByRole('button', { name: /iscriviti/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(signupButton)
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/email non valida/i)).toBeInTheDocument()
    })
  })

  it('should navigate to signup on CTA click', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    const ctaButton = screen.getAllByText(/Inizia Gratis/i)[0]
    await user.click(ctaButton)
    
    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  it('should handle pricing calculator', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    // Find the pricing slider in Flex plan
    const slider = screen.getByRole('slider', { name: /cap mensile/i })
    
    // Change slider value
    await user.click(slider)
    // Simulate slider change (this might need adjustment based on actual implementation)
    
    // Should update price calculation
    expect(screen.getByText(/€0.08\/lezione/i)).toBeInTheDocument()
  })

  it('should render testimonials', () => {
    renderWithRouter(<HomePage />)
    
    // Check for testimonial section
    expect(screen.getByText(/Cosa dicono i nostri utenti/i)).toBeInTheDocument()
    
    // Check for testimonial content
    expect(screen.getByText(/Marco R\./i)).toBeInTheDocument()
    expect(screen.getByText(/Sofia L\./i)).toBeInTheDocument()
    expect(screen.getByText(/Alessandro M\./i)).toBeInTheDocument()
  })

  it('should render features section', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText(/Perché scegliere Zuno/i)).toBeInTheDocument()
    expect(screen.getByText(/Apprendimento Personalizzato/i)).toBeInTheDocument()
    expect(screen.getByText(/Coach AI Specializzati/i)).toBeInTheDocument()
    expect(screen.getByText(/Progressi Misurabili/i)).toBeInTheDocument()
  })

  it('should be responsive', () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    renderWithRouter(<HomePage />)
    
    // Should render mobile-friendly layout
    expect(screen.getByText('Zuno://')).toBeInTheDocument()
    
    // Restore window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('should have proper accessibility attributes', () => {
    renderWithRouter(<HomePage />)
    
    // Check for proper headings hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    
    // Check for proper form labels
    const emailInput = screen.getByPlaceholderText(/inserisci la tua email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    
    // Check for proper button labels
    const ctaButtons = screen.getAllByRole('button', { name: /Inizia Gratis/i })
    expect(ctaButtons.length).toBeGreaterThan(0)
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    // Tab through interactive elements
    await user.tab()
    
    // Should focus on first interactive element
    const firstButton = screen.getAllByRole('button')[0]
    expect(firstButton).toHaveFocus()
  })

  it('should handle scroll to section', async () => {
    const user = userEvent.setup()
    
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = mockScrollIntoView
    
    renderWithRouter(<HomePage />)
    
    // Click on a navigation link (if present)
    const pricingLink = screen.getByText(/Prezzi/i)
    await user.click(pricingLink)
    
    expect(mockScrollIntoView).toHaveBeenCalled()
  })

  it('should render footer', () => {
    renderWithRouter(<HomePage />)
    
    expect(screen.getByText(/Zuno/i)).toBeInTheDocument()
    expect(screen.getByText(/Risorse/i)).toBeInTheDocument()
    expect(screen.getByText(/Legale/i)).toBeInTheDocument()
    expect(screen.getByText(/Connetti/i)).toBeInTheDocument()
  })

  it('should handle coach selection from home page', async () => {
    const user = userEvent.setup()
    renderWithRouter(<HomePage />)
    
    // Click on a coach card
    const eliaCard = screen.getByText('Elia l\'Elefante').closest('div')
    await user.click(eliaCard!)
    
    // Should navigate to signup with coach selection
    expect(mockNavigate).toHaveBeenCalledWith('/signup', { 
      state: { selectedCoach: 'elia' } 
    })
  })

  it('should show loading states', async () => {
    renderWithRouter(<HomePage />)
    
    // Newsletter signup should show loading
    const user = userEvent.setup()
    const emailInput = screen.getByPlaceholderText(/inserisci la tua email/i)
    const signupButton = screen.getByRole('button', { name: /iscriviti/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(signupButton)
    
    // Should show loading state briefly
    expect(signupButton).toBeDisabled()
  })

  it('should handle error states', async () => {
    const user = userEvent.setup()
    
    // Mock fetch to simulate network error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    
    renderWithRouter(<HomePage />)
    
    const emailInput = screen.getByPlaceholderText(/inserisci la tua email/i)
    const signupButton = screen.getByRole('button', { name: /iscriviti/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(signupButton)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/errore durante l'iscrizione/i)).toBeInTheDocument()
    })
  })
})