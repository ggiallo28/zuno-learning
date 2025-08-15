import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { createContext, useContext, useState } from 'react'

// Simple context for testing
interface SimpleContextValue {
  count: number
  increment: () => void
  decrement: () => void
}

const SimpleContext = createContext<SimpleContextValue | undefined>(undefined)

function SimpleProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  
  return (
    <SimpleContext.Provider value={{ count, increment, decrement }}>
      {children}
    </SimpleContext.Provider>
  )
}

function useSimpleContext() {
  const context = useContext(SimpleContext)
  if (!context) {
    throw new Error('useSimpleContext must be used within SimpleProvider')
  }
  return context
}

// Test component
function Counter() {
  const { count, increment, decrement } = useSimpleContext()
  
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={increment} data-testid="increment">+</button>
      <button onClick={decrement} data-testid="decrement">-</button>
    </div>
  )
}

describe('SimpleContext', () => {
  it('should provide initial count value', () => {
    render(
      <SimpleProvider>
        <Counter />
      </SimpleProvider>
    )
    
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('should increment count', async () => {
    const user = userEvent.setup()
    render(
      <SimpleProvider>
        <Counter />
      </SimpleProvider>
    )
    
    const incrementButton = screen.getByTestId('increment')
    await user.click(incrementButton)
    
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('should decrement count', async () => {
    const user = userEvent.setup()
    render(
      <SimpleProvider>
        <Counter />
      </SimpleProvider>
    )
    
    const decrementButton = screen.getByTestId('decrement')
    await user.click(decrementButton)
    
    expect(screen.getByTestId('count')).toHaveTextContent('-1')
  })

  it('should handle multiple operations', async () => {
    const user = userEvent.setup()
    render(
      <SimpleProvider>
        <Counter />
      </SimpleProvider>
    )
    
    const incrementButton = screen.getByTestId('increment')
    const decrementButton = screen.getByTestId('decrement')
    
    // Increment twice
    await user.click(incrementButton)
    await user.click(incrementButton)
    expect(screen.getByTestId('count')).toHaveTextContent('2')
    
    // Decrement once
    await user.click(decrementButton)
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = () => {}
    
    expect(() => {
      render(<Counter />)
    }).toThrow('useSimpleContext must be used within SimpleProvider')
    
    console.error = originalError
  })
})