import { Amplify } from 'aws-amplify';
import config from '../amplifyconfiguration.json';
import { client } from '../lib/graphql';
import { createZunoCatalogWithMetadata, createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import { zunoCatalogsByItemTypeWithMetadata, zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';

// Configure Amplify
Amplify.configure(config);
import type { 
  CatalogItemTypeValues, 
  CourseCategoryValues, 
  DifficultyLevelValues,
  LessonTypeValues,
  CoachNameValues,
  ZunoEntryTypeValues
} from '../types';

// Sample courses data
const sampleCourses = [
  {
    title: 'Introduction to React',
    category: 'TECHNOLOGY' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Learn the fundamentals of React development'
  },
  {
    title: 'Advanced TypeScript Patterns',
    category: 'TECHNOLOGY' as CourseCategoryValues,
    difficultyLevel: 'ADVANCED' as DifficultyLevelValues,
    description: 'Master advanced TypeScript concepts'
  },
  {
    title: 'UI/UX Design Fundamentals',
    category: 'ART' as CourseCategoryValues,
    difficultyLevel: 'INTERMEDIATE' as DifficultyLevelValues,
    description: 'Learn the principles of user interface design'
  },
  {
    title: 'Basic Mathematics',
    category: 'MATH' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Fundamental mathematical concepts'
  },
  {
    title: 'Introduction to Science',
    category: 'SCIENCE' as CourseCategoryValues,
    difficultyLevel: 'BEGINNER' as DifficultyLevelValues,
    description: 'Basic scientific principles and methods'
  }
];

// Sample lessons for each course (only 2 per course)
const sampleLessons = [
  { title: 'Getting Started', lessonOrder: 1, lessonType: 'VIDEO' as LessonTypeValues },
  { title: 'Core Concepts', lessonOrder: 2, lessonType: 'READING' as LessonTypeValues }
];

// Sample coaches
const sampleCoaches = [
  {
    coachName: 'ELIA' as CoachNameValues,
    displayName: 'Elia the Elephant',
    bio: 'Deep, methodical learning approach with thorough explanations'
  },
  {
    coachName: 'SKIPPY' as CoachNameValues,
    displayName: 'Skippy the Squirrel',
    bio: 'Fast, dynamic learning with quick exploration'
  },
  {
    coachName: 'LUPA' as CoachNameValues,
    displayName: 'Lupa the Wolf',
    bio: 'Collaborative learning with social interaction'
  },
  {
    coachName: 'POLPO' as CoachNameValues,
    displayName: 'Polpo the Octopus',
    bio: 'Adaptive hybrid approach that combines multiple strategies'
  }
];

export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Check existing coaches to avoid duplicates
    console.log('Checking existing coaches...');
    const existingCoachesResponse = await client.graphql({
      query: zunoCatalogsByItemTypeWithMetadata,
      variables: {
        itemType: 'COACH' as CatalogItemTypeValues
      }
    }) as any;
    
    const existingCoaches = new Set(
      existingCoachesResponse.data?.zunoCatalogsByItemTypeAndTimestamp?.items
        ?.map((item: any) => item?.metadata?.coach?.coachName)
        .filter(Boolean) || []
    );

    // Create coaches first
    console.log('Creating coaches...');
    for (const coach of sampleCoaches) {
      if (!existingCoaches.has(coach.coachName)) {
        await client.graphql({
          query: createZunoCatalogWithMetadata,
          variables: {
            input: {
              itemType: 'COACH' as CatalogItemTypeValues,
              timestamp: new Date().toISOString(),
              metadata: {
                coach
              }
            }
          }
        });
        console.log('Created coach:', coach.displayName);
      } else {
        console.log('Coach already exists:', coach.displayName);
      }
    }

    // Check existing courses to avoid duplicates
    console.log('Checking existing courses...');
    const existingCoursesResponse = await client.graphql({
      query: zunoCatalogsByItemTypeWithMetadata,
      variables: {
        itemType: 'COURSE' as CatalogItemTypeValues
      }
    }) as any;
    
    const existingCourses = new Set(
      existingCoursesResponse.data?.zunoCatalogsByItemTypeAndTimestamp?.items
        ?.map((item: any) => item?.metadata?.course?.title)
        .filter(Boolean) || []
    );

    // Create courses
    console.log('Creating courses...');
    const courseIds: string[] = [];
    
    // Add existing course IDs
    existingCoursesResponse.data?.zunoCatalogsByItemTypeAndTimestamp?.items?.forEach((item: any) => {
      if (item?.id) {
        courseIds.push(item.id);
      }
    });
    
    for (const course of sampleCourses) {
      if (!existingCourses.has(course.title)) {
        const response = await client.graphql({
          query: createZunoCatalogWithMetadata,
          variables: {
            input: {
              itemType: 'COURSE' as CatalogItemTypeValues,
              timestamp: new Date().toISOString(),
              metadata: {
                course
              }
            }
          }
        }) as any;
        
        if (response.data?.createZunoCatalog?.id) {
          courseIds.push(response.data.createZunoCatalog.id);
          console.log('Created course:', course.title);
        }
      } else {
        console.log('Course already exists:', course.title);
      }
    }

    // Check existing lessons to avoid duplicates
    console.log('Checking existing lessons...');
    const existingLessonsResponse = await client.graphql({
      query: zunoCatalogsByItemTypeWithMetadata,
      variables: {
        itemType: 'LESSON' as CatalogItemTypeValues
      }
    }) as any;
    
    const existingLessons = new Map();
    const lessonIds: string[] = [];
    
    // Map existing lessons by course and title
    existingLessonsResponse.data?.zunoCatalogsByItemTypeAndTimestamp?.items?.forEach((item: any) => {
      if (item?.metadata?.lesson) {
        const key = `${item.parentId}_${item.metadata.lesson.title}`;
        existingLessons.set(key, item.id);
        lessonIds.push(item.id);
      }
    });

    // Create lessons for each course
    console.log('Creating lessons...');
    
    for (const courseId of courseIds) {
      for (const lesson of sampleLessons) {
        const lessonKey = `${courseId}_${lesson.title}`;
        
        if (!existingLessons.has(lessonKey)) {
          const response = await client.graphql({
            query: createZunoCatalogWithMetadata,
            variables: {
              input: {
                parentId: courseId,
                itemType: 'LESSON' as CatalogItemTypeValues,
                timestamp: new Date().toISOString(),
                metadata: {
                  lesson: {
                    ...lesson,
                    courseId
                  }
                }
              }
            }
          }) as any;
          
          if (response.data?.createZunoCatalog?.id) {
            lessonIds.push(response.data.createZunoCatalog.id);
            console.log(`Created lesson: ${lesson.title} for course ${courseId}`);
          }
        } else {
          console.log(`Lesson already exists: ${lesson.title} for course ${courseId}`);
        }
      }
    }

    // Check existing quizzes to avoid duplicates
    console.log('Checking existing quizzes...');
    const existingQuizzesResponse = await client.graphql({
      query: zunoCatalogsByItemTypeWithMetadata,
      variables: {
        itemType: 'QUIZ' as CatalogItemTypeValues
      }
    }) as any;
    
    // Check existing quizzes for each lesson

    // Create two quizzes per lesson
    console.log('Creating quizzes...');
    const quizQuestions = [
      'What did you learn in this lesson?',
      'Which concept was most important in this lesson?'
    ];
    
    let quizCount = 0;
    for (const lessonId of lessonIds) {
      const existingQuizzesForLesson = existingQuizzesResponse.data?.zunoCatalogsByItemTypeAndTimestamp?.items
        ?.filter((item: any) => item?.parentId === lessonId).length || 0;
      
      const quizzesToCreate = Math.max(0, 2 - existingQuizzesForLesson);
      
      for (let i = 0; i < quizzesToCreate; i++) {
        await client.graphql({
          query: createZunoCatalogWithMetadata,
          variables: {
            input: {
              parentId: lessonId,
              itemType: 'QUIZ' as CatalogItemTypeValues,
              timestamp: new Date().toISOString(),
              metadata: {
                quiz: {
                  lessonId: lessonId,
                  questionText: quizQuestions[i] || 'Sample quiz question',
                  questionType: 'MULTIPLE_CHOICE',
                  possibilities: [
                    { text: 'I learned the fundamentals', isCorrect: true },
                    { text: 'I learned advanced concepts', isCorrect: false },
                    { text: 'I learned nothing', isCorrect: false },
                    { text: 'I need to review', isCorrect: false }
                  ],
                  rightAnswerCount: 1
                }
              }
            }
          }
        });
        quizCount++;
      }
      
      if (quizzesToCreate > 0) {
        console.log(`Created ${quizzesToCreate} quizzes for lesson ${lessonId}`);
      } else {
        console.log(`Lesson ${lessonId} already has enough quizzes`);
      }
    }

    // Check if demo user already exists
    console.log('Checking demo user...');
    const demoUserId = 'demo_user_123';
    
    try {
      const existingUserResponse = await client.graphql({
        query: zunoEntriesByUserWithMetadata,
        variables: {
          userId: demoUserId,
          entryTypeTimestamp: {
            eq: {
              entryType: 'USER_PROGRESS' as ZunoEntryTypeValues
            }
          },
          limit: 1
        }
      }) as any;
      
      const userExists = existingUserResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items?.length > 0;
      
      if (!userExists) {
        console.log('Creating demo user...');
        try {
          await client.graphql({
            query: createZunoEntryWithMetadata,
            variables: {
              input: {
                id: `${demoUserId}_profile`,
                userId: demoUserId,
                entryType: 'USER_PROGRESS' as ZunoEntryTypeValues,
                timestamp: new Date().toISOString(),
                metadata: {
                  userProfile: {
                    email: 'demo@zuno.com',
                    username: 'demo_user',
                    fullName: 'Demo User',
                    subscriptionTier: 'premium',
                    totalXp: 2450,
                    currentLevel: 8,
                    coachName: 'ELIA' as CoachNameValues,
                    onboardingCompleted: true
                  }
                }
              }
            }
          });
          console.log('Created demo user');
        } catch (createError: any) {
          if (createError?.errors?.[0]?.errorType === 'DynamoDB:ConditionalCheckFailedException') {
            console.log('Demo user already exists (conditional check failed)');
          } else {
            throw createError;
          }
        }
      } else {
        console.log('Demo user already exists');
      }
    } catch (error: any) {
      console.log('Could not check demo user, assuming it exists:', error.message);
    }

    // Check if demo user is already enrolled in first course
    if (courseIds.length > 0) {
      try {
        const existingEnrollmentResponse = await client.graphql({
          query: zunoEntriesByUserWithMetadata,
          variables: {
            userId: demoUserId,
            entryTypeTimestamp: {
              eq: {
                entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues
              }
            }
          }
        }) as any;
        
        const isEnrolled = existingEnrollmentResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items
          ?.some((item: any) => item?.catalogId === courseIds[0]);
        
        if (!isEnrolled) {
          console.log('Enrolling demo user in first course...');
          try {
            await client.graphql({
              query: createZunoEntryWithMetadata,
              variables: {
                input: {
                  id: `${demoUserId}_${courseIds[0]}_enrollment`,
                  userId: demoUserId,
                  catalogId: courseIds[0],
                  entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues,
                  timestamp: new Date().toISOString(),
                  metadata: {
                    userActivity: {
                      activityType: 'ENROLLMENT',
                      description: `Enrolled in course ${courseIds[0]}`,
                      activityDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
                    }
                  }
                }
              }
            });
            console.log('Demo user enrolled in first course');
          } catch (enrollError: any) {
            if (enrollError?.errors?.[0]?.errorType === 'DynamoDB:ConditionalCheckFailedException') {
              console.log('Demo user already enrolled (conditional check failed)');
            } else {
              throw enrollError;
            }
          }
        } else {
          console.log('Demo user already enrolled in first course');
        }
      } catch (error: any) {
        console.log('Could not check enrollment, skipping:', error.message);
      }
    }

    console.log('Database seeding completed successfully!');
    console.log(`Processed ${sampleCourses.length} courses`);
    console.log(`Processed ${courseIds.length * sampleLessons.length} lessons`);
    console.log(`Created ${quizCount} quizzes`);
    console.log(`Processed ${sampleCoaches.length} coaches`);
    console.log('Processed demo user');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}