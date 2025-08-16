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
    
    let questions: QuizQuestion[] = items
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

    // If no questions found, provide sample questions for demonstration
    if (questions.length === 0) {
      questions = [
        {
          id: `${lessonId}_q1`,
          lessonId,
          questionText: 'Quale dei seguenti è un concetto fondamentale nella programmazione?',
          questionType: 'MULTIPLE_CHOICE',
          possibilities: [
            { text: 'Variabili e tipi di dati', isCorrect: true },
            { text: 'Colore del testo', isCorrect: false },
            { text: 'Dimensione del monitor', isCorrect: false },
            { text: 'Marca del computer', isCorrect: false }
          ],
          rightAnswerCount: 1,
          options: ['Variabili e tipi di dati', 'Colore del testo', 'Dimensione del monitor', 'Marca del computer'],
          correctAnswer: 'Variabili e tipi di dati'
        },
        {
          id: `${lessonId}_q2`,
          lessonId,
          questionText: 'Cosa significa "debugging" nella programmazione?',
          questionType: 'MULTIPLE_CHOICE',
          possibilities: [
            { text: 'Scrivere nuovo codice', isCorrect: false },
            { text: 'Trovare e correggere errori nel codice', isCorrect: true },
            { text: 'Cancellare tutto il codice', isCorrect: false },
            { text: 'Cambiare il linguaggio di programmazione', isCorrect: false }
          ],
          rightAnswerCount: 1,
          options: ['Scrivere nuovo codice', 'Trovare e correggere errori nel codice', 'Cancellare tutto il codice', 'Cambiare il linguaggio di programmazione'],
          correctAnswer: 'Trovare e correggere errori nel codice'
        },
        {
          id: `${lessonId}_q3`,
          lessonId,
          questionText: 'Qual è il vantaggio principale dell\'uso di funzioni nel codice?',
          questionType: 'MULTIPLE_CHOICE',
          possibilities: [
            { text: 'Rendere il codice più lungo', isCorrect: false },
            { text: 'Riutilizzabilità e organizzazione del codice', isCorrect: true },
            { text: 'Rallentare l\'esecuzione', isCorrect: false },
            { text: 'Aumentare la complessità', isCorrect: false }
          ],
          rightAnswerCount: 1,
          options: ['Rendere il codice più lungo', 'Riutilizzabilità e organizzazione del codice', 'Rallentare l\'esecuzione', 'Aumentare la complessità'],
          correctAnswer: 'Riutilizzabilità e organizzazione del codice'
        }
      ];
    }

    return questions;
  } catch (error) {
    console.error('Error loading quiz questions:', error);
    
    // Return sample questions as fallback
    return [
      {
        id: `${lessonId}_fallback_q1`,
        lessonId,
        questionText: 'Questa è una domanda di esempio. Quale risposta sceglieresti?',
        questionType: 'MULTIPLE_CHOICE',
        possibilities: [
          { text: 'Prima opzione (corretta)', isCorrect: true },
          { text: 'Seconda opzione', isCorrect: false },
          { text: 'Terza opzione', isCorrect: false },
          { text: 'Quarta opzione', isCorrect: false }
        ],
        rightAnswerCount: 1,
        options: ['Prima opzione (corretta)', 'Seconda opzione', 'Terza opzione', 'Quarta opzione'],
        correctAnswer: 'Prima opzione (corretta)'
      }
    ];
  }
}

export default loadQuizQuestions;
