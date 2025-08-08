import { client } from '../lib/graphql';
import { zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';
import type { User, ZunoEntryTypeValues, ZunoEntry } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

async function loadUserProfile(userId: string): Promise<User | null> {
  try {
    // Get user profile entry
    const profileResponse = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'USER_PROGRESS' as ZunoEntryTypeValues
          }
        },
        limit: 1
      }
    }) as GraphQLResult<any>;

    // Get enrollment count
    const enrollmentResponse = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'COURSE_COMPLETION' as ZunoEntryTypeValues
          }
        }
      }
    }) as GraphQLResult<any>;

    const items = profileResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    const profileEntry = items[0] as ZunoEntry | undefined;
    
    if (!profileEntry?.metadata?.userProfile) {
      return null;
    }

    const profile = profileEntry.metadata.userProfile;
    
    const enrollmentItems = enrollmentResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    const enrolledCourses = enrollmentItems.length;
    const completedCourses = enrollmentItems
      .filter((item: ZunoEntry) => item?.metadata?.assessmentResult?.passed).length;

    return {
      id: userId,
      email: profile.email,
      username: profile.username,
      fullName: profile.fullName || undefined,
      subscriptionTier: profile.subscriptionTier || 'free',
      totalXp: profile.totalXp,
      currentLevel: profile.currentLevel,
      coachName: profile.coachName || undefined,
      onboardingCompleted: profile.onboardingCompleted,
      enrolledCourses,
      completedCourses,
      currentStreak: 12, // TODO: Calculate from actual data
      longestStreak: 28, // TODO: Calculate from actual data
      lastActivityDate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}

export default loadUserProfile;