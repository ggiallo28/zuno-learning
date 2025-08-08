import { client } from '../lib/graphql';
import { zunoCatalogsByParentWithMetadata } from '../api/graphql/customQueries';
import type { CatalogItemTypeValues, ZunoCatalog } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface QuizPossibility {
  text: string;
  isCorrect?: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

interface QuizQuestion {
  id: string;
  lessonId?: string;
  questionText?: string;
  questionType?: string;
  possibilities?: QuizPossibility[];
  rightAnswerCount?: number;
  // Legacy support
  options?: string[];
  correctAnswer?: string;
}

async function loadQuizQuestions(lessonId: string): Promise<QuizQuestion[]> {
  try {
    const response = await client.graphql({
      query: zunoCatalogsByParentWithMetadata,
      variables: {
        parentId: lessonId,
        itemTypeTimestamp: {
          beginsWith: {
            itemType: 'QUIZ' as CatalogItemTypeValues
          }
        }
      }
    }) as GraphQLResult<any>;

    const items = response.data?.zunoCatalogsByParentIdAndItemTypeAndTimestamp?.items || [];
    
    const questions: QuizQuestion[] = items
      .filter((item: ZunoCatalog | null) => item?.metadata?.quiz)
      .map((item: ZunoCatalog) => {
        const quiz = item.metadata?.quiz;
        return {
          id: item.id,
          lessonId: quiz?.lessonId || lessonId,
          questionText: quiz?.questionText || 'Sample question',
          questionType: quiz?.questionType || 'MULTIPLE_CHOICE',
          possibilities: quiz?.possibilities || [
            { text: 'Option A', isCorrect: true },
            { text: 'Option B', isCorrect: false },
            { text: 'Option C', isCorrect: false },
            { text: 'Option D', isCorrect: false }
          ],
          rightAnswerCount: quiz?.rightAnswerCount || 1,
          // Legacy support - convert possibilities to options
          options: quiz?.possibilities?.map(p => p.text) || [
            'Option A',
            'Option B', 
            'Option C',
            'Option D'
          ],
          correctAnswer: quiz?.possibilities?.find(p => p.isCorrect)?.text || 'Option A'
        };
      });

    return questions;
  } catch (error) {
    console.error('Error loading quiz questions:', error);
    return [];
  }
}

export default loadQuizQuestions;
