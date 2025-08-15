import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { CoachContext } from '@/contexts/CoachContext'
import { AppDataContext } from '@/contexts/AppDataContext'
import { ZunoManagerContext } from '@/contexts/ZunoManagerContext'
import { createMockCoachContext } from '../../tests/factories/coachFactory'
import { createMockUserProfile } from '../../tests/factories/userFactory'
import { createMockCourse } from '../../tests/factories/courseFactory'

// Mock contexts with default values
const defaultAppDataContext = {
  courses: [
    createMockCourse({ id: 'course-1', title: 'Test Course 1' }),
    createMockCourse({ id: 'course-2', title: 'Test Course 2' })
  ],
  userProfile: createMockUserProfile(),
  userCourses: [],
  isLoading: false,
  error: null,
  refreshCourses: vi.fn(),
  refreshUserProfile: vi.fn(),
  refreshUserCourses: vi.fn(),
  enrollInCourse: vi.fn(),
  updateUserProgress: vi.fn()
}

const defaultZunoManagerContext = {
  managerPersonality: {
    name: 'Zuno Manager',
    role: 'Coordinatore Intelligente dell\'Apprendimento',
    characteristics: ['Saggio', 'Coordinatore esperto', 'Supportivo'],
    description: 'Il manager intelligente che coordina tutti i coach'
  },
  getWelcomeMessage: vi.fn(() => 'Benvenuto in Zuno!'),
  getCoachIntroduction: vi.fn(() => ({
    introduction: 'Test coach introduction',
    whenToChoose: 'When you need testing',
    strengths: ['Testing', 'Reliability'],
    idealFor: ['Unit tests', 'Integration tests']
  })),
  getCoordinationMessage: vi.fn(() => 'Test coordination message'),
  getTransitionMessage: vi.fn(() => 'Test transition message'),
  getMotivationalMessage: vi.fn(() => 'Test motivational message'),
  getAllCoachesOverview: vi.fn(() => [])
}

interface AllTheProvidersProps {
  children: React.ReactNode
  coachContext?: any
  appDataContext?: any
  zunoManagerContext?: any
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  coachContext = createMockCoachContext(),
  appDataContext = defaultAppDataContext,
  zunoManagerContext = defaultZunoManagerContext
}) => {
  return (
    <BrowserRouter>
      <ZunoManagerContext.Provider value={zunoManagerContext}>
        <CoachContext.Provider value={coachContext}>
          <AppDataContext.Provider value={appDataContext}>
            {children}
          </AppDataContext.Provider>
        </CoachContext.Provider>
      </ZunoManagerContext.Provider>
    </BrowserRouter>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  coachContext?: any
  appDataContext?: any
  zunoManagerContext?: any
}

const customRender = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const {
    coachContext,
    appDataContext,
    zunoManagerContext,
    ...renderOptions
  } = options

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        coachContext={coachContext}
        appDataContext={appDataContext}
        zunoManagerContext={zunoManagerContext}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions
  })
}

// Helper function to create a mock component for testing
export const createMockComponent = (name: string, props: any = {}) => {
  const MockComponent = (componentProps: any) => (
    <div data-testid={`mock-${name.toLowerCase()}`} {...componentProps}>
      Mock {name}
      {Object.entries(props).map(([key, value]) => (
        <span key={key} data-testid={`${name.toLowerCase()}-${key}`}>
          {String(value)}
        </span>
      ))}
    </div>
  )
  MockComponent.displayName = `Mock${name}`
  return MockComponent
}

// Helper function to wait for async operations
export const waitForAsync = (ms: number = 0) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Helper function to create mock event
export const createMockEvent = (type: string, properties: any = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...properties
})

// Helper function to create mock file
export const createMockFile = (
  name: string = 'test.txt',
  content: string = 'test content',
  type: string = 'text/plain'
) => {
  const file = new File([content], name, { type })
  return file
}

// Helper function to mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    get store() {
      return { ...store }
    }
  }
}

// Helper function to mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    get store() {
      return { ...store }
    }
  }
}

// Helper function to mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  })
  
  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  })
  
  return mockIntersectionObserver
}

// Helper function to mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn()
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })
  
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: mockResizeObserver,
  })
  
  Object.defineProperty(global, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: mockResizeObserver,
  })
  
  return mockResizeObserver
}

// Helper function to mock window.matchMedia
export const mockMatchMedia = (matches: boolean = false) => {
  const mockMatchMedia = vi.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  })
  
  return mockMatchMedia
}

// Helper function to create mock GraphQL response
export const createMockGraphQLResponse = (data: any, errors?: any[]) => ({
  data,
  errors,
  extensions: {},
  http: {
    status: 200,
    statusText: 'OK'
  }
})

// Helper function to create mock API error
export const createMockAPIError = (message: string, code?: string) => {
  const error = new Error(message)
  if (code) {
    (error as any).code = code
  }
  return error
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with our custom render
export { customRender as render }