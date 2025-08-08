/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateZunoCatalogInput = {
  id?: string | null,
  parentId?: string | null,
  itemType: CatalogItemTypeValues,
  timestamp?: string | null,
  metadata?: CatalogMetadataObjectInput | null,
};

export enum CatalogItemTypeValues {
  COURSE = "COURSE",
  QUIZ = "QUIZ",
  LESSON = "LESSON",
  COACH = "COACH",
  ACHIEVEMENT = "ACHIEVEMENT",
}


export type CatalogMetadataObjectInput = {
  course?: CourseObjectInput | null,
  quiz?: QuizObjectInput | null,
  lesson?: LessonObjectInput | null,
  coach?: CoachObjectInput | null,
  achievement?: AchievementObjectInput | null,
};

export type CourseObjectInput = {
  title: string,
  category: CourseCategoryValues,
  difficultyLevel: DifficultyLevelValues,
  description: string,
  extraLessonIds?: Array< string | null > | null,
};

export enum CourseCategoryValues {
  MATH = "MATH",
  SCIENCE = "SCIENCE",
  LANGUAGE = "LANGUAGE",
  HISTORY = "HISTORY",
  TECHNOLOGY = "TECHNOLOGY",
  ART = "ART",
  MUSIC = "MUSIC",
  BUSINESS = "BUSINESS",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}


export enum DifficultyLevelValues {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}


export type QuizObjectInput = {
  courseId?: string | null,
  lessonId?: string | null,
  questionText?: string | null,
  questionType?: string | null,
  possibilities?: Array< QuizPossibilityObjectInput > | null,
  rightAnswerCount?: number | null,
};

export type QuizPossibilityObjectInput = {
  text: string,
  isCorrect?: boolean | null,
  imageUrl?: string | null,
  audioUrl?: string | null,
};

export type LessonObjectInput = {
  courseId?: string | null,
  title?: string | null,
  lessonOrder?: number | null,
  lessonType?: LessonTypeValues | null,
  extraQuizIds?: Array< string | null > | null,
};

export enum LessonTypeValues {
  VIDEO = "VIDEO",
  READING = "READING",
  PRACTICE = "PRACTICE",
  QUIZ = "QUIZ",
  DISCUSSION = "DISCUSSION",
  PROJECT = "PROJECT",
  ASSIGNMENT = "ASSIGNMENT",
  SUMMARY = "SUMMARY",
  LIVE = "LIVE",
  OTHER = "OTHER",
  GAME = "GAME",
  TEXT = "TEXT",
}


export type CoachObjectInput = {
  coachName?: CoachNameValues | null,
  displayName?: string | null,
  avatarUrl?: string | null,
  bio?: string | null,
};

export enum CoachNameValues {
  ELIA = "ELIA",
  SKIPPY = "SKIPPY",
  LUPA = "LUPA",
  POLPO = "POLPO",
}


export type AchievementObjectInput = {
  name?: string | null,
  requirementType?: RequirementTypeValues | null,
  xpReward?: number | null,
  badgeIcon?: string | null,
};

export enum RequirementTypeValues {
  COMPLETE_LESSON = "COMPLETE_LESSON",
  COMPLETE_COURSE = "COMPLETE_COURSE",
  PERFECT_SCORE = "PERFECT_SCORE",
  DAILY_STREAK = "DAILY_STREAK",
  WEEKLY_STREAK = "WEEKLY_STREAK",
  MASTERY_LEVEL = "MASTERY_LEVEL",
  PARTICIPATION = "PARTICIPATION",
  FIRST_LOGIN = "FIRST_LOGIN",
  REFER_A_FRIEND = "REFER_A_FRIEND",
  CUSTOM = "CUSTOM",
}


export type ModelZunoCatalogConditionInput = {
  parentId?: ModelIDInput | null,
  itemType?: ModelCatalogItemTypeValuesInput | null,
  timestamp?: ModelStringInput | null,
  and?: Array< ModelZunoCatalogConditionInput | null > | null,
  or?: Array< ModelZunoCatalogConditionInput | null > | null,
  not?: ModelZunoCatalogConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelCatalogItemTypeValuesInput = {
  eq?: CatalogItemTypeValues | null,
  ne?: CatalogItemTypeValues | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ZunoCatalog = {
  __typename: "ZunoCatalog",
  id: string,
  parentId?: string | null,
  itemType: CatalogItemTypeValues,
  timestamp?: string | null,
  metadata?: CatalogMetadataObject | null,
  facts?: ModelZunoEntryConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type CatalogMetadataObject = {
  __typename: "CatalogMetadataObject",
  course?: CourseObject | null,
  quiz?: QuizObject | null,
  lesson?: LessonObject | null,
  coach?: CoachObject | null,
  achievement?: AchievementObject | null,
};

export type CourseObject = {
  __typename: "CourseObject",
  title: string,
  category: CourseCategoryValues,
  difficultyLevel: DifficultyLevelValues,
  description: string,
  extraLessonIds?: Array< string | null > | null,
};

export type QuizObject = {
  __typename: "QuizObject",
  courseId?: string | null,
  lessonId?: string | null,
  questionText?: string | null,
  questionType?: string | null,
  possibilities?:  Array<QuizPossibilityObject > | null,
  rightAnswerCount?: number | null,
};

export type QuizPossibilityObject = {
  __typename: "QuizPossibilityObject",
  text: string,
  isCorrect?: boolean | null,
  imageUrl?: string | null,
  audioUrl?: string | null,
};

export type LessonObject = {
  __typename: "LessonObject",
  courseId?: string | null,
  title?: string | null,
  lessonOrder?: number | null,
  lessonType?: LessonTypeValues | null,
  extraQuizIds?: Array< string | null > | null,
};

export type CoachObject = {
  __typename: "CoachObject",
  coachName?: CoachNameValues | null,
  displayName?: string | null,
  avatarUrl?: string | null,
  bio?: string | null,
};

export type AchievementObject = {
  __typename: "AchievementObject",
  name?: string | null,
  requirementType?: RequirementTypeValues | null,
  xpReward?: number | null,
  badgeIcon?: string | null,
};

export type ModelZunoEntryConnection = {
  __typename: "ModelZunoEntryConnection",
  items:  Array<ZunoEntry | null >,
  nextToken?: string | null,
};

export type ZunoEntry = {
  __typename: "ZunoEntry",
  id: string,
  userId?: string | null,
  entryType?: ZunoEntryTypeValues | null,
  catalogId?: string | null,
  catalog?: ZunoCatalog | null,
  groupId?: string | null,
  group?: ZunoGroup | null,
  timestamp?: string | null,
  metadata?: EntryMetadataObject | null,
  createdAt: string,
  updatedAt: string,
  zunoCatalogFactsId?: string | null,
  zunoGroupFactsId?: string | null,
};

export enum ZunoEntryTypeValues {
  USER_PROGRESS = "USER_PROGRESS",
  ASSESSMENT_RESULT = "ASSESSMENT_RESULT",
  ASSESSMENT_DEFINITION = "ASSESSMENT_DEFINITION",
  LESSON_COMPLETION = "LESSON_COMPLETION",
  QUIZ_ATTEMPT = "QUIZ_ATTEMPT",
  COURSE_COMPLETION = "COURSE_COMPLETION",
  GROUP_ACTIVITY = "GROUP_ACTIVITY",
  REVIEW = "REVIEW",
  LEADERBOARD_ENTRY = "LEADERBOARD_ENTRY",
  SESSION_LOG = "SESSION_LOG",
  ACHIEVEMENT_UNLOCKED = "ACHIEVEMENT_UNLOCKED",
  SCHEDULED_EVENT = "SCHEDULED_EVENT",
  KNOWLEDGE_GAP = "KNOWLEDGE_GAP",
  COACH_INTERACTION = "COACH_INTERACTION",
  LEARNING_ANALYTICS = "LEARNING_ANALYTICS",
  OTHER = "OTHER",
}


export type ZunoGroup = {
  __typename: "ZunoGroup",
  id: string,
  name?: string | null,
  subjectArea?: string | null,
  createdBy?: string | null,
  members?: Array< string > | null,
  facts?: ModelZunoEntryConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type EntryMetadataObject = {
  __typename: "EntryMetadataObject",
  userProfile?: UserProfileObject | null,
  assessmentResult?: AssessmentResultObject | null,
  assessmentDefinition?: AssessmentTemplateObject | null,
  userProgress?: UserProgressObject | null,
  userActivity?: UserActivityObject | null,
  knowledgeGap?: KnowledgeGapObject | null,
  coachInteraction?: CoachInteractionObject | null,
  scheduledReview?: ScheduledReviewObject | null,
  userLearningAnalytics?: LearningAnalyticsObject | null,
  groupActivity?: GroupActivityObject | null,
};

export type UserProfileObject = {
  __typename: "UserProfileObject",
  email: string,
  username: string,
  fullName?: string | null,
  subscriptionTier?: string | null,
  totalXp: number,
  currentLevel: number,
  coachName?: CoachNameValues | null,
  onboardingCompleted: boolean,
};

export type AssessmentResultObject = {
  __typename: "AssessmentResultObject",
  score?: number | null,
  passed?: boolean | null,
};

export type AssessmentTemplateObject = {
  __typename: "AssessmentTemplateObject",
  title: string,
  description?: string | null,
  difficulty?: DifficultyLevelValues | null,
  passingScore?: number | null,
  totalScore?: number | null,
  estimatedDuration?: number | null,
  gradingMode?: AssessmentGradingModeValues | null,
  objectives?: Array< string | null > | null,
  randomizeQuestions?: boolean | null,
  allowRetry?: boolean | null,
  maxAttempts?: number | null,
  resourceItems?:  Array<CatalogResourceItemObject > | null,
};

export enum AssessmentGradingModeValues {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
  MIXED = "MIXED",
}


export type CatalogResourceItemObject = {
  __typename: "CatalogResourceItemObject",
  id: string,
  type: CatalogResourceTypeValues,
};

export enum CatalogResourceTypeValues {
  COURSE = "COURSE",
  LESSON = "LESSON",
  QUIZ = "QUIZ",
}


export type UserProgressObject = {
  __typename: "UserProgressObject",
  totalXpEarned?: number | null,
  completedLessons?: number | null,
  currentStreak?: number | null,
  masteryLevel?: string | null,
};

export type UserActivityObject = {
  __typename: "UserActivityObject",
  activityDate?: string | null,
  activityType?: string | null,
  description?: string | null,
};

export type KnowledgeGapObject = {
  __typename: "KnowledgeGapObject",
  subjectArea?: string | null,
  conceptName?: string | null,
  severity?: string | null,
};

export type CoachInteractionObject = {
  __typename: "CoachInteractionObject",
  interactionType?: string | null,
  notes?: string | null,
  occurredAt?: string | null,
};

export type ScheduledReviewObject = {
  __typename: "ScheduledReviewObject",
  contentId?: string | null,
  nextReviewDate?: string | null,
  repetitionCount?: number | null,
};

export type LearningAnalyticsObject = {
  __typename: "LearningAnalyticsObject",
  metricName?: string | null,
  metricValue?: number | null,
  recordedAt?: string | null,
};

export type GroupActivityObject = {
  __typename: "GroupActivityObject",
  activityId?: string | null,
  groupId?: string | null,
  activityType?: GroupActivityTypeValues | null,
  title?: string | null,
  description?: string | null,
  startedAt?: string | null,
  endedAt?: string | null,
  participants?: Array< string | null > | null,
};

export enum GroupActivityTypeValues {
  SESSION = "SESSION",
  DISCUSSION = "DISCUSSION",
  CHALLENGE = "CHALLENGE",
  VOTE = "VOTE",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  MEETING = "MEETING",
  OTHER = "OTHER",
}


export type CreateZunoEntryInput = {
  id?: string | null,
  userId?: string | null,
  entryType?: ZunoEntryTypeValues | null,
  catalogId?: string | null,
  groupId?: string | null,
  timestamp?: string | null,
  metadata?: EntryMetadataObjectInput | null,
  zunoCatalogFactsId?: string | null,
  zunoGroupFactsId?: string | null,
};

export type EntryMetadataObjectInput = {
  userProfile?: UserProfileObjectInput | null,
  assessmentResult?: AssessmentResultObjectInput | null,
  assessmentDefinition?: AssessmentTemplateObjectInput | null,
  userProgress?: UserProgressObjectInput | null,
  userActivity?: UserActivityObjectInput | null,
  knowledgeGap?: KnowledgeGapObjectInput | null,
  coachInteraction?: CoachInteractionObjectInput | null,
  scheduledReview?: ScheduledReviewObjectInput | null,
  userLearningAnalytics?: LearningAnalyticsObjectInput | null,
  groupActivity?: GroupActivityObjectInput | null,
};

export type UserProfileObjectInput = {
  email: string,
  username: string,
  fullName?: string | null,
  subscriptionTier?: string | null,
  totalXp: number,
  currentLevel: number,
  coachName?: CoachNameValues | null,
  onboardingCompleted: boolean,
};

export type AssessmentResultObjectInput = {
  score?: number | null,
  passed?: boolean | null,
};

export type AssessmentTemplateObjectInput = {
  title: string,
  description?: string | null,
  difficulty?: DifficultyLevelValues | null,
  passingScore?: number | null,
  totalScore?: number | null,
  estimatedDuration?: number | null,
  gradingMode?: AssessmentGradingModeValues | null,
  objectives?: Array< string | null > | null,
  randomizeQuestions?: boolean | null,
  allowRetry?: boolean | null,
  maxAttempts?: number | null,
  resourceItems?: Array< CatalogResourceItemObjectInput > | null,
};

export type CatalogResourceItemObjectInput = {
  id: string,
  type: CatalogResourceTypeValues,
};

export type UserProgressObjectInput = {
  totalXpEarned?: number | null,
  completedLessons?: number | null,
  currentStreak?: number | null,
  masteryLevel?: string | null,
};

export type UserActivityObjectInput = {
  activityDate?: string | null,
  activityType?: string | null,
  description?: string | null,
};

export type KnowledgeGapObjectInput = {
  subjectArea?: string | null,
  conceptName?: string | null,
  severity?: string | null,
};

export type CoachInteractionObjectInput = {
  interactionType?: string | null,
  notes?: string | null,
  occurredAt?: string | null,
};

export type ScheduledReviewObjectInput = {
  contentId?: string | null,
  nextReviewDate?: string | null,
  repetitionCount?: number | null,
};

export type LearningAnalyticsObjectInput = {
  metricName?: string | null,
  metricValue?: number | null,
  recordedAt?: string | null,
};

export type GroupActivityObjectInput = {
  activityId?: string | null,
  groupId?: string | null,
  activityType?: GroupActivityTypeValues | null,
  title?: string | null,
  description?: string | null,
  startedAt?: string | null,
  endedAt?: string | null,
  participants?: Array< string | null > | null,
};

export type ModelZunoEntryConditionInput = {
  userId?: ModelIDInput | null,
  entryType?: ModelZunoEntryTypeValuesInput | null,
  catalogId?: ModelIDInput | null,
  groupId?: ModelIDInput | null,
  timestamp?: ModelStringInput | null,
  and?: Array< ModelZunoEntryConditionInput | null > | null,
  or?: Array< ModelZunoEntryConditionInput | null > | null,
  not?: ModelZunoEntryConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  zunoCatalogFactsId?: ModelIDInput | null,
  zunoGroupFactsId?: ModelIDInput | null,
};

export type ModelZunoEntryTypeValuesInput = {
  eq?: ZunoEntryTypeValues | null,
  ne?: ZunoEntryTypeValues | null,
};

export type UpdateZunoEntryInput = {
  id: string,
  userId?: string | null,
  entryType?: ZunoEntryTypeValues | null,
  catalogId?: string | null,
  groupId?: string | null,
  timestamp?: string | null,
  metadata?: EntryMetadataObjectInput | null,
  zunoCatalogFactsId?: string | null,
  zunoGroupFactsId?: string | null,
};

export type ModelZunoCatalogFilterInput = {
  id?: ModelIDInput | null,
  parentId?: ModelIDInput | null,
  itemType?: ModelCatalogItemTypeValuesInput | null,
  timestamp?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelZunoCatalogFilterInput | null > | null,
  or?: Array< ModelZunoCatalogFilterInput | null > | null,
  not?: ModelZunoCatalogFilterInput | null,
};

export type ModelZunoCatalogConnection = {
  __typename: "ModelZunoCatalogConnection",
  items:  Array<ZunoCatalog | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelZunoCatalogByParentCompositeKeyConditionInput = {
  eq?: ModelZunoCatalogByParentCompositeKeyInput | null,
  le?: ModelZunoCatalogByParentCompositeKeyInput | null,
  lt?: ModelZunoCatalogByParentCompositeKeyInput | null,
  ge?: ModelZunoCatalogByParentCompositeKeyInput | null,
  gt?: ModelZunoCatalogByParentCompositeKeyInput | null,
  between?: Array< ModelZunoCatalogByParentCompositeKeyInput | null > | null,
  beginsWith?: ModelZunoCatalogByParentCompositeKeyInput | null,
};

export type ModelZunoCatalogByParentCompositeKeyInput = {
  itemType?: CatalogItemTypeValues | null,
  timestamp?: string | null,
};

export type ModelZunoEntryByUserCompositeKeyConditionInput = {
  eq?: ModelZunoEntryByUserCompositeKeyInput | null,
  le?: ModelZunoEntryByUserCompositeKeyInput | null,
  lt?: ModelZunoEntryByUserCompositeKeyInput | null,
  ge?: ModelZunoEntryByUserCompositeKeyInput | null,
  gt?: ModelZunoEntryByUserCompositeKeyInput | null,
  between?: Array< ModelZunoEntryByUserCompositeKeyInput | null > | null,
  beginsWith?: ModelZunoEntryByUserCompositeKeyInput | null,
};

export type ModelZunoEntryByUserCompositeKeyInput = {
  entryType?: ZunoEntryTypeValues | null,
  timestamp?: string | null,
};

export type ModelZunoEntryFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  entryType?: ModelZunoEntryTypeValuesInput | null,
  catalogId?: ModelIDInput | null,
  groupId?: ModelIDInput | null,
  timestamp?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelZunoEntryFilterInput | null > | null,
  or?: Array< ModelZunoEntryFilterInput | null > | null,
  not?: ModelZunoEntryFilterInput | null,
  zunoCatalogFactsId?: ModelIDInput | null,
  zunoGroupFactsId?: ModelIDInput | null,
};

export type DeleteZunoEntryInput = {
  id: string,
};

export type UpdateZunoCatalogInput = {
  id: string,
  parentId?: string | null,
  itemType?: CatalogItemTypeValues | null,
  timestamp?: string | null,
  metadata?: CatalogMetadataObjectInput | null,
};

export type DeleteZunoCatalogInput = {
  id: string,
};

export type CreateZunoGroupInput = {
  id?: string | null,
  name?: string | null,
  subjectArea?: string | null,
  createdBy?: string | null,
  members?: Array< string > | null,
};

export type ModelZunoGroupConditionInput = {
  name?: ModelStringInput | null,
  subjectArea?: ModelStringInput | null,
  createdBy?: ModelIDInput | null,
  members?: ModelIDInput | null,
  and?: Array< ModelZunoGroupConditionInput | null > | null,
  or?: Array< ModelZunoGroupConditionInput | null > | null,
  not?: ModelZunoGroupConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateZunoGroupInput = {
  id: string,
  name?: string | null,
  subjectArea?: string | null,
  createdBy?: string | null,
  members?: Array< string > | null,
};

export type DeleteZunoGroupInput = {
  id: string,
};

export type ModelZunoGroupFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  subjectArea?: ModelStringInput | null,
  createdBy?: ModelIDInput | null,
  members?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelZunoGroupFilterInput | null > | null,
  or?: Array< ModelZunoGroupFilterInput | null > | null,
  not?: ModelZunoGroupFilterInput | null,
};

export type ModelZunoGroupConnection = {
  __typename: "ModelZunoGroupConnection",
  items:  Array<ZunoGroup | null >,
  nextToken?: string | null,
};

export type ModelZunoEntryByCatalogCompositeKeyConditionInput = {
  eq?: ModelZunoEntryByCatalogCompositeKeyInput | null,
  le?: ModelZunoEntryByCatalogCompositeKeyInput | null,
  lt?: ModelZunoEntryByCatalogCompositeKeyInput | null,
  ge?: ModelZunoEntryByCatalogCompositeKeyInput | null,
  gt?: ModelZunoEntryByCatalogCompositeKeyInput | null,
  between?: Array< ModelZunoEntryByCatalogCompositeKeyInput | null > | null,
  beginsWith?: ModelZunoEntryByCatalogCompositeKeyInput | null,
};

export type ModelZunoEntryByCatalogCompositeKeyInput = {
  entryType?: ZunoEntryTypeValues | null,
  timestamp?: string | null,
};

export type ModelZunoEntryByGroupCompositeKeyConditionInput = {
  eq?: ModelZunoEntryByGroupCompositeKeyInput | null,
  le?: ModelZunoEntryByGroupCompositeKeyInput | null,
  lt?: ModelZunoEntryByGroupCompositeKeyInput | null,
  ge?: ModelZunoEntryByGroupCompositeKeyInput | null,
  gt?: ModelZunoEntryByGroupCompositeKeyInput | null,
  between?: Array< ModelZunoEntryByGroupCompositeKeyInput | null > | null,
  beginsWith?: ModelZunoEntryByGroupCompositeKeyInput | null,
};

export type ModelZunoEntryByGroupCompositeKeyInput = {
  entryType?: ZunoEntryTypeValues | null,
  timestamp?: string | null,
};

export type ModelSubscriptionZunoEntryFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  entryType?: ModelSubscriptionStringInput | null,
  catalogId?: ModelSubscriptionIDInput | null,
  groupId?: ModelSubscriptionIDInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionZunoEntryFilterInput | null > | null,
  or?: Array< ModelSubscriptionZunoEntryFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionZunoCatalogFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  parentId?: ModelSubscriptionIDInput | null,
  itemType?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionZunoCatalogFilterInput | null > | null,
  or?: Array< ModelSubscriptionZunoCatalogFilterInput | null > | null,
  zunoCatalogFactsId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionZunoGroupFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  subjectArea?: ModelSubscriptionStringInput | null,
  createdBy?: ModelSubscriptionIDInput | null,
  members?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionZunoGroupFilterInput | null > | null,
  or?: Array< ModelSubscriptionZunoGroupFilterInput | null > | null,
  zunoGroupFactsId?: ModelSubscriptionIDInput | null,
};

export type CreateZunoCatalogWithMetadataMutationVariables = {
  input: CreateZunoCatalogInput,
  condition?: ModelZunoCatalogConditionInput | null,
};

export type CreateZunoCatalogWithMetadataMutation = {
  createZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
      course?:  {
        __typename: "CourseObject",
        title: string,
        category: CourseCategoryValues,
        difficultyLevel: DifficultyLevelValues,
      } | null,
      quiz?:  {
        __typename: "QuizObject",
        courseId?: string | null,
        lessonId?: string | null,
        questionText?: string | null,
        questionType?: string | null,
      } | null,
      lesson?:  {
        __typename: "LessonObject",
        courseId?: string | null,
        title?: string | null,
        lessonOrder?: number | null,
        lessonType?: LessonTypeValues | null,
      } | null,
      coach?:  {
        __typename: "CoachObject",
        coachName?: CoachNameValues | null,
        displayName?: string | null,
        avatarUrl?: string | null,
        bio?: string | null,
      } | null,
      achievement?:  {
        __typename: "AchievementObject",
        name?: string | null,
        requirementType?: RequirementTypeValues | null,
        xpReward?: number | null,
        badgeIcon?: string | null,
      } | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateZunoEntryWithMetadataMutationVariables = {
  input: CreateZunoEntryInput,
  condition?: ModelZunoEntryConditionInput | null,
};

export type CreateZunoEntryWithMetadataMutation = {
  createZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    catalogId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
      userProfile?:  {
        __typename: "UserProfileObject",
        email: string,
        username: string,
        fullName?: string | null,
        subscriptionTier?: string | null,
        totalXp: number,
        currentLevel: number,
        coachName?: CoachNameValues | null,
        onboardingCompleted: boolean,
      } | null,
      assessmentResult?:  {
        __typename: "AssessmentResultObject",
        score?: number | null,
        passed?: boolean | null,
      } | null,
      userProgress?:  {
        __typename: "UserProgressObject",
        totalXpEarned?: number | null,
        completedLessons?: number | null,
        currentStreak?: number | null,
        masteryLevel?: string | null,
      } | null,
      userActivity?:  {
        __typename: "UserActivityObject",
        activityDate?: string | null,
        activityType?: string | null,
        description?: string | null,
      } | null,
      knowledgeGap?:  {
        __typename: "KnowledgeGapObject",
        subjectArea?: string | null,
        conceptName?: string | null,
        severity?: string | null,
      } | null,
      coachInteraction?:  {
        __typename: "CoachInteractionObject",
        interactionType?: string | null,
        notes?: string | null,
        occurredAt?: string | null,
      } | null,
      scheduledReview?:  {
        __typename: "ScheduledReviewObject",
        contentId?: string | null,
        nextReviewDate?: string | null,
        repetitionCount?: number | null,
      } | null,
      userLearningAnalytics?:  {
        __typename: "LearningAnalyticsObject",
        metricName?: string | null,
        metricValue?: number | null,
        recordedAt?: string | null,
      } | null,
      groupActivity?:  {
        __typename: "GroupActivityObject",
        activityId?: string | null,
        groupId?: string | null,
        activityType?: GroupActivityTypeValues | null,
        title?: string | null,
        description?: string | null,
        startedAt?: string | null,
        endedAt?: string | null,
        participants?: Array< string | null > | null,
      } | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateZunoEntryWithMetadataMutationVariables = {
  input: UpdateZunoEntryInput,
  condition?: ModelZunoEntryConditionInput | null,
};

export type UpdateZunoEntryWithMetadataMutation = {
  updateZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    catalogId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
      userProfile?:  {
        __typename: "UserProfileObject",
        email: string,
        username: string,
        fullName?: string | null,
        subscriptionTier?: string | null,
        totalXp: number,
        currentLevel: number,
        coachName?: CoachNameValues | null,
        onboardingCompleted: boolean,
      } | null,
      assessmentResult?:  {
        __typename: "AssessmentResultObject",
        score?: number | null,
        passed?: boolean | null,
      } | null,
      userProgress?:  {
        __typename: "UserProgressObject",
        totalXpEarned?: number | null,
        completedLessons?: number | null,
        currentStreak?: number | null,
        masteryLevel?: string | null,
      } | null,
      userActivity?:  {
        __typename: "UserActivityObject",
        activityDate?: string | null,
        activityType?: string | null,
        description?: string | null,
      } | null,
      knowledgeGap?:  {
        __typename: "KnowledgeGapObject",
        subjectArea?: string | null,
        conceptName?: string | null,
        severity?: string | null,
      } | null,
      coachInteraction?:  {
        __typename: "CoachInteractionObject",
        interactionType?: string | null,
        notes?: string | null,
        occurredAt?: string | null,
      } | null,
      scheduledReview?:  {
        __typename: "ScheduledReviewObject",
        contentId?: string | null,
        nextReviewDate?: string | null,
        repetitionCount?: number | null,
      } | null,
      userLearningAnalytics?:  {
        __typename: "LearningAnalyticsObject",
        metricName?: string | null,
        metricValue?: number | null,
        recordedAt?: string | null,
      } | null,
      groupActivity?:  {
        __typename: "GroupActivityObject",
        activityId?: string | null,
        groupId?: string | null,
        activityType?: GroupActivityTypeValues | null,
        title?: string | null,
        description?: string | null,
        startedAt?: string | null,
        endedAt?: string | null,
        participants?: Array< string | null > | null,
      } | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetZunoCatalogWithMetadataQueryVariables = {
  id: string,
};

export type GetZunoCatalogWithMetadataQuery = {
  getZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
      course?:  {
        __typename: "CourseObject",
        title: string,
        category: CourseCategoryValues,
        difficultyLevel: DifficultyLevelValues,
      } | null,
      quiz?:  {
        __typename: "QuizObject",
        courseId?: string | null,
        lessonId?: string | null,
        questionText?: string | null,
        questionType?: string | null,
      } | null,
      lesson?:  {
        __typename: "LessonObject",
        courseId?: string | null,
        title?: string | null,
        lessonOrder?: number | null,
        lessonType?: LessonTypeValues | null,
      } | null,
      coach?:  {
        __typename: "CoachObject",
        coachName?: CoachNameValues | null,
        displayName?: string | null,
        avatarUrl?: string | null,
        bio?: string | null,
      } | null,
      achievement?:  {
        __typename: "AchievementObject",
        name?: string | null,
        requirementType?: RequirementTypeValues | null,
        xpReward?: number | null,
        badgeIcon?: string | null,
      } | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListZunoCatalogsWithMetadataQueryVariables = {
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListZunoCatalogsWithMetadataQuery = {
  listZunoCatalogs?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      metadata?:  {
        __typename: "CatalogMetadataObject",
        course?:  {
          __typename: "CourseObject",
          title: string,
          category: CourseCategoryValues,
          difficultyLevel: DifficultyLevelValues,
        } | null,
        quiz?:  {
          __typename: "QuizObject",
          courseId?: string | null,
          lessonId?: string | null,
          questionText?: string | null,
          questionType?: string | null,
        } | null,
        lesson?:  {
          __typename: "LessonObject",
          courseId?: string | null,
          title?: string | null,
          lessonOrder?: number | null,
          lessonType?: LessonTypeValues | null,
        } | null,
        coach?:  {
          __typename: "CoachObject",
          coachName?: CoachNameValues | null,
          displayName?: string | null,
          avatarUrl?: string | null,
          bio?: string | null,
        } | null,
        achievement?:  {
          __typename: "AchievementObject",
          name?: string | null,
          requirementType?: RequirementTypeValues | null,
          xpReward?: number | null,
          badgeIcon?: string | null,
        } | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoCatalogsByItemTypeWithMetadataQueryVariables = {
  itemType: CatalogItemTypeValues,
  timestamp?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoCatalogsByItemTypeWithMetadataQuery = {
  zunoCatalogsByItemTypeAndTimestamp?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      metadata?:  {
        __typename: "CatalogMetadataObject",
        course?:  {
          __typename: "CourseObject",
          title: string,
          category: CourseCategoryValues,
          difficultyLevel: DifficultyLevelValues,
        } | null,
        quiz?:  {
          __typename: "QuizObject",
          courseId?: string | null,
          lessonId?: string | null,
          questionText?: string | null,
          questionType?: string | null,
        } | null,
        lesson?:  {
          __typename: "LessonObject",
          courseId?: string | null,
          title?: string | null,
          lessonOrder?: number | null,
          lessonType?: LessonTypeValues | null,
        } | null,
        coach?:  {
          __typename: "CoachObject",
          coachName?: CoachNameValues | null,
          displayName?: string | null,
          avatarUrl?: string | null,
          bio?: string | null,
        } | null,
        achievement?:  {
          __typename: "AchievementObject",
          name?: string | null,
          requirementType?: RequirementTypeValues | null,
          xpReward?: number | null,
          badgeIcon?: string | null,
        } | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoCatalogsByParentWithMetadataQueryVariables = {
  parentId: string,
  itemTypeTimestamp?: ModelZunoCatalogByParentCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoCatalogsByParentWithMetadataQuery = {
  zunoCatalogsByParentIdAndItemTypeAndTimestamp?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      metadata?:  {
        __typename: "CatalogMetadataObject",
        course?:  {
          __typename: "CourseObject",
          title: string,
          category: CourseCategoryValues,
          difficultyLevel: DifficultyLevelValues,
        } | null,
        quiz?:  {
          __typename: "QuizObject",
          courseId?: string | null,
          lessonId?: string | null,
          questionText?: string | null,
          questionType?: string | null,
        } | null,
        lesson?:  {
          __typename: "LessonObject",
          courseId?: string | null,
          title?: string | null,
          lessonOrder?: number | null,
          lessonType?: LessonTypeValues | null,
        } | null,
        coach?:  {
          __typename: "CoachObject",
          coachName?: CoachNameValues | null,
          displayName?: string | null,
          avatarUrl?: string | null,
          bio?: string | null,
        } | null,
        achievement?:  {
          __typename: "AchievementObject",
          name?: string | null,
          requirementType?: RequirementTypeValues | null,
          xpReward?: number | null,
          badgeIcon?: string | null,
        } | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetZunoEntryWithMetadataQueryVariables = {
  id: string,
};

export type GetZunoEntryWithMetadataQuery = {
  getZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    groupId?: string | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
      userProfile?:  {
        __typename: "UserProfileObject",
        email: string,
        username: string,
        fullName?: string | null,
        subscriptionTier?: string | null,
        totalXp: number,
        currentLevel: number,
        coachName?: CoachNameValues | null,
        onboardingCompleted: boolean,
      } | null,
      assessmentResult?:  {
        __typename: "AssessmentResultObject",
        score?: number | null,
        passed?: boolean | null,
      } | null,
      userProgress?:  {
        __typename: "UserProgressObject",
        totalXpEarned?: number | null,
        completedLessons?: number | null,
        currentStreak?: number | null,
        masteryLevel?: string | null,
      } | null,
      userActivity?:  {
        __typename: "UserActivityObject",
        activityDate?: string | null,
        activityType?: string | null,
        description?: string | null,
      } | null,
      knowledgeGap?:  {
        __typename: "KnowledgeGapObject",
        subjectArea?: string | null,
        conceptName?: string | null,
        severity?: string | null,
      } | null,
      coachInteraction?:  {
        __typename: "CoachInteractionObject",
        interactionType?: string | null,
        notes?: string | null,
        occurredAt?: string | null,
      } | null,
      scheduledReview?:  {
        __typename: "ScheduledReviewObject",
        contentId?: string | null,
        nextReviewDate?: string | null,
        repetitionCount?: number | null,
      } | null,
      userLearningAnalytics?:  {
        __typename: "LearningAnalyticsObject",
        metricName?: string | null,
        metricValue?: number | null,
        recordedAt?: string | null,
      } | null,
      groupActivity?:  {
        __typename: "GroupActivityObject",
        activityId?: string | null,
        groupId?: string | null,
        activityType?: GroupActivityTypeValues | null,
        title?: string | null,
        description?: string | null,
        startedAt?: string | null,
        endedAt?: string | null,
        participants?: Array< string | null > | null,
      } | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ZunoEntriesByUserWithMetadataQueryVariables = {
  userId: string,
  entryTypeTimestamp?: ModelZunoEntryByUserCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoEntriesByUserWithMetadataQuery = {
  zunoEntriesByUserIdAndEntryTypeAndTimestamp?:  {
    __typename: "ModelZunoEntryConnection",
    items:  Array< {
      __typename: "ZunoEntry",
      id: string,
      userId?: string | null,
      entryType?: ZunoEntryTypeValues | null,
      catalogId?: string | null,
      groupId?: string | null,
      timestamp?: string | null,
      metadata?:  {
        __typename: "EntryMetadataObject",
        userProfile?:  {
          __typename: "UserProfileObject",
          email: string,
          username: string,
          fullName?: string | null,
          subscriptionTier?: string | null,
          totalXp: number,
          currentLevel: number,
          coachName?: CoachNameValues | null,
          onboardingCompleted: boolean,
        } | null,
        assessmentResult?:  {
          __typename: "AssessmentResultObject",
          score?: number | null,
          passed?: boolean | null,
        } | null,
        userProgress?:  {
          __typename: "UserProgressObject",
          totalXpEarned?: number | null,
          completedLessons?: number | null,
          currentStreak?: number | null,
          masteryLevel?: string | null,
        } | null,
        userActivity?:  {
          __typename: "UserActivityObject",
          activityDate?: string | null,
          activityType?: string | null,
          description?: string | null,
        } | null,
        knowledgeGap?:  {
          __typename: "KnowledgeGapObject",
          subjectArea?: string | null,
          conceptName?: string | null,
          severity?: string | null,
        } | null,
        coachInteraction?:  {
          __typename: "CoachInteractionObject",
          interactionType?: string | null,
          notes?: string | null,
          occurredAt?: string | null,
        } | null,
        scheduledReview?:  {
          __typename: "ScheduledReviewObject",
          contentId?: string | null,
          nextReviewDate?: string | null,
          repetitionCount?: number | null,
        } | null,
        userLearningAnalytics?:  {
          __typename: "LearningAnalyticsObject",
          metricName?: string | null,
          metricValue?: number | null,
          recordedAt?: string | null,
        } | null,
        groupActivity?:  {
          __typename: "GroupActivityObject",
          activityId?: string | null,
          groupId?: string | null,
          activityType?: GroupActivityTypeValues | null,
          title?: string | null,
          description?: string | null,
          startedAt?: string | null,
          endedAt?: string | null,
          participants?: Array< string | null > | null,
        } | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateZunoEntryMutationVariables = {
  input: CreateZunoEntryInput,
  condition?: ModelZunoEntryConditionInput | null,
};

export type CreateZunoEntryMutation = {
  createZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type UpdateZunoEntryMutationVariables = {
  input: UpdateZunoEntryInput,
  condition?: ModelZunoEntryConditionInput | null,
};

export type UpdateZunoEntryMutation = {
  updateZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type DeleteZunoEntryMutationVariables = {
  input: DeleteZunoEntryInput,
  condition?: ModelZunoEntryConditionInput | null,
};

export type DeleteZunoEntryMutation = {
  deleteZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type CreateZunoCatalogMutationVariables = {
  input: CreateZunoCatalogInput,
  condition?: ModelZunoCatalogConditionInput | null,
};

export type CreateZunoCatalogMutation = {
  createZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateZunoCatalogMutationVariables = {
  input: UpdateZunoCatalogInput,
  condition?: ModelZunoCatalogConditionInput | null,
};

export type UpdateZunoCatalogMutation = {
  updateZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteZunoCatalogMutationVariables = {
  input: DeleteZunoCatalogInput,
  condition?: ModelZunoCatalogConditionInput | null,
};

export type DeleteZunoCatalogMutation = {
  deleteZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateZunoGroupMutationVariables = {
  input: CreateZunoGroupInput,
  condition?: ModelZunoGroupConditionInput | null,
};

export type CreateZunoGroupMutation = {
  createZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateZunoGroupMutationVariables = {
  input: UpdateZunoGroupInput,
  condition?: ModelZunoGroupConditionInput | null,
};

export type UpdateZunoGroupMutation = {
  updateZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteZunoGroupMutationVariables = {
  input: DeleteZunoGroupInput,
  condition?: ModelZunoGroupConditionInput | null,
};

export type DeleteZunoGroupMutation = {
  deleteZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetZunoEntryQueryVariables = {
  id: string,
};

export type GetZunoEntryQuery = {
  getZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type ListZunoEntriesQueryVariables = {
  filter?: ModelZunoEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListZunoEntriesQuery = {
  listZunoEntries?:  {
    __typename: "ModelZunoEntryConnection",
    items:  Array< {
      __typename: "ZunoEntry",
      id: string,
      userId?: string | null,
      entryType?: ZunoEntryTypeValues | null,
      catalogId?: string | null,
      groupId?: string | null,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
      zunoCatalogFactsId?: string | null,
      zunoGroupFactsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetZunoCatalogQueryVariables = {
  id: string,
};

export type GetZunoCatalogQuery = {
  getZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListZunoCatalogsQueryVariables = {
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListZunoCatalogsQuery = {
  listZunoCatalogs?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetZunoGroupQueryVariables = {
  id: string,
};

export type GetZunoGroupQuery = {
  getZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListZunoGroupsQueryVariables = {
  filter?: ModelZunoGroupFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListZunoGroupsQuery = {
  listZunoGroups?:  {
    __typename: "ModelZunoGroupConnection",
    items:  Array< {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoEntriesByUserIdAndEntryTypeAndTimestampQueryVariables = {
  userId: string,
  entryTypeTimestamp?: ModelZunoEntryByUserCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoEntriesByUserIdAndEntryTypeAndTimestampQuery = {
  zunoEntriesByUserIdAndEntryTypeAndTimestamp?:  {
    __typename: "ModelZunoEntryConnection",
    items:  Array< {
      __typename: "ZunoEntry",
      id: string,
      userId?: string | null,
      entryType?: ZunoEntryTypeValues | null,
      catalogId?: string | null,
      groupId?: string | null,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
      zunoCatalogFactsId?: string | null,
      zunoGroupFactsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQueryVariables = {
  catalogId: string,
  entryTypeTimestamp?: ModelZunoEntryByCatalogCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoEntriesByCatalogIdAndEntryTypeAndTimestampQuery = {
  zunoEntriesByCatalogIdAndEntryTypeAndTimestamp?:  {
    __typename: "ModelZunoEntryConnection",
    items:  Array< {
      __typename: "ZunoEntry",
      id: string,
      userId?: string | null,
      entryType?: ZunoEntryTypeValues | null,
      catalogId?: string | null,
      groupId?: string | null,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
      zunoCatalogFactsId?: string | null,
      zunoGroupFactsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoEntriesByGroupIdAndEntryTypeAndTimestampQueryVariables = {
  groupId: string,
  entryTypeTimestamp?: ModelZunoEntryByGroupCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoEntryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoEntriesByGroupIdAndEntryTypeAndTimestampQuery = {
  zunoEntriesByGroupIdAndEntryTypeAndTimestamp?:  {
    __typename: "ModelZunoEntryConnection",
    items:  Array< {
      __typename: "ZunoEntry",
      id: string,
      userId?: string | null,
      entryType?: ZunoEntryTypeValues | null,
      catalogId?: string | null,
      groupId?: string | null,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
      zunoCatalogFactsId?: string | null,
      zunoGroupFactsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoCatalogsByParentIdAndItemTypeAndTimestampQueryVariables = {
  parentId: string,
  itemTypeTimestamp?: ModelZunoCatalogByParentCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoCatalogsByParentIdAndItemTypeAndTimestampQuery = {
  zunoCatalogsByParentIdAndItemTypeAndTimestamp?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ZunoCatalogsByItemTypeAndTimestampQueryVariables = {
  itemType: CatalogItemTypeValues,
  timestamp?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelZunoCatalogFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ZunoCatalogsByItemTypeAndTimestampQuery = {
  zunoCatalogsByItemTypeAndTimestamp?:  {
    __typename: "ModelZunoCatalogConnection",
    items:  Array< {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateZunoEntrySubscriptionVariables = {
  filter?: ModelSubscriptionZunoEntryFilterInput | null,
};

export type OnCreateZunoEntrySubscription = {
  onCreateZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type OnUpdateZunoEntrySubscriptionVariables = {
  filter?: ModelSubscriptionZunoEntryFilterInput | null,
};

export type OnUpdateZunoEntrySubscription = {
  onUpdateZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type OnDeleteZunoEntrySubscriptionVariables = {
  filter?: ModelSubscriptionZunoEntryFilterInput | null,
};

export type OnDeleteZunoEntrySubscription = {
  onDeleteZunoEntry?:  {
    __typename: "ZunoEntry",
    id: string,
    userId?: string | null,
    entryType?: ZunoEntryTypeValues | null,
    catalogId?: string | null,
    catalog?:  {
      __typename: "ZunoCatalog",
      id: string,
      parentId?: string | null,
      itemType: CatalogItemTypeValues,
      timestamp?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    groupId?: string | null,
    group?:  {
      __typename: "ZunoGroup",
      id: string,
      name?: string | null,
      subjectArea?: string | null,
      createdBy?: string | null,
      members?: Array< string > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    timestamp?: string | null,
    metadata?:  {
      __typename: "EntryMetadataObject",
    } | null,
    createdAt: string,
    updatedAt: string,
    zunoCatalogFactsId?: string | null,
    zunoGroupFactsId?: string | null,
  } | null,
};

export type OnCreateZunoCatalogSubscriptionVariables = {
  filter?: ModelSubscriptionZunoCatalogFilterInput | null,
};

export type OnCreateZunoCatalogSubscription = {
  onCreateZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateZunoCatalogSubscriptionVariables = {
  filter?: ModelSubscriptionZunoCatalogFilterInput | null,
};

export type OnUpdateZunoCatalogSubscription = {
  onUpdateZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteZunoCatalogSubscriptionVariables = {
  filter?: ModelSubscriptionZunoCatalogFilterInput | null,
};

export type OnDeleteZunoCatalogSubscription = {
  onDeleteZunoCatalog?:  {
    __typename: "ZunoCatalog",
    id: string,
    parentId?: string | null,
    itemType: CatalogItemTypeValues,
    timestamp?: string | null,
    metadata?:  {
      __typename: "CatalogMetadataObject",
    } | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateZunoGroupSubscriptionVariables = {
  filter?: ModelSubscriptionZunoGroupFilterInput | null,
};

export type OnCreateZunoGroupSubscription = {
  onCreateZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateZunoGroupSubscriptionVariables = {
  filter?: ModelSubscriptionZunoGroupFilterInput | null,
};

export type OnUpdateZunoGroupSubscription = {
  onUpdateZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteZunoGroupSubscriptionVariables = {
  filter?: ModelSubscriptionZunoGroupFilterInput | null,
};

export type OnDeleteZunoGroupSubscription = {
  onDeleteZunoGroup?:  {
    __typename: "ZunoGroup",
    id: string,
    name?: string | null,
    subjectArea?: string | null,
    createdBy?: string | null,
    members?: Array< string > | null,
    facts?:  {
      __typename: "ModelZunoEntryConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
