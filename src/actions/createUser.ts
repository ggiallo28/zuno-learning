import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { User, ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface CreateUserParams {
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
}

async function createUser(params: CreateUserParams): Promise<User> {
  try {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    const response = await client.graphql({
      query: createZunoEntryWithMetadata,
      variables: {
        input: {
          id: `${userId}_profile`,
          userId,
          entryType: 'USER_PROGRESS' as ZunoEntryTypeValues,
          timestamp: new Date().toISOString(),
          metadata: {
            userProfile: {
              email: params.email,
              username: params.username,
              fullName: params.fullName,
              subscriptionTier: 'free',
              totalXp: 0,
              currentLevel: 1,
              onboardingCompleted: false
            }
          }
        }
      }
    }) as GraphQLResult<any>;

    if (response.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
    }

    return {
      id: userId,
      email: params.email,
      username: params.username,
      fullName: params.fullName,
      subscriptionTier: 'free',
      totalXp: 0,
      currentLevel: 1,
      onboardingCompleted: false,
      enrolledCourses: 0,
      completedCourses: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export default createUser;
