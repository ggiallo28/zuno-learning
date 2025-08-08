/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../amplify";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateZunoEntry = /* GraphQL */ `subscription OnCreateZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onCreateZunoEntry(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateZunoEntrySubscriptionVariables,
  APITypes.OnCreateZunoEntrySubscription
>;
export const onUpdateZunoEntry = /* GraphQL */ `subscription OnUpdateZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onUpdateZunoEntry(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateZunoEntrySubscriptionVariables,
  APITypes.OnUpdateZunoEntrySubscription
>;
export const onDeleteZunoEntry = /* GraphQL */ `subscription OnDeleteZunoEntry($filter: ModelSubscriptionZunoEntryFilterInput) {
  onDeleteZunoEntry(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteZunoEntrySubscriptionVariables,
  APITypes.OnDeleteZunoEntrySubscription
>;
export const onCreateZunoCatalog = /* GraphQL */ `subscription OnCreateZunoCatalog(
  $filter: ModelSubscriptionZunoCatalogFilterInput
) {
  onCreateZunoCatalog(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteZunoCatalogSubscriptionVariables,
  APITypes.OnDeleteZunoCatalogSubscription
>;
export const onCreateZunoGroup = /* GraphQL */ `subscription OnCreateZunoGroup($filter: ModelSubscriptionZunoGroupFilterInput) {
  onCreateZunoGroup(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateZunoGroupSubscriptionVariables,
  APITypes.OnCreateZunoGroupSubscription
>;
export const onUpdateZunoGroup = /* GraphQL */ `subscription OnUpdateZunoGroup($filter: ModelSubscriptionZunoGroupFilterInput) {
  onUpdateZunoGroup(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateZunoGroupSubscriptionVariables,
  APITypes.OnUpdateZunoGroupSubscription
>;
export const onDeleteZunoGroup = /* GraphQL */ `subscription OnDeleteZunoGroup($filter: ModelSubscriptionZunoGroupFilterInput) {
  onDeleteZunoGroup(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteZunoGroupSubscriptionVariables,
  APITypes.OnDeleteZunoGroupSubscription
>;
