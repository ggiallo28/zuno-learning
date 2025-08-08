import { client } from '../lib/graphql';
import { zunoEntriesByUserWithMetadata } from '../api/graphql/customQueries';
import { updateZunoEntryWithMetadata } from '../api/graphql/customMutations';
import type { CoachNameValues, ZunoEntryTypeValues, ZunoEntry } from '../types';
import type { GraphQLResult } from '@aws-amplify/api-graphql';

interface UpdateUserCoachParams {
  userId: string;
  coachType: CoachNameValues;
  onboardingCompleted?: boolean;
}

async function updateUserCoach(params: UpdateUserCoachParams): Promise<{ success: boolean; coachType: CoachNameValues }> {
  try {
    // Get the user's profile entry
    const profileResponse = await client.graphql({
      query: zunoEntriesByUserWithMetadata,
      variables: {
        userId: params.userId,
        entryTypeTimestamp: {
          beginsWith: {
            entryType: 'USER_PROGRESS' as ZunoEntryTypeValues
          }
        },
        limit: 1
      }
    }) as GraphQLResult<any>;

    const items = profileResponse.data?.zunoEntriesByUserIdAndEntryTypeAndTimestamp?.items || [];
    const profileEntry = items[0] as ZunoEntry | undefined;
    
    if (!profileEntry) {
      throw new Error('User profile not found');
    }

    // Update the profile with new coach
    const updatedMetadata = {
      ...profileEntry.metadata,
      userProfile: {
        ...profileEntry.metadata?.userProfile,
        coachName: params.coachType,
        onboardingCompleted: params.onboardingCompleted ?? profileEntry.metadata?.userProfile?.onboardingCompleted ?? false
      }
    };

    const response = await client.graphql({
      query: updateZunoEntryWithMetadata,
      variables: {
        input: {
          id: profileEntry.id,
          metadata: updatedMetadata
        }
      }
    }) as GraphQLResult<any>;

    if (response.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
    }

    return {
      success: true,
      coachType: params.coachType
    };
  } catch (error) {
    console.error('Error updating user coach:', error);
    throw error;
  }
}

export default updateUserCoach;
