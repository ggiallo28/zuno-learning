export const createZunoCatalogWithMetadata = /* GraphQL */ `
  mutation CreateZunoCatalogWithMetadata(
    $input: CreateZunoCatalogInput!
    $condition: ModelZunoCatalogConditionInput
  ) {
    createZunoCatalog(input: $input, condition: $condition) {
      id
      parentId
      itemType
      timestamp
      metadata {
        course {
          title
          category
          difficultyLevel
        }
        quiz {
          courseId
          lessonId
          questionText
          questionType
        }
        lesson {
          courseId
          title
          lessonOrder
          lessonType
        }
        coach {
          coachName
          displayName
          avatarUrl
          bio
        }
        achievement {
          name
          requirementType
          xpReward
          badgeIcon
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const createZunoEntryWithMetadata = /* GraphQL */ `
  mutation CreateZunoEntryWithMetadata(
    $input: CreateZunoEntryInput!
    $condition: ModelZunoEntryConditionInput
  ) {
    createZunoEntry(input: $input, condition: $condition) {
      id
      userId
      catalogId
      entryType
      timestamp
      metadata {
        userProfile {
          email
          username
          fullName
          subscriptionTier
          totalXp
          currentLevel
          coachName
          onboardingCompleted
        }
        assessmentResult {
          score
          passed
        }
        userProgress {
          totalXpEarned
          completedLessons
          currentStreak
          masteryLevel
        }
        userActivity {
          activityDate
          activityType
          description
        }
        knowledgeGap {
          subjectArea
          conceptName
          severity
        }
        coachInteraction {
          interactionType
          notes
          occurredAt
        }
        scheduledReview {
          contentId
          nextReviewDate
          repetitionCount
        }
        userLearningAnalytics {
          metricName
          metricValue
          recordedAt
        }
        groupActivity {
          activityId
          groupId
          activityType
          title
          description
          startedAt
          endedAt
          participants
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const updateZunoEntryWithMetadata = /* GraphQL */ `
  mutation UpdateZunoEntryWithMetadata(
    $input: UpdateZunoEntryInput!
    $condition: ModelZunoEntryConditionInput
  ) {
    updateZunoEntry(input: $input, condition: $condition) {
      id
      userId
      catalogId
      entryType
      timestamp
      metadata {
        userProfile {
          email
          username
          fullName
          subscriptionTier
          totalXp
          currentLevel
          coachName
          onboardingCompleted
        }
        assessmentResult {
          score
          passed
        }
        userProgress {
          totalXpEarned
          completedLessons
          currentStreak
          masteryLevel
        }
        userActivity {
          activityDate
          activityType
          description
        }
        knowledgeGap {
          subjectArea
          conceptName
          severity
        }
        coachInteraction {
          interactionType
          notes
          occurredAt
        }
        scheduledReview {
          contentId
          nextReviewDate
          repetitionCount
        }
        userLearningAnalytics {
          metricName
          metricValue
          recordedAt
        }
        groupActivity {
          activityId
          groupId
          activityType
          title
          description
          startedAt
          endedAt
          participants
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;