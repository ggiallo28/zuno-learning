import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadCourses } from './loadCourses'
import { createMockCourse } from '../../tests/factories/courseFactory'

// Mock the GraphQL client
const mockGraphQL = vi.fn()
vi.mock('@/lib/graphql', () => ({
  client: {
    graphql: mockGraphQL
  }
}))

describe('loadCourses Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load courses successfully', async () => {
    const mockCourses = [
      createMockCourse({ id: 'course-1', title: 'JavaScript Fundamentals' }),
      createMockCourse({ id: 'course-2', title: 'React Basics' }),
      createMockCourse({ id: 'course-3', title: 'TypeScript Essentials' })
    ]

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: mockCourses
        }
      }
    })

    const result = await loadCourses()

    expect(result).toEqual(mockCourses)
    expect(mockGraphQL).toHaveBeenCalledWith({
      query: expect.stringContaining('listZunoCatalogs'),
      variables: {
        filter: {
          itemType: { eq: 'COURSE' }
        }
      }
    })
  })

  it('should load courses with category filter', async () => {
    const mockCourses = [
      createMockCourse({ id: 'course-1', title: 'JavaScript Fundamentals', category: 'Technology' })
    ]

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: mockCourses
        }
      }
    })

    const result = await loadCourses({ category: 'Technology' })

    expect(result).toEqual(mockCourses)
    expect(mockGraphQL).toHaveBeenCalledWith({
      query: expect.stringContaining('listZunoCatalogs'),
      variables: {
        filter: {
          itemType: { eq: 'COURSE' },
          'metadata.category': { eq: 'Technology' }
        }
      }
    })
  })

  it('should load courses with difficulty filter', async () => {
    const mockCourses = [
      createMockCourse({ id: 'course-1', title: 'Beginner Course', difficulty: 'Beginner' })
    ]

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: mockCourses
        }
      }
    })

    const result = await loadCourses({ difficulty: 'Beginner' })

    expect(result).toEqual(mockCourses)
    expect(mockGraphQL).toHaveBeenCalledWith({
      query: expect.stringContaining('listZunoCatalogs'),
      variables: {
        filter: {
          itemType: { eq: 'COURSE' },
          'metadata.difficulty': { eq: 'Beginner' }
        }
      }
    })
  })

  it('should load courses with multiple filters', async () => {
    const mockCourses = [
      createMockCourse({ 
        id: 'course-1', 
        title: 'Beginner JavaScript', 
        category: 'Technology',
        difficulty: 'Beginner'
      })
    ]

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: mockCourses
        }
      }
    })

    const result = await loadCourses({ 
      category: 'Technology',
      difficulty: 'Beginner'
    })

    expect(result).toEqual(mockCourses)
    expect(mockGraphQL).toHaveBeenCalledWith({
      query: expect.stringContaining('listZunoCatalogs'),
      variables: {
        filter: {
          itemType: { eq: 'COURSE' },
          'metadata.category': { eq: 'Technology' },
          'metadata.difficulty': { eq: 'Beginner' }
        }
      }
    })
  })

  it('should handle empty results', async () => {
    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: []
        }
      }
    })

    const result = await loadCourses()

    expect(result).toEqual([])
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Network error'
    mockGraphQL.mockRejectedValue(new Error(errorMessage))

    await expect(loadCourses()).rejects.toThrow(errorMessage)
  })

  it('should handle GraphQL errors', async () => {
    mockGraphQL.mockResolvedValue({
      data: null,
      errors: [{ message: 'GraphQL error' }]
    })

    await expect(loadCourses()).rejects.toThrow('GraphQL error')
  })

  it('should transform course data correctly', async () => {
    const rawCourseData = {
      id: 'course-1',
      itemType: 'COURSE',
      metadata: {
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript basics',
        category: 'Technology',
        difficulty: 'Beginner',
        estimatedDuration: 120,
        tags: ['javascript', 'programming'],
        learningObjectives: ['Variables', 'Functions', 'Objects']
      },
      timestamp: '2024-01-01T00:00:00Z'
    }

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: [rawCourseData]
        }
      }
    })

    const result = await loadCourses()

    expect(result[0]).toMatchObject({
      id: 'course-1',
      title: 'JavaScript Fundamentals',
      description: 'Learn JavaScript basics',
      category: 'Technology',
      difficulty: 'Beginner',
      estimatedDuration: 120,
      tags: ['javascript', 'programming'],
      learningObjectives: ['Variables', 'Functions', 'Objects']
    })
  })

  it('should handle pagination', async () => {
    const firstPage = [
      createMockCourse({ id: 'course-1', title: 'Course 1' })
    ]
    const secondPage = [
      createMockCourse({ id: 'course-2', title: 'Course 2' })
    ]

    mockGraphQL
      .mockResolvedValueOnce({
        data: {
          listZunoCatalogs: {
            items: firstPage,
            nextToken: 'next-token'
          }
        }
      })
      .mockResolvedValueOnce({
        data: {
          listZunoCatalogs: {
            items: secondPage,
            nextToken: null
          }
        }
      })

    const result = await loadCourses({ limit: 1 })

    expect(result).toEqual([...firstPage, ...secondPage])
    expect(mockGraphQL).toHaveBeenCalledTimes(2)
  })

  it('should handle network timeouts', async () => {
    const timeoutError = new Error('Request timeout')
    timeoutError.name = 'TimeoutError'
    mockGraphQL.mockRejectedValue(timeoutError)

    await expect(loadCourses()).rejects.toThrow('Request timeout')
  })

  it('should handle malformed response data', async () => {
    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: null
      }
    })

    const result = await loadCourses()
    expect(result).toEqual([])
  })

  it('should handle courses with missing metadata', async () => {
    const courseWithoutMetadata = {
      id: 'course-1',
      itemType: 'COURSE',
      metadata: null,
      timestamp: '2024-01-01T00:00:00Z'
    }

    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: [courseWithoutMetadata]
        }
      }
    })

    const result = await loadCourses()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('course-1')
  })

  it('should handle concurrent requests', async () => {
    const mockCourses = [createMockCourse({ id: 'course-1' })]
    mockGraphQL.mockResolvedValue({
      data: {
        listZunoCatalogs: {
          items: mockCourses
        }
      }
    })

    // Make multiple concurrent requests
    const promises = [
      loadCourses(),
      loadCourses({ category: 'Technology' }),
      loadCourses({ difficulty: 'Beginner' })
    ]

    const results = await Promise.all(promises)

    expect(results).toHaveLength(3)
    expect(mockGraphQL).toHaveBeenCalledTimes(3)
  })
})