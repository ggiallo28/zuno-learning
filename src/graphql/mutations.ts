/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../latest/src/api/amplify";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createZunoCatalog = /* GraphQL */ `mutation CreateZunoCatalog(
  $input: CreateZunoCatalogInput!
  $condition: ModelZunoCatalogConditionInput
) {
  createZunoCatalog(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateZunoCatalogMutationVariables,
  APITypes.CreateZunoCatalogMutation
>;
export const updateZunoCatalog = /* GraphQL */ `mutation UpdateZunoCatalog(
  $input: UpdateZunoCatalogInput!
  $condition: ModelZunoCatalogConditionInput
) {
  updateZunoCatalog(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateZunoCatalogMutationVariables,
  APITypes.UpdateZunoCatalogMutation
>;
export const deleteZunoCatalog = /* GraphQL */ `mutation DeleteZunoCatalog(
  $input: DeleteZunoCatalogInput!
  $condition: ModelZunoCatalogConditionInput
) {
  deleteZunoCatalog(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteZunoCatalogMutationVariables,
  APITypes.DeleteZunoCatalogMutation
>;
export const createZunoEntry = /* GraphQL */ `mutation CreateZunoEntry(
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
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateZunoEntryMutationVariables,
  APITypes.CreateZunoEntryMutation
>;
export const updateZunoEntry = /* GraphQL */ `mutation UpdateZunoEntry(
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
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateZunoEntryMutationVariables,
  APITypes.UpdateZunoEntryMutation
>;
export const deleteZunoEntry = /* GraphQL */ `mutation DeleteZunoEntry(
  $input: DeleteZunoEntryInput!
  $condition: ModelZunoEntryConditionInput
) {
  deleteZunoEntry(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteZunoEntryMutationVariables,
  APITypes.DeleteZunoEntryMutation
>;
