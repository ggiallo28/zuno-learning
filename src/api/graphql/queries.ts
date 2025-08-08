/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../amplify";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getZunoEntry = /* GraphQL */ `query GetZunoEntry($id: ID!) {
  getZunoEntry(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetZunoEntryQueryVariables,
  APITypes.GetZunoEntryQuery
>;
export const listZunoEntries = /* GraphQL */ `query ListZunoEntries(
  $filter: ModelZunoEntryFilterInput
  $limit: Int
  $nextToken: String
) {
  listZunoEntries(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      entryType
      catalogId
      groupId
      timestamp
      createdAt
      updatedAt
      zunoCatalogFactsId
      zunoGroupFactsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListZunoEntriesQueryVariables,
  APITypes.ListZunoEntriesQuery
>;
export const getZunoCatalog = /* GraphQL */ `query GetZunoCatalog($id: ID!) {
  getZunoCatalog(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetZunoCatalogQueryVariables,
  APITypes.GetZunoCatalogQuery
>;
export const listZunoCatalogs = /* GraphQL */ `query ListZunoCatalogs(
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListZunoCatalogsQueryVariables,
  APITypes.ListZunoCatalogsQuery
>;
export const getZunoGroup = /* GraphQL */ `query GetZunoGroup($id: ID!) {
  getZunoGroup(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetZunoGroupQueryVariables,
  APITypes.GetZunoGroupQuery
>;
export const listZunoGroups = /* GraphQL */ `query ListZunoGroups(
  $filter: ModelZunoGroupFilterInput
  $limit: Int
  $nextToken: String
) {
  listZunoGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      subjectArea
      createdBy
      members
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListZunoGroupsQueryVariables,
  APITypes.ListZunoGroupsQuery
>;
export const zunoEntriesByUserIdAndEntryTypeAndTimestamp = /* GraphQL */ `query ZunoEntriesByUserIdAndEntryTypeAndTimestamp(
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
      createdAt
      updatedAt
      zunoCatalogFactsId
      zunoGroupFactsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoEntriesByUserIdAndEntryTypeAndTimestampQueryVariables,
  APITypes.ZunoEntriesByUserIdAndEntryTypeAndTimestampQuery
>;
export const zunoEntriesByCatalogIdAndEntryTypeAndTimestamp = /* GraphQL */ `query ZunoEntriesByCatalogIdAndEntryTypeAndTimestamp(
  $catalogId: ID!
  $entryTypeTimestamp: ModelZunoEntryByCatalogCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelZunoEntryFilterInput
  $limit: Int
  $nextToken: String
) {
  zunoEntriesByCatalogIdAndEntryTypeAndTimestamp(
    catalogId: $catalogId
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
      createdAt
      updatedAt
      zunoCatalogFactsId
      zunoGroupFactsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQueryVariables,
  APITypes.ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQuery
>;
export const zunoEntriesByGroupIdAndEntryTypeAndTimestamp = /* GraphQL */ `query ZunoEntriesByGroupIdAndEntryTypeAndTimestamp(
  $groupId: ID!
  $entryTypeTimestamp: ModelZunoEntryByGroupCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelZunoEntryFilterInput
  $limit: Int
  $nextToken: String
) {
  zunoEntriesByGroupIdAndEntryTypeAndTimestamp(
    groupId: $groupId
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
      createdAt
      updatedAt
      zunoCatalogFactsId
      zunoGroupFactsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoEntriesByGroupIdAndEntryTypeAndTimestampQueryVariables,
  APITypes.ZunoEntriesByGroupIdAndEntryTypeAndTimestampQuery
>;
export const zunoCatalogsByParentIdAndItemTypeAndTimestamp = /* GraphQL */ `query ZunoCatalogsByParentIdAndItemTypeAndTimestamp(
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoCatalogsByParentIdAndItemTypeAndTimestampQueryVariables,
  APITypes.ZunoCatalogsByParentIdAndItemTypeAndTimestampQuery
>;
export const zunoCatalogsByItemTypeAndTimestamp = /* GraphQL */ `query ZunoCatalogsByItemTypeAndTimestamp(
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoCatalogsByItemTypeAndTimestampQueryVariables,
  APITypes.ZunoCatalogsByItemTypeAndTimestampQuery
>;
