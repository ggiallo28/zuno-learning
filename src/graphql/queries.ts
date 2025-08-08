/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../../latest/src/api/amplify";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getZunoCatalog = /* GraphQL */ `query GetZunoCatalog($id: ID!) {
  getZunoCatalog(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetZunoCatalogQueryVariables,
  APITypes.GetZunoCatalogQuery
>;
export const listZunoCatalogs = /* GraphQL */ `query ListZunoCatalogs(
  $id: ID
  $filter: ModelZunoCatalogFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listZunoCatalogs(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      parentId
      itemType
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
export const getZunoEntry = /* GraphQL */ `query GetZunoEntry($id: ID!) {
  getZunoEntry(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetZunoEntryQueryVariables,
  APITypes.GetZunoEntryQuery
>;
export const listZunoEntries = /* GraphQL */ `query ListZunoEntries(
  $id: ID
  $filter: ModelZunoEntryFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listZunoEntries(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      id
      userId
      catalogId
      entryType
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
  APITypes.ListZunoEntriesQueryVariables,
  APITypes.ListZunoEntriesQuery
>;
export const zunoCatalogsByParentIdAndItemType = /* GraphQL */ `query ZunoCatalogsByParentIdAndItemType(
  $parentId: ID!
  $itemType: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelZunoCatalogFilterInput
  $limit: Int
  $nextToken: String
) {
  zunoCatalogsByParentIdAndItemType(
    parentId: $parentId
    itemType: $itemType
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      parentId
      itemType
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoCatalogsByParentIdAndItemTypeQueryVariables,
  APITypes.ZunoCatalogsByParentIdAndItemTypeQuery
>;
export const zunoCatalogsByItemType = /* GraphQL */ `query ZunoCatalogsByItemType(
  $itemType: CatalogItemType!
  $sortDirection: ModelSortDirection
  $filter: ModelZunoCatalogFilterInput
  $limit: Int
  $nextToken: String
) {
  zunoCatalogsByItemType(
    itemType: $itemType
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      parentId
      itemType
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ZunoCatalogsByItemTypeQueryVariables,
  APITypes.ZunoCatalogsByItemTypeQuery
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
      catalogId
      entryType
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
      catalogId
      entryType
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
  APITypes.ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQueryVariables,
  APITypes.ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQuery
>;
