import { Amplify } from 'aws-amplify';
import { client } from '../lib/graphql';
import { createZunoCatalogWithMetadata } from '../api/graphql/customMutations';
import amplifyconfig from '../amplifyconfiguration.json';
import type { 
  CoachNameValues, 
  CourseCategoryValues, 
  DifficultyLevelValues, 
  LessonTypeValues,
  CatalogItemTypeValues 
} from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

// Configure Amplify
Amplify.configure(amplifyconfig);

// Sample course data
const sampleCourses = [
  {
    id: 'course_javascript_basics',
    title: 'JavaScript Fundamentals',
    category: 'TECHNOLOGY' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Learn the fundamentals of JavaScript programming language'
  },
  {
    id: 'course_react_intro',
    title: 'Introduction to React',
    category: 'TECHNOLOGY' as CourseCategoryValues,
    difficultyLevel: 'INTERMEDIATE' as DifficultyLevelValues,
    description: 'Build modern web applications with React'
  },
  {
    id: 'course_math_algebra',
    title: 'Algebra Basics',
    category: 'MATH' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Master the fundamentals of algebra'
  },
  {
    id: 'course_spanish_basics',
    title: 'Spanish for Beginners',
    category: 'LANGUAGE' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Learn basic Spanish vocabulary and grammar'
  }
];

// Sample lessons for each course
const sampleLessons = [
  // JavaScript Fundamentals lessons
  {
    id: 'lesson_js_variables',
    courseId: 'course_javascript_basics',
    title: 'Variables and Data Types',
    lessonOrder: 1,
    lessonType: 'TEXT' as LessonTypeValues
  },
  {
    id: 'lesson_js_functions',
    courseId: 'course_javascript_basics',
    title: 'Functions and Scope',
    lessonOrder: 2,
    lessonType: 'PRACTICE' as LessonTypeValues
  },
  // React lessons
  {
    id: 'lesson_react_components',
    courseId: 'course_react_intro',
    title: 'React Components',
    lessonOrder: 1,
    lessonType: 'TEXT' as LessonTypeValues
  },
  {
    id: 'lesson_react_state',
    courseId: 'course_react_intro',
    title: 'State and Props',
    lessonOrder: 2,
    lessonType: 'PRACTICE' as LessonTypeValues
  },
  // Algebra lessons
  {
    id: 'lesson_algebra_equations',
    courseId: 'course_math_algebra',
    title: 'Linear Equations',
    lessonOrder: 1,
    lessonType: 'TEXT' as LessonTypeValues
  },
  {
    id: 'lesson_algebra_graphing',
    courseId: 'course_math_algebra',
    title: 'Graphing Functions',
    lessonOrder: 2,
    lessonType: 'PRACTICE' as LessonTypeValues
  },
  // Spanish lessons
  {
    id: 'lesson_spanish_greetings',
    courseId: 'course_spanish_basics',
    title: 'Greetings and Introductions',
    lessonOrder: 1,
    lessonType: 'TEXT' as LessonTypeValues
  },
  {
    id: 'lesson_spanish_numbers',
    courseId: 'course_spanish_basics',
    title: 'Numbers and Counting',
    lessonOrder: 2,
    lessonType: 'PRACTICE' as LessonTypeValues
  }
];

// Sample quiz questions
const sampleQuizzes = [
  {
    id: 'quiz_js_variables_1',
    lessonId: 'lesson_js_variables',
    courseId: 'course_javascript_basics',
    questionText: 'Which keyword is used to declare a variable in JavaScript?',
    questionType: 'MULTIPLE_CHOICE',
    possibilities: [
      { text: 'let', isCorrect: true },
      { text: 'variable', isCorrect: false },
      { text: 'declare', isCorrect: false },
      { text: 'make', isCorrect: false }
    ],
    rightAnswerCount: 1
  },
  {
    id: 'quiz_react_components_1',
    lessonId: 'lesson_react_components',
    courseId: 'course_react_intro',
    questionText: 'What is a React component?',
    questionType: 'MULTIPLE_CHOICE',
    possibilities: [
      { text: 'A reusable piece of UI', isCorrect: true },
      { text: 'A database table', isCorrect: false },
      { text: 'A CSS file', isCorrect: false },
      { text: 'A server endpoint', isCorrect: false }
    ],
    rightAnswerCount: 1
  },
  {
    id: 'quiz_algebra_equations_1',
    lessonId: 'lesson_algebra_equations',
    courseId: 'course_math_algebra',
    questionText: 'Solve for x: 2x + 5 = 11',
    questionType: 'MULTIPLE_CHOICE',
    possibilities: [
      { text: '3', isCorrect: true },
      { text: '4', isCorrect: false },
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false }
    ],
    rightAnswerCount: 1
  },
  {
    id: 'quiz_spanish_greetings_1',
    lessonId: 'lesson_spanish_greetings',
    courseId: 'course_spanish_basics',
    questionText: 'How do you say "Hello" in Spanish?',
    questionType: 'MULTIPLE_CHOICE',
    possibilities: [
      { text: 'Hola', isCorrect: true },
      { text: 'Adiós', isCorrect: false },
      { text: 'Gracias', isCorrect: false },
      { text: 'Por favor', isCorrect: false }
    ],
    rightAnswerCount: 1
  }
];

// Sample coaches
const sampleCoaches = [
  {
    id: 'coach_elia',
    coachName: 'ELIA' as CoachNameValues,
    displayName: 'Elia the Elephant',
    avatarUrl: '/images/coaches/elia.png',
    bio: 'Deep, methodical learning with thorough explanations and steady progress.'
  },
  {
    id: 'coach_skippy',
    coachName: 'SKIPPY' as CoachNameValues,
    displayName: 'Skippy the Squirrel',
    avatarUrl: '/images/coaches/skippy.png',
    bio: 'Fast-paced, dynamic learning with quick exploration and varied content.'
  },
  {
    id: 'coach_lupa',
    coachName: 'LUPA' as CoachNameValues,
    displayName: 'Lupa the Wolf',
    avatarUrl: '/images/coaches/lupa.png',
    bio: 'Collaborative learning with social interaction and group activities.'
  },
  {
    id: 'coach_polpo',
    coachName: 'POLPO' as CoachNameValues,
    displayName: 'Polpo the Octopus',
    avatarUrl: '/images/coaches/polpo.png',
    bio: 'Adaptive learning that intelligently combines multiple approaches.'
  }
];

async function seedCourses() {
  console.log('Seeding courses...');
  
  for (const course of sampleCourses) {
    try {
      const response = await client.graphql({
        query: createZunoCatalogWithMetadata,
        variables: {
          input: {
            id: course.id,
            itemType: 'COURSE' as CatalogItemTypeValues,
            timestamp: new Date().toISOString(),
            metadata: {
              course: {
                title: course.title,
                category: course.category,
                difficultyLevel: course.difficultyLevel,
                description: course.description,
                extraLessonIds: []
              }
            }
          }
        }
      }) as GraphQLResult<any>;

      if (response.errors) {
        console.error(`Error creating course ${course.id}:`, response.errors);
      } else {
        console.log(`✓ Created course: ${course.title}`);
      }
    } catch (error) {
      console.error(`Error creating course ${course.id}:`, error);
    }
  }
}

async function seedLessons() {
  console.log('Seeding lessons...');
  
  for (const lesson of sampleLessons) {
    try {
      const response = await client.graphql({
        query: createZunoCatalogWithMetadata,
        variables: {
          input: {
            id: lesson.id,
            parentId: lesson.courseId,
            itemType: 'LESSON' as CatalogItemTypeValues,
            timestamp: new Date().toISOString(),
            metadata: {
              lesson: {
                courseId: lesson.courseId,
                title: lesson.title,
                lessonOrder: lesson.lessonOrder,
                lessonType: lesson.lessonType,
                extraQuizIds: []
              }
            }
          }
        }
      }) as GraphQLResult<any>;

      if (response.errors) {
        console.error(`Error creating lesson ${lesson.id}:`, response.errors);
      } else {
        console.log(`✓ Created lesson: ${lesson.title}`);
      }
    } catch (error) {
      console.error(`Error creating lesson ${lesson.id}:`, error);
    }
  }
}

async function seedQuizzes() {
  console.log('Seeding quizzes...');
  
  for (const quiz of sampleQuizzes) {
    try {
      const response = await client.graphql({
        query: createZunoCatalogWithMetadata,
        variables: {
          input: {
            id: quiz.id,
            parentId: quiz.lessonId,
            itemType: 'QUIZ' as CatalogItemTypeValues,
            timestamp: new Date().toISOString(),
            metadata: {
              quiz: {
                courseId: quiz.courseId,
                lessonId: quiz.lessonId,
                questionText: quiz.questionText,
                questionType: quiz.questionType,
                possibilities: quiz.possibilities,
                rightAnswerCount: quiz.rightAnswerCount
              }
            }
          }
        }
      }) as GraphQLResult<any>;

      if (response.errors) {
        console.error(`Error creating quiz ${quiz.id}:`, response.errors);
      } else {
        console.log(`✓ Created quiz: ${quiz.questionText}`);
      }
    } catch (error) {
      console.error(`Error creating quiz ${quiz.id}:`, error);
    }
  }
}

async function seedCoaches() {
  console.log('Seeding coaches...');
  
  for (const coach of sampleCoaches) {
    try {
      const response = await client.graphql({
        query: createZunoCatalogWithMetadata,
        variables: {
          input: {
            id: coach.id,
            itemType: 'COACH' as CatalogItemTypeValues,
            timestamp: new Date().toISOString(),
            metadata: {
              coach: {
                coachName: coach.coachName,
                displayName: coach.displayName,
                avatarUrl: coach.avatarUrl,
                bio: coach.bio
              }
            }
          }
        }
      }) as GraphQLResult<any>;

      if (response.errors) {
        console.error(`Error creating coach ${coach.id}:`, response.errors);
      } else {
        console.log(`✓ Created coach: ${coach.displayName}`);
      }
    } catch (error) {
      console.error(`Error creating coach ${coach.id}:`, error);
    }
  }
}

export async function seedAmplifyData() {
  console.log('🌱 Starting Amplify data seeding...');
  
  try {
    await seedCourses();
    await seedLessons();
    await seedQuizzes();
    await seedCoaches();
    
    console.log('✅ Amplify data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during data seeding:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAmplifyData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}