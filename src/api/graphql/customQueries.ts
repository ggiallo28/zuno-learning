/* Custom GraphQL queries that match the actual schema structure */

export const getZunoCatalogWithMetadata = /* GraphQL */ `
  query GetZunoCatalogWithMetadata($id: ID!) {
    getZunoCatalog(id: $id) {
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

export const listZunoCatalogsWithMetadata = /* GraphQL */ `
  query ListZunoCatalogsWithMetadata(
    $filter: ModelZunoCatalogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listZunoCatalogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;

export const zunoCatalogsByItemTypeWithMetadata = /* GraphQL */ `
  query ZunoCatalogsByItemTypeWithMetadata(
    $itemType: CatalogItemTypeValues!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelZunoCatalogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    zunoCatalogsByItemTypeAndTimestamp(
      itemType: $itemType
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;

export const zunoCatalogsByParentWithMetadata = /* GraphQL */ `
  query ZunoCatalogsByParentWithMetadata(
    $parentId: ID!
    $itemTypeTimestamp: ModelZunoCatalogByParentCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelZunoCatalogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    zunoCatalogsByParentIdAndItemTypeAndTimestamp(
      parentId: $parentId
      itemTypeTimestamp: $itemTypeTimestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;

export const getZunoEntryWithMetadata = /* GraphQL */ `
  query GetZunoEntryWithMetadata($id: ID!) {
    getZunoEntry(id: $id) {
      id
      userId
      entryType
      catalogId
      groupId
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

export const zunoEntriesByUserWithMetadata = /* GraphQL */ `
  query ZunoEntriesByUserWithMetadata(
    $userId: ID!
    $entryTypeTimestamp: ModelZunoEntryByUserCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelZunoEntryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    zunoEntriesByUserIdAndEntryTypeAndTimestamp(
      userId: $userId
      entryTypeTimestamp: $entryTypeTimestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        entryType
        catalogId
        groupId
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
      nextToken
      __typename
    }
  }
`;