/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../latest/src/api/amplify";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateZunoCatalog = /* GraphQL */ `subscription OnCreateZunoCatalog(
  $filter: ModelSubscriptionZunoCatalogFilterInput
) {
  onCreateZunoCatalog(filter: $filter) {
    id
    parentId
    itemType
    course {
      title
      category
      difficultyLevel
      __typename
    }
    quiz {
      courseId
      lessonId
      questionText
      questionType
      __typename
    }
    lesson {
      courseId
      title
      lessonOrder
      lessonType
      __typename
    }
    coach {
      coachType
      displayName
      avatarUrl
      bio
      __typename
    }
    achievement {
      name
      requirementType
      xpReward
      badgeIcon
      __typename
    }
    facts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateZunoCatalogSubscriptionVariables,
  APITypes.OnCreateZunoCatalogSubscription
>;
export const onUpdateZunoCatalog = /* GraphQL */ `subscription OnUpdateZunoCatalog(
  $filter: ModelSubscriptionZunoCatalogFilterInput
) {
  onUpdateZunoCatalog(filter: $filter) {
    id
    parentId
    itemType
    course {
      title
      category
      difficultyLevel
      __typename
    }
    quiz {
      courseId
      lessonId
      questionText
      questionType
      __typename
    }
    lesson {
      courseId
      title
      lessonOrder
      lessonType
      __typename
    }
    coach {
      coachType
      displayName
      avatarUrl
      bio
      __typename
    }
    achievement {
      name
      requirementType
      xpReward
      badgeIcon
      __typename
    }
    facts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateZunoCatalogSubscriptionVariables,
  APITypes.OnUpdateZunoCatalogSubscription
>;
export const onDeleteZunoCatalog = /* GraphQL */ `subscription OnDeleteZunoCatalog(
  $filter: ModelSubscriptionZunoCatalogFilterInput
) {
  onDeleteZunoCatalog(filter: $filter) {
    id
    parentId
    itemType
    course {
      title
      category
      difficultyLevel
      __typename
    }
    quiz {
      courseId
      lessonId
      questionText
      questionType
      __typename
    }
    lesson {
      courseId
      title
      lessonOrder
      lessonType
      __typename
    }
    coach {
      coachType
      displayName
      avatarUrl
      bio
      __typename
    }
    achievement {
      name
      requirementType
      xpReward
      badgeIcon
      __typename
    }
    facts {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteZunoCatalogSubscriptionVariables,
  APITypes.OnDeleteZunoCatalogSubscription
>;
export const onCreateZunoEntry = /* GraphQL */ `subscription OnCreateZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onCreateZunoEntry(filter: $filter) {
    id
    userId
    catalogId
    entryType
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateZunoEntrySubscriptionVariables,
  APITypes.OnCreateZunoEntrySubscription
>;
export const onUpdateZunoEntry = /* GraphQL */ `subscription OnUpdateZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onUpdateZunoEntry(filter: $filter) {
    id
    userId
    catalogId
    entryType
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateZunoEntrySubscriptionVariables,
  APITypes.OnUpdateZunoEntrySubscription
>;
export const onDeleteZunoEntry = /* GraphQL */ `subscription OnDeleteZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onDeleteZunoEntry(filter: $filter) {
    id
    userId
    catalogId
    entryType
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteZunoEntrySubscriptionVariables,
  APITypes.OnDeleteZunoEntrySubscription
>;
