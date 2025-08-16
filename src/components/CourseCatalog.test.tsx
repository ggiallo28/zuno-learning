import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CourseCatalog } from './CourseCatalog';
import type { Course } from '@/types';

// Mock data for testing
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React',
    category: 'TECHNOLOGY',
    difficultyLevel: 'BEGINNER',
    estimatedDurationDays: 14,
    isPremium: false,
    lessonCount: 10,
    progressPercentage: 0,
    totalLessons: 10,
    completedLessons: 0
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript advanced features',
    category: 'TECHNOLOGY',
    difficultyLevel: 'ADVANCED',
    estimatedDurationDays: 21,
    isPremium: true,
    lessonCount: 15,
    progressPercentage: 45,
    enrolledAt: '2024-01-01T00:00:00Z',
    totalLessons: 15,
    completedLessons: 7
  },
  {
    id: '3',
    title: 'Business Communication',
    description: 'Improve your business communication skills',
    category: 'BUSINESS',
    difficultyLevel: 'INTERMEDIATE',
    estimatedDurationDays: 10,
    isPremium: false,
    lessonCount: 8,
    progressPercentage: 100,
    enrolledAt: '2024-01-01T00:00:00Z',
    completedAt: '2024-01-15T00:00:00Z',
    totalLessons: 8,
    completedLessons: 8
  }
];

// Mock courses with snake_case properties (SQL format)
const mockCoursesSQL = [
  {
    id: 1,
    title: 'Python Basics',
    description: 'Learn Python programming',
    category: 'TECHNOLOGY',
    difficulty_level: 'beginner',
    estimated_duration_days: 12,
    is_premium: false,
    lesson_count: 8,
    progress_percentage: 0,
    total_lessons: 8,
    completed_lessons: 0
  }
];

describe('CourseCatalog', () => {
  const mockOnEnrollInCourse = vi.fn();
  const mockOnCourseClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders course catalog with courses', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Business Communication')).toBeInTheDocument();
  });

  it('handles both camelCase and snake_case course properties', () => {
    render(
      <CourseCatalog
        courses={[...mockCourses, ...mockCoursesSQL] as Course[]}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Should render both formats correctly
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Python Basics')).toBeInTheDocument();
  });

  it('filters courses by category', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Open category filter
    const categorySelect = screen.getByLabelText('Filter courses by category');
    fireEvent.click(categorySelect);

    // Select BUSINESS category
    const businessOption = screen.getByText('BUSINESS');
    fireEvent.click(businessOption);

    await waitFor(() => {
      expect(screen.getByText('Business Communication')).toBeInTheDocument();
      expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument();
      expect(screen.queryByText('Advanced TypeScript')).not.toBeInTheDocument();
    });
  });

  it('filters courses by difficulty', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Open difficulty filter
    const difficultySelect = screen.getByLabelText('Filter courses by difficulty level');
    fireEvent.click(difficultySelect);

    // Select Advanced difficulty
    const advancedOption = screen.getByText('Advanced');
    fireEvent.click(advancedOption);

    await waitFor(() => {
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
      expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument();
      expect(screen.queryByText('Business Communication')).not.toBeInTheDocument();
    });
  });

  it('searches courses by title and description', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        showSearch={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search courses by title, description, or category...');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.queryByText('Advanced TypeScript')).not.toBeInTheDocument();
      expect(screen.queryByText('Business Communication')).not.toBeInTheDocument();
    });
  });

  it('sorts courses correctly', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        showSort={true}
      />
    );

    // Open sort dropdown
    const sortSelect = screen.getByLabelText('Sort courses');
    fireEvent.click(sortSelect);

    // Select difficulty sort
    const difficultySort = screen.getByText('Difficulty');
    fireEvent.click(difficultySort);

    await waitFor(() => {
      const courseCards = screen.getAllByRole('listitem');
      // Should be sorted by difficulty: BEGINNER, INTERMEDIATE, ADVANCED
      expect(courseCards[0]).toHaveTextContent('React Fundamentals'); // BEGINNER
      expect(courseCards[1]).toHaveTextContent('Business Communication'); // INTERMEDIATE
      expect(courseCards[2]).toHaveTextContent('Advanced TypeScript'); // ADVANCED
    });
  });

  it('displays course progress for enrolled courses', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Advanced TypeScript should show progress
    expect(screen.getByText('45%')).toBeInTheDocument();
    
    // Business Communication should show completed status
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows premium badge for premium courses', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('calls onEnrollInCourse when enroll button is clicked', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    const enrollButton = screen.getByText('Enroll Now');
    fireEvent.click(enrollButton);

    expect(mockOnEnrollInCourse).toHaveBeenCalledWith('1');
  });

  it('calls onCourseClick when course card is clicked', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        onCourseClick={mockOnCourseClick}
      />
    );

    const courseCard = screen.getByLabelText('React Fundamentals');
    fireEvent.click(courseCard);

    expect(mockOnCourseClick).toHaveBeenCalledWith(mockCourses[0]);
  });

  it('shows empty state when no courses match filters', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        showSearch={true}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search courses by title, description, or category...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentCourse' } });

    await waitFor(() => {
      expect(screen.getByText('No courses found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters to see more courses.')).toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        showSearch={true}
        showFilters={true}
      />
    );

    // Apply some filters
    const searchInput = screen.getByPlaceholderText('Search courses by title, description, or category...');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    // Clear all filters
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
      expect(screen.getByText('Advanced TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Business Communication')).toBeInTheDocument();
    });
  });

  it('displays correct difficulty colors', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Check that difficulty badges have correct styling
    const beginnerBadge = screen.getByText('Beginner');
    const intermediateBadge = screen.getByText('Intermediate');
    const advancedBadge = screen.getByText('Advanced');

    expect(beginnerBadge).toHaveClass('bg-green-100', 'text-green-800');
    expect(intermediateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    expect(advancedBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('shows correct lesson count and duration', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    expect(screen.getByText('10 lessons')).toBeInTheDocument();
    expect(screen.getByText('14 days')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
        isEnrolling={true}
      />
    );

    const enrollButton = screen.getByText('Enrolling...');
    expect(enrollButton).toBeDisabled();
  });

  it('meets accessibility requirements', () => {
    render(
      <CourseCatalog
        courses={mockCourses}
        onEnrollInCourse={mockOnEnrollInCourse}
      />
    );

    // Check for proper ARIA labels
    expect(screen.getByLabelText('Course search and filters')).toBeInTheDocument();
    expect(screen.getByLabelText('Available courses')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter courses by category')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter courses by difficulty level')).toBeInTheDocument();

    // Check for screen reader announcements
    expect(screen.getByText('Showing 3 courses')).toBeInTheDocument();
  });
});