import { client } from '../lib/graphql';
import { zunoCatalogsByParentWithMetadata, zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';
import type { Lesson, CatalogItemTypeValues, ZunoEntryTypeValues, ZunoCatalog, ZunoEntry, LessonTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface LoadLessonsParams {
  courseId: string;
  userId?: string;
}

interface LessonWithStatus extends Lesson {
  isCompleted: boolean;
  score: number;
  attempts: number;
}

async function loadLessons(params: LoadLessonsParams): Promise<LessonWithStatus[]> {
  try {
    // Get lessons for the course
    const lessonsResponse = await client.graphql({
      query: zunoCatalogsByParentWithMetadata,
      variables: {
        parentId: params.courseId,
        itemTypeTimestamp: {
          beginsWith: {
            itemType: 'LESSON' as CatalogItemTypeValues
          }
        }
      }
    }) as GraphQLResult<any>;

    const items = lessonsResponse.data?.zunoCatalogsByParentIdAndItemTypeAndTimestamp?.items || [];
    
    let lessons: LessonWithStatus[] = items
      .filter((item: ZunoCatalog | null) => item?.metadata?.lesson)
      .map((item: ZunoCatalog) => ({
        id: item.id,
        courseId: item.metadata?.lesson?.courseId || params.courseId,
        title: item.metadata?.lesson?.title || 'Untitled Lesson',
        lessonOrder: item.metadata?.lesson?.lessonOrder || 0,
        lessonType: item.metadata?.lesson?.lessonType || 'READING',
        content: `Content for ${item.metadata?.lesson?.title || 'this lesson'}`,
        xpReward: 50,
        estimatedMinutes: 5,
        isCompleted: false,
        score: 0,
        attempts: 0
      }));

    // If no lessons found, provide sample lessons for demonstration
    if (lessons.length === 0) {
      lessons = [
        {
          id: `${params.courseId}_lesson_1`,
          courseId: params.courseId,
          title: 'Introduzione ai Concetti Base',
          lessonOrder: 1,
          lessonType: 'READING' as LessonTypeValues,
          content: 'In questa lezione imparerai i concetti fondamentali della programmazione, inclusi variabili, tipi di dati e strutture di controllo.',
          xpReward: 50,
          estimatedMinutes: 10,
          isCompleted: false,
          score: 0,
          attempts: 0
        },
        {
          id: `${params.courseId}_lesson_2`,
          courseId: params.courseId,
          title: 'Funzioni e Modularità',
          lessonOrder: 2,
          lessonType: 'READING' as LessonTypeValues,
          content: 'Scopri come organizzare il tuo codice utilizzando funzioni per creare programmi più leggibili e riutilizzabili.',
          xpReward: 75,
          estimatedMinutes: 15,
          isCompleted: false,
          score: 0,
          attempts: 0
        },
        {
          id: `${params.courseId}_lesson_3`,
          courseId: params.courseId,
          title: 'Quiz di Verifica',
          lessonOrder: 3,
          lessonType: 'QUIZ' as LessonTypeValues,
          content: 'Metti alla prova le tue conoscenze con questo quiz interattivo sui concetti appresi.',
          xpReward: 100,
          estimatedMinutes: 8,
          isCompleted: false,
          score: 0,
          attempts: 0
        }
      ];
    }

    // If userId is provided, get completion status
    if (params.userId) {
      try {
        const completionResponse = await client.graphql({
          query: zunoEntriesByUserWithMetadata,
          variables: {
            userId: params.userId,
            entryTypeTimestamp: {
              beginsWith: {
                entryType: 'LESSON_COMPLETION' as ZunoEntryTypeValues
              }
            }
          }
        }) as GraphQLResult<any>;

        const completionItems = completionResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
        const completedLessons = new Set(
          completionItems
            .map((item: ZunoEntry) => item?.catalogId)
            .filter(Boolean)
        );

        lessons.forEach((lesson: LessonWithStatus) => {
          lesson.isCompleted = completedLessons.has(lesson.id);
        });
      } catch (error) {
        console.warn('Could not load lesson completion status:', error);
      }
    }

    return lessons.sort((a: LessonWithStatus, b: LessonWithStatus) => 
      (a.lessonOrder || 0) - (b.lessonOrder || 0)
    );
  } catch (error) {
    console.error('Error loading lessons:', error);
    return [];
  }
}

export default loadLessons;
