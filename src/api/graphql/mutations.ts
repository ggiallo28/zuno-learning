/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../amplify";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createZunoEntry = /* GraphQL */ `mutation CreateZunoEntry(
  $input: CreateZunoEntryInput!
  $condition: ModelZunoEntryConditionInput
) {
  createZunoEntry(input: $input, condition: $condition) {
    id
    userId
    entryType
    catalogId
    catalog {
      id
      parentId
      itemType
      timestamp
      createdAt
      updatedAt
      __typename
    }
    groupId
    group {
      id
      name
      subjectArea
      createdBy
      members
      createdAt
      updatedAt
      __typename
    }
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    zunoCatalogFactsId
    zunoGroupFactsId
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
    entryType
    catalogId
    catalog {
      id
      parentId
      itemType
      timestamp
      createdAt
      updatedAt
      __typename
    }
    groupId
    group {
      id
      name
      subjectArea
      createdBy
      members
      createdAt
      updatedAt
      __typename
    }
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    zunoCatalogFactsId
    zunoGroupFactsId
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
    entryType
    catalogId
    catalog {
      id
      parentId
      itemType
      timestamp
      createdAt
      updatedAt
      __typename
    }
    groupId
    group {
      id
      name
      subjectArea
      createdBy
      members
      createdAt
      updatedAt
      __typename
    }
    timestamp
    metadata {
      __typename
    }
    createdAt
    updatedAt
    zunoCatalogFactsId
    zunoGroupFactsId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteZunoEntryMutationVariables,
  APITypes.DeleteZunoEntryMutation
>;
export const createZunoCatalog = /* GraphQL */ `mutation CreateZunoCatalog(
  $input: CreateZunoCatalogInput!
  $condition: ModelZunoCatalogConditionInput
) {
  createZunoCatalog(input: $input, condition: $condition) {
    id
    parentId
    itemType
    timestamp
    metadata {
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
    timestamp
    metadata {
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
    timestamp
    metadata {
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
export const createZunoGroup = /* GraphQL */ `mutation CreateZunoGroup(
  $input: CreateZunoGroupInput!
  $condition: ModelZunoGroupConditionInput
) {
  createZunoGroup(input: $input, condition: $condition) {
    id
    name
    subjectArea
    createdBy
    members
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
  APITypes.CreateZunoGroupMutationVariables,
  APITypes.CreateZunoGroupMutation
>;
export const updateZunoGroup = /* GraphQL */ `mutation UpdateZunoGroup(
  $input: UpdateZunoGroupInput!
  $condition: ModelZunoGroupConditionInput
) {
  updateZunoGroup(input: $input, condition: $condition) {
    id
    name
    subjectArea
    createdBy
    members
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
  APITypes.UpdateZunoGroupMutationVariables,
  APITypes.UpdateZunoGroupMutation
>;
export const deleteZunoGroup = /* GraphQL */ `mutation DeleteZunoGroup(
  $input: DeleteZunoGroupInput!
  $condition: ModelZunoGroupConditionInput
) {
  deleteZunoGroup(input: $input, condition: $condition) {
    id
    name
    subjectArea
    createdBy
    members
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
  APITypes.DeleteZunoGroupMutationVariables,
  APITypes.DeleteZunoGroupMutation
>;
