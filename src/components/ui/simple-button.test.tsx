import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Simple button component for testing
interface SimpleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

function SimpleButton({ children, onClick, disabled = false, variant = 'primary' }: SimpleButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium'
  const variantClasses = variant === 'primary' 
    ? 'bg-blue-500 text-white hover:bg-blue-600' 
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  )
}

describe('SimpleButton', () => {
  it('should render with children', () => {
    render(<SimpleButton>Click me</SimpleButton>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('should handle click events', () => {
    let clicked = false
    const handleClick = () => { clicked = true }
    
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>)
    
    const button = screen.getByRole('button')
    button.click()
    
    expect(clicked).toBe(true)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<SimpleButton disabled>Disabled</SimpleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should render different variants', () => {
    const { rerender } = render(<SimpleButton variant="primary">Primary</SimpleButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500')

    rerender(<SimpleButton variant="secondary">Secondary</SimpleButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')
  })

  it('should have proper accessibility attributes', () => {
    render(<SimpleButton>Accessible Button</SimpleButton>)
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })
})