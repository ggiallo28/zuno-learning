import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import React from 'react'

// Mock AWS Amplify
vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
    Auth: {
      currentAuthenticatedUser: vi.fn(),
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      confirmSignUp: vi.fn(),
      resendSignUp: vi.fn(),
      forgotPassword: vi.fn(),
      forgotPasswordSubmit: vi.fn()
    },
    API: {
      graphql: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      del: vi.fn()
    },
    Storage: {
      get: vi.fn(),
      put: vi.fn(),
      remove: vi.fn(),
      list: vi.fn()
    },
    Hub: {
      listen: vi.fn(),
      dispatch: vi.fn()
    }
  },
  Auth: {
    currentAuthenticatedUser: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    confirmSignUp: vi.fn(),
    resendSignUp: vi.fn(),
    forgotPassword: vi.fn(),
    forgotPasswordSubmit: vi.fn()
  },
  API: {
    graphql: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    del: vi.fn()
  },
  Storage: {
    get: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
    list: vi.fn()
  },
  Hub: {
    listen: vi.fn(),
    dispatch: vi.fn()
  }
}))

// Mock AWS Amplify UI React
vi.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }: { children: any }) => children,
  useAuthenticator: () => ({
    user: null,
    signOut: vi.fn()
  }),
  Button: ({ children, ...props }: any) => 
    React.createElement('button', props, children),
  Input: (props: any) => 
    React.createElement('input', props),
  Label: ({ children, ...props }: any) => 
    React.createElement('label', props, children)
}))

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
    Routes: ({ children }: { children: React.ReactNode }) => children,
    Route: ({ element }: { element: React.ReactNode }) => element
  }
})

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('sessionStorage', sessionStorageMock)

// Setup MSW server for API mocking
export const server = setupServer(
  // Default handlers
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test API response' })
  })
)

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Clean up after each test case
afterEach(() => {
  cleanup()
  server.resetHandlers()
  vi.clearAllMocks()
  localStorageMock.clear()
  sessionStorageMock.clear()
})

// Clean up after all tests
afterAll(() => {
  server.close()
})

// Global test utilities
export const mockUser = {
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  attributes: {
    email: 'test@example.com',
    name: 'Test User'
  }
}

export const mockCourse = {
  id: 'test-course-id',
  title: 'Test Course',
  description: 'A test course for unit testing',
  category: 'Technology',
  difficulty: 'Beginner',
  estimatedDuration: 60
}

export const mockLesson = {
  id: 'test-lesson-id',
  title: 'Test Lesson',
  content: 'Test lesson content',
  courseId: 'test-course-id',
  order: 1,
  type: 'TEXT'
}

// Helper function to create mock GraphQL responses
export const createMockGraphQLResponse = (data: any, errors?: any[]) => ({
  data,
  errors,
  extensions: {},
  http: {
    status: 200,
    statusText: 'OK'
  }
})

// Helper function to create mock API responses
export const createMockAPIResponse = (data: any, status = 200) => 
  HttpResponse.json(data, { status })