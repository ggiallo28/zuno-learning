import { http, HttpResponse } from 'msw'
import { createMockUser, createMockUserProfile } from '../factories/userFactory'
import { createMockCourse, createMockLesson, createMockCourseWithLessons } from '../factories/courseFactory'

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'https://6onprh4y5vadxpafwpwmoa5ueq.appsync-api.us-east-2.amazonaws.com/graphql'

export const handlers = [
  // GraphQL API handlers
  http.post(GRAPHQL_ENDPOINT, async ({ request }) => {
    const body = await request.json() as any
    const { query, variables } = body

    // Handle different GraphQL operations
    if (query.includes('listZunoCatalogs')) {
      return HttpResponse.json({
        data: {
          listZunoCatalogs: {
            items: [
              createMockCourse({ id: 'course-1', title: 'JavaScript Fundamentals' }),
              createMockCourse({ id: 'course-2', title: 'React Basics' }),
              createMockCourse({ id: 'course-3', title: 'TypeScript Essentials' })
            ]
          }
        }
      })
    }

    if (query.includes('getZunoCatalog')) {
      const courseId = variables?.id || 'course-1'
      return HttpResponse.json({
        data: {
          getZunoCatalog: createMockCourseWithLessons({ id: courseId })
        }
      })
    }

    if (query.includes('listZunoEntries')) {
      return HttpResponse.json({
        data: {
          listZunoEntries: {
            items: [
              {
                id: 'entry-1',
                userId: 'test-user-id',
                entryType: 'USER_PROGRESS',
                metadata: createMockUserProfile()
              }
            ]
          }
        }
      })
    }

    if (query.includes('createZunoEntry')) {
      return HttpResponse.json({
        data: {
          createZunoEntry: {
            id: 'new-entry-id',
            ...variables.input
          }
        }
      })
    }

    if (query.includes('updateZunoEntry')) {
      return HttpResponse.json({
        data: {
          updateZunoEntry: {
            id: variables.input.id,
            ...variables.input
          }
        }
      })
    }

    // Default response for unhandled queries
    return HttpResponse.json({
      data: null,
      errors: [{ message: 'Query not mocked' }]
    })
  }),

  // REST API handlers
  http.get('/api/courses', () => {
    return HttpResponse.json([
      createMockCourse({ id: 'course-1', title: 'JavaScript Fundamentals' }),
      createMockCourse({ id: 'course-2', title: 'React Basics' }),
      createMockCourse({ id: 'course-3', title: 'TypeScript Essentials' })
    ])
  }),

  http.get('/api/courses/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json(
      createMockCourseWithLessons({ id: id as string })
    )
  }),

  http.get('/api/lessons/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json(
      createMockLesson({ id: id as string })
    )
  }),

  http.get('/api/user/profile', () => {
    return HttpResponse.json(createMockUserProfile())
  }),

  http.post('/api/user/progress', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      success: true,
      data: body
    })
  }),

  http.post('/api/auth/signin', async ({ request }) => {
    const body = await request.json() as any
    
    if (body.username === 'testuser' && body.password === 'password') {
      return HttpResponse.json({
        user: createMockUser(),
        token: 'mock-jwt-token'
      })
    }
    
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      user: createMockUser(body),
      message: 'User created successfully'
    })
  }),

  // Error handlers for testing error states
  http.get('/api/error/500', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),

  http.get('/api/error/404', () => {
    return HttpResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }),

  http.get('/api/error/network', () => {
    return HttpResponse.error()
  })
]