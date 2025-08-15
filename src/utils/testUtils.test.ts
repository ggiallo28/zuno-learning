import { describe, it, expect } from 'vitest'

// Test utility functions
describe('Test Utilities', () => {
  describe('String utilities', () => {
    it('should format names correctly', () => {
      const formatName = (name: string) => 
        name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')
      
      expect(formatName('john doe')).toBe('John Doe')
      expect(formatName('JANE SMITH')).toBe('Jane Smith')
      expect(formatName('bob')).toBe('Bob')
    })

    it('should generate initials correctly', () => {
      const getInitials = (name: string) => 
        name.split(' ').map(n => n[0]).join('').toUpperCase()
      
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Jane Smith Johnson')).toBe('JSJ')
      expect(getInitials('Bob')).toBe('B')
    })
  })

  describe('Array utilities', () => {
    it('should chunk arrays correctly', () => {
      const chunk = <T>(array: T[], size: number): T[][] => {
        const chunks: T[][] = []
        for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size))
        }
        return chunks
      }

      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
      expect(chunk(['a', 'b', 'c'], 1)).toEqual([['a'], ['b'], ['c']])
      expect(chunk([], 2)).toEqual([])
    })

    it('should remove duplicates correctly', () => {
      const unique = <T>(array: T[]): T[] => [...new Set(array)]
      
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
      expect(unique([])).toEqual([])
    })
  })

  describe('Date utilities', () => {
    it('should format dates correctly', () => {
      const formatDate = (date: Date) => date.toISOString().split('T')[0]
      
      const testDate = new Date('2024-01-15T10:30:00Z')
      expect(formatDate(testDate)).toBe('2024-01-15')
    })

    it('should calculate days between dates', () => {
      const daysBetween = (date1: Date, date2: Date) => 
        Math.abs(Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)))
      
      const date1 = new Date('2024-01-01')
      const date2 = new Date('2024-01-05')
      expect(daysBetween(date1, date2)).toBe(4)
    })
  })

  describe('Validation utilities', () => {
    it('should validate email addresses', () => {
      const isValidEmail = (email: string) => 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
      expect(isValidEmail('invalid.email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })

    it('should validate passwords', () => {
      const isValidPassword = (password: string) => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && 
               /[a-z]/.test(password) && 
               /\d/.test(password)
      }
      
      expect(isValidPassword('Password123')).toBe(true)
      expect(isValidPassword('StrongPass1')).toBe(true)
      expect(isValidPassword('weak')).toBe(false)
      expect(isValidPassword('NoNumbers')).toBe(false)
      expect(isValidPassword('nonumbers123')).toBe(false)
    })
  })
})