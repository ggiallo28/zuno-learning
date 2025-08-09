import { client } from '../lib/graphql';
import { createZunoEntryWithMetadata } from '../api/graphql/customMutations';
import { getCurrentUser } from 'aws-amplify/auth';
import type { User, ZunoEntryTypeValues } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface CreateUserParams {
  email?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

async function createUser(params: CreateUserParams = {}): Promise<User> {
  try {
    // Get the current authenticated user from Cognito or use API key defaults
    let userId: string;
    let email: string;
    let username: string;
    
    try {
      const cognitoUser = await getCurrentUser();
      userId = cognitoUser.userId;
      email = params.email || cognitoUser.signInDetails?.loginId || '';
      username = params.username || cognitoUser.username;
    } catch (error) {
      // Fallback for API Key mode
      userId = `api_user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      email = params.email || 'developer@localhost';
      username = params.username || 'developer';
    }
    
    const fullName = params.fullName || username;
    
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
              email,
              username,
              fullName,
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
      email,
      username,
      fullName,
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
