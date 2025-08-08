/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  SelectField,
  SwitchField,
  Text,
  TextAreaField,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createZunoItem } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function ZunoItemCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    entityType: "",
    userId: "",
    subject: "",
    contentId: "",
    conceptId: "",
    groupId: "",
    sessionId: "",
    assessmentId: "",
    achievementId: "",
    coachId: "",
    leaderboardType: "",
    scoreUserId: "",
    currentLevel: "",
    experiencePoints: "",
    streakCurrent: "",
    streakLongest: "",
    lastLessonDate: "",
    completedLessons: [],
    masteredConcepts: [],
    inProgressConcepts: [],
    unknownConcepts: [],
    confidenceScores: "",
    averageAccuracy: "",
    learningVelocity: "",
    retentionRate: "",
    engagementScore: "",
    difficultyProgression: [],
    lastUpdated: "",
    contentType: "",
    difficulty: "",
    prerequisites: [],
    learningObjectives: [],
    estimatedDuration: "",
    coachAdaptations: "",
    interactiveElements: "",
    tags: [],
    s3ContentUrl: "",
    nextReviewDate: "",
    interval: "",
    easeFactor: "",
    repetitions: "",
    lastReviewDate: "",
    performanceHistory: [],
    createdBy: "",
    members: [],
    maxMembers: "",
    isActive: false,
    isPublic: false,
    allowChat: false,
    allowVoice: false,
    startTime: "",
    endTime: "",
    participants: "",
    activities: "",
    chatMessages: "",
    assessmentType: "",
    completedAt: "",
    results: "",
    knowledgeGaps: [],
    recommendedFocus: [],
    score: "",
    rank: "",
    timeframe: "",
    displayName: "",
    achievementType: "",
    earnedAt: "",
    title: "",
    description: "",
    badgeIcon: "",
    triggerValue: "",
    achievementCategory: "",
    metadata: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  };
  const [entityType, setEntityType] = React.useState(initialValues.entityType);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [subject, setSubject] = React.useState(initialValues.subject);
  const [contentId, setContentId] = React.useState(initialValues.contentId);
  const [conceptId, setConceptId] = React.useState(initialValues.conceptId);
  const [groupId, setGroupId] = React.useState(initialValues.groupId);
  const [sessionId, setSessionId] = React.useState(initialValues.sessionId);
  const [assessmentId, setAssessmentId] = React.useState(
    initialValues.assessmentId
  );
  const [achievementId, setAchievementId] = React.useState(
    initialValues.achievementId
  );
  const [coachId, setCoachId] = React.useState(initialValues.coachId);
  const [leaderboardType, setLeaderboardType] = React.useState(
    initialValues.leaderboardType
  );
  const [scoreUserId, setScoreUserId] = React.useState(
    initialValues.scoreUserId
  );
  const [currentLevel, setCurrentLevel] = React.useState(
    initialValues.currentLevel
  );
  const [experiencePoints, setExperiencePoints] = React.useState(
    initialValues.experiencePoints
  );
  const [streakCurrent, setStreakCurrent] = React.useState(
    initialValues.streakCurrent
  );
  const [streakLongest, setStreakLongest] = React.useState(
    initialValues.streakLongest
  );
  const [lastLessonDate, setLastLessonDate] = React.useState(
    initialValues.lastLessonDate
  );
  const [completedLessons, setCompletedLessons] = React.useState(
    initialValues.completedLessons
  );
  const [masteredConcepts, setMasteredConcepts] = React.useState(
    initialValues.masteredConcepts
  );
  const [inProgressConcepts, setInProgressConcepts] = React.useState(
    initialValues.inProgressConcepts
  );
  const [unknownConcepts, setUnknownConcepts] = React.useState(
    initialValues.unknownConcepts
  );
  const [confidenceScores, setConfidenceScores] = React.useState(
    initialValues.confidenceScores
  );
  const [averageAccuracy, setAverageAccuracy] = React.useState(
    initialValues.averageAccuracy
  );
  const [learningVelocity, setLearningVelocity] = React.useState(
    initialValues.learningVelocity
  );
  const [retentionRate, setRetentionRate] = React.useState(
    initialValues.retentionRate
  );
  const [engagementScore, setEngagementScore] = React.useState(
    initialValues.engagementScore
  );
  const [difficultyProgression, setDifficultyProgression] = React.useState(
    initialValues.difficultyProgression
  );
  const [lastUpdated, setLastUpdated] = React.useState(
    initialValues.lastUpdated
  );
  const [contentType, setContentType] = React.useState(
    initialValues.contentType
  );
  const [difficulty, setDifficulty] = React.useState(initialValues.difficulty);
  const [prerequisites, setPrerequisites] = React.useState(
    initialValues.prerequisites
  );
  const [learningObjectives, setLearningObjectives] = React.useState(
    initialValues.learningObjectives
  );
  const [estimatedDuration, setEstimatedDuration] = React.useState(
    initialValues.estimatedDuration
  );
  const [coachAdaptations, setCoachAdaptations] = React.useState(
    initialValues.coachAdaptations
  );
  const [interactiveElements, setInteractiveElements] = React.useState(
    initialValues.interactiveElements
  );
  const [tags, setTags] = React.useState(initialValues.tags);
  const [s3ContentUrl, setS3ContentUrl] = React.useState(
    initialValues.s3ContentUrl
  );
  const [nextReviewDate, setNextReviewDate] = React.useState(
    initialValues.nextReviewDate
  );
  const [interval, setInterval] = React.useState(initialValues.interval);
  const [easeFactor, setEaseFactor] = React.useState(initialValues.easeFactor);
  const [repetitions, setRepetitions] = React.useState(
    initialValues.repetitions
  );
  const [lastReviewDate, setLastReviewDate] = React.useState(
    initialValues.lastReviewDate
  );
  const [performanceHistory, setPerformanceHistory] = React.useState(
    initialValues.performanceHistory
  );
  const [createdBy, setCreatedBy] = React.useState(initialValues.createdBy);
  const [members, setMembers] = React.useState(initialValues.members);
  const [maxMembers, setMaxMembers] = React.useState(initialValues.maxMembers);
  const [isActive, setIsActive] = React.useState(initialValues.isActive);
  const [isPublic, setIsPublic] = React.useState(initialValues.isPublic);
  const [allowChat, setAllowChat] = React.useState(initialValues.allowChat);
  const [allowVoice, setAllowVoice] = React.useState(initialValues.allowVoice);
  const [startTime, setStartTime] = React.useState(initialValues.startTime);
  const [endTime, setEndTime] = React.useState(initialValues.endTime);
  const [participants, setParticipants] = React.useState(
    initialValues.participants
  );
  const [activities, setActivities] = React.useState(initialValues.activities);
  const [chatMessages, setChatMessages] = React.useState(
    initialValues.chatMessages
  );
  const [assessmentType, setAssessmentType] = React.useState(
    initialValues.assessmentType
  );
  const [completedAt, setCompletedAt] = React.useState(
    initialValues.completedAt
  );
  const [results, setResults] = React.useState(initialValues.results);
  const [knowledgeGaps, setKnowledgeGaps] = React.useState(
    initialValues.knowledgeGaps
  );
  const [recommendedFocus, setRecommendedFocus] = React.useState(
    initialValues.recommendedFocus
  );
  const [score, setScore] = React.useState(initialValues.score);
  const [rank, setRank] = React.useState(initialValues.rank);
  const [timeframe, setTimeframe] = React.useState(initialValues.timeframe);
  const [displayName, setDisplayName] = React.useState(
    initialValues.displayName
  );
  const [achievementType, setAchievementType] = React.useState(
    initialValues.achievementType
  );
  const [earnedAt, setEarnedAt] = React.useState(initialValues.earnedAt);
  const [title, setTitle] = React.useState(initialValues.title);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [badgeIcon, setBadgeIcon] = React.useState(initialValues.badgeIcon);
  const [triggerValue, setTriggerValue] = React.useState(
    initialValues.triggerValue
  );
  const [achievementCategory, setAchievementCategory] = React.useState(
    initialValues.achievementCategory
  );
  const [metadata, setMetadata] = React.useState(initialValues.metadata);
  const [content, setContent] = React.useState(initialValues.content);
  const [createdAt, setCreatedAt] = React.useState(initialValues.createdAt);
  const [updatedAt, setUpdatedAt] = React.useState(initialValues.updatedAt);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setEntityType(initialValues.entityType);
    setUserId(initialValues.userId);
    setSubject(initialValues.subject);
    setContentId(initialValues.contentId);
    setConceptId(initialValues.conceptId);
    setGroupId(initialValues.groupId);
    setSessionId(initialValues.sessionId);
    setAssessmentId(initialValues.assessmentId);
    setAchievementId(initialValues.achievementId);
    setCoachId(initialValues.coachId);
    setLeaderboardType(initialValues.leaderboardType);
    setScoreUserId(initialValues.scoreUserId);
    setCurrentLevel(initialValues.currentLevel);
    setExperiencePoints(initialValues.experiencePoints);
    setStreakCurrent(initialValues.streakCurrent);
    setStreakLongest(initialValues.streakLongest);
    setLastLessonDate(initialValues.lastLessonDate);
    setCompletedLessons(initialValues.completedLessons);
    setCurrentCompletedLessonsValue("");
    setMasteredConcepts(initialValues.masteredConcepts);
    setCurrentMasteredConceptsValue("");
    setInProgressConcepts(initialValues.inProgressConcepts);
    setCurrentInProgressConceptsValue("");
    setUnknownConcepts(initialValues.unknownConcepts);
    setCurrentUnknownConceptsValue("");
    setConfidenceScores(initialValues.confidenceScores);
    setAverageAccuracy(initialValues.averageAccuracy);
    setLearningVelocity(initialValues.learningVelocity);
    setRetentionRate(initialValues.retentionRate);
    setEngagementScore(initialValues.engagementScore);
    setDifficultyProgression(initialValues.difficultyProgression);
    setCurrentDifficultyProgressionValue("");
    setLastUpdated(initialValues.lastUpdated);
    setContentType(initialValues.contentType);
    setDifficulty(initialValues.difficulty);
    setPrerequisites(initialValues.prerequisites);
    setCurrentPrerequisitesValue("");
    setLearningObjectives(initialValues.learningObjectives);
    setCurrentLearningObjectivesValue("");
    setEstimatedDuration(initialValues.estimatedDuration);
    setCoachAdaptations(initialValues.coachAdaptations);
    setInteractiveElements(initialValues.interactiveElements);
    setTags(initialValues.tags);
    setCurrentTagsValue("");
    setS3ContentUrl(initialValues.s3ContentUrl);
    setNextReviewDate(initialValues.nextReviewDate);
    setInterval(initialValues.interval);
    setEaseFactor(initialValues.easeFactor);
    setRepetitions(initialValues.repetitions);
    setLastReviewDate(initialValues.lastReviewDate);
    setPerformanceHistory(initialValues.performanceHistory);
    setCurrentPerformanceHistoryValue("");
    setCreatedBy(initialValues.createdBy);
    setMembers(initialValues.members);
    setCurrentMembersValue("");
    setMaxMembers(initialValues.maxMembers);
    setIsActive(initialValues.isActive);
    setIsPublic(initialValues.isPublic);
    setAllowChat(initialValues.allowChat);
    setAllowVoice(initialValues.allowVoice);
    setStartTime(initialValues.startTime);
    setEndTime(initialValues.endTime);
    setParticipants(initialValues.participants);
    setActivities(initialValues.activities);
    setChatMessages(initialValues.chatMessages);
    setAssessmentType(initialValues.assessmentType);
    setCompletedAt(initialValues.completedAt);
    setResults(initialValues.results);
    setKnowledgeGaps(initialValues.knowledgeGaps);
    setCurrentKnowledgeGapsValue("");
    setRecommendedFocus(initialValues.recommendedFocus);
    setCurrentRecommendedFocusValue("");
    setScore(initialValues.score);
    setRank(initialValues.rank);
    setTimeframe(initialValues.timeframe);
    setDisplayName(initialValues.displayName);
    setAchievementType(initialValues.achievementType);
    setEarnedAt(initialValues.earnedAt);
    setTitle(initialValues.title);
    setDescription(initialValues.description);
    setBadgeIcon(initialValues.badgeIcon);
    setTriggerValue(initialValues.triggerValue);
    setAchievementCategory(initialValues.achievementCategory);
    setMetadata(initialValues.metadata);
    setContent(initialValues.content);
    setCreatedAt(initialValues.createdAt);
    setUpdatedAt(initialValues.updatedAt);
    setErrors({});
  };
  const [currentCompletedLessonsValue, setCurrentCompletedLessonsValue] =
    React.useState("");
  const completedLessonsRef = React.createRef();
  const [currentMasteredConceptsValue, setCurrentMasteredConceptsValue] =
    React.useState("");
  const masteredConceptsRef = React.createRef();
  const [currentInProgressConceptsValue, setCurrentInProgressConceptsValue] =
    React.useState("");
  const inProgressConceptsRef = React.createRef();
  const [currentUnknownConceptsValue, setCurrentUnknownConceptsValue] =
    React.useState("");
  const unknownConceptsRef = React.createRef();
  const [
    currentDifficultyProgressionValue,
    setCurrentDifficultyProgressionValue,
  ] = React.useState("");
  const difficultyProgressionRef = React.createRef();
  const [currentPrerequisitesValue, setCurrentPrerequisitesValue] =
    React.useState("");
  const prerequisitesRef = React.createRef();
  const [currentLearningObjectivesValue, setCurrentLearningObjectivesValue] =
    React.useState("");
  const learningObjectivesRef = React.createRef();
  const [currentTagsValue, setCurrentTagsValue] = React.useState("");
  const tagsRef = React.createRef();
  const [currentPerformanceHistoryValue, setCurrentPerformanceHistoryValue] =
    React.useState("");
  const performanceHistoryRef = React.createRef();
  const [currentMembersValue, setCurrentMembersValue] = React.useState("");
  const membersRef = React.createRef();
  const [currentKnowledgeGapsValue, setCurrentKnowledgeGapsValue] =
    React.useState("");
  const knowledgeGapsRef = React.createRef();
  const [currentRecommendedFocusValue, setCurrentRecommendedFocusValue] =
    React.useState("");
  const recommendedFocusRef = React.createRef();
  const validations = {
    entityType: [{ type: "Required" }],
    userId: [],
    subject: [],
    contentId: [],
    conceptId: [],
    groupId: [],
    sessionId: [],
    assessmentId: [],
    achievementId: [],
    coachId: [],
    leaderboardType: [],
    scoreUserId: [],
    currentLevel: [],
    experiencePoints: [],
    streakCurrent: [],
    streakLongest: [],
    lastLessonDate: [],
    completedLessons: [],
    masteredConcepts: [],
    inProgressConcepts: [],
    unknownConcepts: [],
    confidenceScores: [{ type: "JSON" }],
    averageAccuracy: [],
    learningVelocity: [],
    retentionRate: [],
    engagementScore: [],
    difficultyProgression: [],
    lastUpdated: [],
    contentType: [],
    difficulty: [],
    prerequisites: [],
    learningObjectives: [],
    estimatedDuration: [],
    coachAdaptations: [{ type: "JSON" }],
    interactiveElements: [{ type: "JSON" }],
    tags: [],
    s3ContentUrl: [{ type: "URL" }],
    nextReviewDate: [],
    interval: [],
    easeFactor: [],
    repetitions: [],
    lastReviewDate: [],
    performanceHistory: [],
    createdBy: [],
    members: [],
    maxMembers: [],
    isActive: [],
    isPublic: [],
    allowChat: [],
    allowVoice: [],
    startTime: [],
    endTime: [],
    participants: [{ type: "JSON" }],
    activities: [{ type: "JSON" }],
    chatMessages: [{ type: "JSON" }],
    assessmentType: [],
    completedAt: [],
    results: [{ type: "JSON" }],
    knowledgeGaps: [],
    recommendedFocus: [],
    score: [],
    rank: [],
    timeframe: [],
    displayName: [],
    achievementType: [],
    earnedAt: [],
    title: [],
    description: [],
    badgeIcon: [],
    triggerValue: [],
    achievementCategory: [],
    metadata: [{ type: "JSON" }],
    content: [{ type: "JSON" }],
    createdAt: [{ type: "Required" }],
    updatedAt: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          entityType,
          userId,
          subject,
          contentId,
          conceptId,
          groupId,
          sessionId,
          assessmentId,
          achievementId,
          coachId,
          leaderboardType,
          scoreUserId,
          currentLevel,
          experiencePoints,
          streakCurrent,
          streakLongest,
          lastLessonDate,
          completedLessons,
          masteredConcepts,
          inProgressConcepts,
          unknownConcepts,
          confidenceScores,
          averageAccuracy,
          learningVelocity,
          retentionRate,
          engagementScore,
          difficultyProgression,
          lastUpdated,
          contentType,
          difficulty,
          prerequisites,
          learningObjectives,
          estimatedDuration,
          coachAdaptations,
          interactiveElements,
          tags,
          s3ContentUrl,
          nextReviewDate,
          interval,
          easeFactor,
          repetitions,
          lastReviewDate,
          performanceHistory,
          createdBy,
          members,
          maxMembers,
          isActive,
          isPublic,
          allowChat,
          allowVoice,
          startTime,
          endTime,
          participants,
          activities,
          chatMessages,
          assessmentType,
          completedAt,
          results,
          knowledgeGaps,
          recommendedFocus,
          score,
          rank,
          timeframe,
          displayName,
          achievementType,
          earnedAt,
          title,
          description,
          badgeIcon,
          triggerValue,
          achievementCategory,
          metadata,
          content,
          createdAt,
          updatedAt,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createZunoItem.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ZunoItemCreateForm")}
      {...rest}
    >
      <TextField
        label="Entity type"
        isRequired={true}
        isReadOnly={false}
        value={entityType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType: value,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.entityType ?? value;
          }
          if (errors.entityType?.hasError) {
            runValidationTasks("entityType", value);
          }
          setEntityType(value);
        }}
        onBlur={() => runValidationTasks("entityType", entityType)}
        errorMessage={errors.entityType?.errorMessage}
        hasError={errors.entityType?.hasError}
        {...getOverrideProps(overrides, "entityType")}
      ></TextField>
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId: value,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextField
        label="Subject"
        isRequired={false}
        isReadOnly={false}
        value={subject}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject: value,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.subject ?? value;
          }
          if (errors.subject?.hasError) {
            runValidationTasks("subject", value);
          }
          setSubject(value);
        }}
        onBlur={() => runValidationTasks("subject", subject)}
        errorMessage={errors.subject?.errorMessage}
        hasError={errors.subject?.hasError}
        {...getOverrideProps(overrides, "subject")}
      ></TextField>
      <TextField
        label="Content id"
        isRequired={false}
        isReadOnly={false}
        value={contentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId: value,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.contentId ?? value;
          }
          if (errors.contentId?.hasError) {
            runValidationTasks("contentId", value);
          }
          setContentId(value);
        }}
        onBlur={() => runValidationTasks("contentId", contentId)}
        errorMessage={errors.contentId?.errorMessage}
        hasError={errors.contentId?.hasError}
        {...getOverrideProps(overrides, "contentId")}
      ></TextField>
      <TextField
        label="Concept id"
        isRequired={false}
        isReadOnly={false}
        value={conceptId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId: value,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.conceptId ?? value;
          }
          if (errors.conceptId?.hasError) {
            runValidationTasks("conceptId", value);
          }
          setConceptId(value);
        }}
        onBlur={() => runValidationTasks("conceptId", conceptId)}
        errorMessage={errors.conceptId?.errorMessage}
        hasError={errors.conceptId?.hasError}
        {...getOverrideProps(overrides, "conceptId")}
      ></TextField>
      <TextField
        label="Group id"
        isRequired={false}
        isReadOnly={false}
        value={groupId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId: value,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.groupId ?? value;
          }
          if (errors.groupId?.hasError) {
            runValidationTasks("groupId", value);
          }
          setGroupId(value);
        }}
        onBlur={() => runValidationTasks("groupId", groupId)}
        errorMessage={errors.groupId?.errorMessage}
        hasError={errors.groupId?.hasError}
        {...getOverrideProps(overrides, "groupId")}
      ></TextField>
      <TextField
        label="Session id"
        isRequired={false}
        isReadOnly={false}
        value={sessionId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId: value,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.sessionId ?? value;
          }
          if (errors.sessionId?.hasError) {
            runValidationTasks("sessionId", value);
          }
          setSessionId(value);
        }}
        onBlur={() => runValidationTasks("sessionId", sessionId)}
        errorMessage={errors.sessionId?.errorMessage}
        hasError={errors.sessionId?.hasError}
        {...getOverrideProps(overrides, "sessionId")}
      ></TextField>
      <TextField
        label="Assessment id"
        isRequired={false}
        isReadOnly={false}
        value={assessmentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId: value,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.assessmentId ?? value;
          }
          if (errors.assessmentId?.hasError) {
            runValidationTasks("assessmentId", value);
          }
          setAssessmentId(value);
        }}
        onBlur={() => runValidationTasks("assessmentId", assessmentId)}
        errorMessage={errors.assessmentId?.errorMessage}
        hasError={errors.assessmentId?.hasError}
        {...getOverrideProps(overrides, "assessmentId")}
      ></TextField>
      <TextField
        label="Achievement id"
        isRequired={false}
        isReadOnly={false}
        value={achievementId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId: value,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.achievementId ?? value;
          }
          if (errors.achievementId?.hasError) {
            runValidationTasks("achievementId", value);
          }
          setAchievementId(value);
        }}
        onBlur={() => runValidationTasks("achievementId", achievementId)}
        errorMessage={errors.achievementId?.errorMessage}
        hasError={errors.achievementId?.hasError}
        {...getOverrideProps(overrides, "achievementId")}
      ></TextField>
      <SelectField
        label="Coach id"
        placeholder="Please select an option"
        isDisabled={false}
        value={coachId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId: value,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.coachId ?? value;
          }
          if (errors.coachId?.hasError) {
            runValidationTasks("coachId", value);
          }
          setCoachId(value);
        }}
        onBlur={() => runValidationTasks("coachId", coachId)}
        errorMessage={errors.coachId?.errorMessage}
        hasError={errors.coachId?.hasError}
        {...getOverrideProps(overrides, "coachId")}
      >
        <option
          children="Elia"
          value="ELIA"
          {...getOverrideProps(overrides, "coachIdoption0")}
        ></option>
        <option
          children="Skippy"
          value="SKIPPY"
          {...getOverrideProps(overrides, "coachIdoption1")}
        ></option>
        <option
          children="Lupa"
          value="LUPA"
          {...getOverrideProps(overrides, "coachIdoption2")}
        ></option>
        <option
          children="Polpo"
          value="POLPO"
          {...getOverrideProps(overrides, "coachIdoption3")}
        ></option>
      </SelectField>
      <TextField
        label="Leaderboard type"
        isRequired={false}
        isReadOnly={false}
        value={leaderboardType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType: value,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.leaderboardType ?? value;
          }
          if (errors.leaderboardType?.hasError) {
            runValidationTasks("leaderboardType", value);
          }
          setLeaderboardType(value);
        }}
        onBlur={() => runValidationTasks("leaderboardType", leaderboardType)}
        errorMessage={errors.leaderboardType?.errorMessage}
        hasError={errors.leaderboardType?.hasError}
        {...getOverrideProps(overrides, "leaderboardType")}
      ></TextField>
      <TextField
        label="Score user id"
        isRequired={false}
        isReadOnly={false}
        value={scoreUserId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId: value,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.scoreUserId ?? value;
          }
          if (errors.scoreUserId?.hasError) {
            runValidationTasks("scoreUserId", value);
          }
          setScoreUserId(value);
        }}
        onBlur={() => runValidationTasks("scoreUserId", scoreUserId)}
        errorMessage={errors.scoreUserId?.errorMessage}
        hasError={errors.scoreUserId?.hasError}
        {...getOverrideProps(overrides, "scoreUserId")}
      ></TextField>
      <TextField
        label="Current level"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentLevel}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel: value,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.currentLevel ?? value;
          }
          if (errors.currentLevel?.hasError) {
            runValidationTasks("currentLevel", value);
          }
          setCurrentLevel(value);
        }}
        onBlur={() => runValidationTasks("currentLevel", currentLevel)}
        errorMessage={errors.currentLevel?.errorMessage}
        hasError={errors.currentLevel?.hasError}
        {...getOverrideProps(overrides, "currentLevel")}
      ></TextField>
      <TextField
        label="Experience points"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={experiencePoints}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints: value,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.experiencePoints ?? value;
          }
          if (errors.experiencePoints?.hasError) {
            runValidationTasks("experiencePoints", value);
          }
          setExperiencePoints(value);
        }}
        onBlur={() => runValidationTasks("experiencePoints", experiencePoints)}
        errorMessage={errors.experiencePoints?.errorMessage}
        hasError={errors.experiencePoints?.hasError}
        {...getOverrideProps(overrides, "experiencePoints")}
      ></TextField>
      <TextField
        label="Streak current"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={streakCurrent}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent: value,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.streakCurrent ?? value;
          }
          if (errors.streakCurrent?.hasError) {
            runValidationTasks("streakCurrent", value);
          }
          setStreakCurrent(value);
        }}
        onBlur={() => runValidationTasks("streakCurrent", streakCurrent)}
        errorMessage={errors.streakCurrent?.errorMessage}
        hasError={errors.streakCurrent?.hasError}
        {...getOverrideProps(overrides, "streakCurrent")}
      ></TextField>
      <TextField
        label="Streak longest"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={streakLongest}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest: value,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.streakLongest ?? value;
          }
          if (errors.streakLongest?.hasError) {
            runValidationTasks("streakLongest", value);
          }
          setStreakLongest(value);
        }}
        onBlur={() => runValidationTasks("streakLongest", streakLongest)}
        errorMessage={errors.streakLongest?.errorMessage}
        hasError={errors.streakLongest?.hasError}
        {...getOverrideProps(overrides, "streakLongest")}
      ></TextField>
      <TextField
        label="Last lesson date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={lastLessonDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate: value,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.lastLessonDate ?? value;
          }
          if (errors.lastLessonDate?.hasError) {
            runValidationTasks("lastLessonDate", value);
          }
          setLastLessonDate(value);
        }}
        onBlur={() => runValidationTasks("lastLessonDate", lastLessonDate)}
        errorMessage={errors.lastLessonDate?.errorMessage}
        hasError={errors.lastLessonDate?.hasError}
        {...getOverrideProps(overrides, "lastLessonDate")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons: values,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.completedLessons ?? values;
          }
          setCompletedLessons(values);
          setCurrentCompletedLessonsValue("");
        }}
        currentFieldValue={currentCompletedLessonsValue}
        label={"Completed lessons"}
        items={completedLessons}
        hasError={errors?.completedLessons?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "completedLessons",
            currentCompletedLessonsValue
          )
        }
        errorMessage={errors?.completedLessons?.errorMessage}
        setFieldValue={setCurrentCompletedLessonsValue}
        inputFieldRef={completedLessonsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Completed lessons"
          isRequired={false}
          isReadOnly={false}
          value={currentCompletedLessonsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.completedLessons?.hasError) {
              runValidationTasks("completedLessons", value);
            }
            setCurrentCompletedLessonsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("completedLessons", currentCompletedLessonsValue)
          }
          errorMessage={errors.completedLessons?.errorMessage}
          hasError={errors.completedLessons?.hasError}
          ref={completedLessonsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "completedLessons")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts: values,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.masteredConcepts ?? values;
          }
          setMasteredConcepts(values);
          setCurrentMasteredConceptsValue("");
        }}
        currentFieldValue={currentMasteredConceptsValue}
        label={"Mastered concepts"}
        items={masteredConcepts}
        hasError={errors?.masteredConcepts?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "masteredConcepts",
            currentMasteredConceptsValue
          )
        }
        errorMessage={errors?.masteredConcepts?.errorMessage}
        setFieldValue={setCurrentMasteredConceptsValue}
        inputFieldRef={masteredConceptsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Mastered concepts"
          isRequired={false}
          isReadOnly={false}
          value={currentMasteredConceptsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.masteredConcepts?.hasError) {
              runValidationTasks("masteredConcepts", value);
            }
            setCurrentMasteredConceptsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("masteredConcepts", currentMasteredConceptsValue)
          }
          errorMessage={errors.masteredConcepts?.errorMessage}
          hasError={errors.masteredConcepts?.hasError}
          ref={masteredConceptsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "masteredConcepts")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts: values,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.inProgressConcepts ?? values;
          }
          setInProgressConcepts(values);
          setCurrentInProgressConceptsValue("");
        }}
        currentFieldValue={currentInProgressConceptsValue}
        label={"In progress concepts"}
        items={inProgressConcepts}
        hasError={errors?.inProgressConcepts?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "inProgressConcepts",
            currentInProgressConceptsValue
          )
        }
        errorMessage={errors?.inProgressConcepts?.errorMessage}
        setFieldValue={setCurrentInProgressConceptsValue}
        inputFieldRef={inProgressConceptsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="In progress concepts"
          isRequired={false}
          isReadOnly={false}
          value={currentInProgressConceptsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.inProgressConcepts?.hasError) {
              runValidationTasks("inProgressConcepts", value);
            }
            setCurrentInProgressConceptsValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "inProgressConcepts",
              currentInProgressConceptsValue
            )
          }
          errorMessage={errors.inProgressConcepts?.errorMessage}
          hasError={errors.inProgressConcepts?.hasError}
          ref={inProgressConceptsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "inProgressConcepts")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts: values,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.unknownConcepts ?? values;
          }
          setUnknownConcepts(values);
          setCurrentUnknownConceptsValue("");
        }}
        currentFieldValue={currentUnknownConceptsValue}
        label={"Unknown concepts"}
        items={unknownConcepts}
        hasError={errors?.unknownConcepts?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "unknownConcepts",
            currentUnknownConceptsValue
          )
        }
        errorMessage={errors?.unknownConcepts?.errorMessage}
        setFieldValue={setCurrentUnknownConceptsValue}
        inputFieldRef={unknownConceptsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Unknown concepts"
          isRequired={false}
          isReadOnly={false}
          value={currentUnknownConceptsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.unknownConcepts?.hasError) {
              runValidationTasks("unknownConcepts", value);
            }
            setCurrentUnknownConceptsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("unknownConcepts", currentUnknownConceptsValue)
          }
          errorMessage={errors.unknownConcepts?.errorMessage}
          hasError={errors.unknownConcepts?.hasError}
          ref={unknownConceptsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "unknownConcepts")}
        ></TextField>
      </ArrayField>
      <TextAreaField
        label="Confidence scores"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores: value,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.confidenceScores ?? value;
          }
          if (errors.confidenceScores?.hasError) {
            runValidationTasks("confidenceScores", value);
          }
          setConfidenceScores(value);
        }}
        onBlur={() => runValidationTasks("confidenceScores", confidenceScores)}
        errorMessage={errors.confidenceScores?.errorMessage}
        hasError={errors.confidenceScores?.hasError}
        {...getOverrideProps(overrides, "confidenceScores")}
      ></TextAreaField>
      <TextField
        label="Average accuracy"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={averageAccuracy}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy: value,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.averageAccuracy ?? value;
          }
          if (errors.averageAccuracy?.hasError) {
            runValidationTasks("averageAccuracy", value);
          }
          setAverageAccuracy(value);
        }}
        onBlur={() => runValidationTasks("averageAccuracy", averageAccuracy)}
        errorMessage={errors.averageAccuracy?.errorMessage}
        hasError={errors.averageAccuracy?.hasError}
        {...getOverrideProps(overrides, "averageAccuracy")}
      ></TextField>
      <TextField
        label="Learning velocity"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={learningVelocity}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity: value,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.learningVelocity ?? value;
          }
          if (errors.learningVelocity?.hasError) {
            runValidationTasks("learningVelocity", value);
          }
          setLearningVelocity(value);
        }}
        onBlur={() => runValidationTasks("learningVelocity", learningVelocity)}
        errorMessage={errors.learningVelocity?.errorMessage}
        hasError={errors.learningVelocity?.hasError}
        {...getOverrideProps(overrides, "learningVelocity")}
      ></TextField>
      <TextField
        label="Retention rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={retentionRate}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate: value,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.retentionRate ?? value;
          }
          if (errors.retentionRate?.hasError) {
            runValidationTasks("retentionRate", value);
          }
          setRetentionRate(value);
        }}
        onBlur={() => runValidationTasks("retentionRate", retentionRate)}
        errorMessage={errors.retentionRate?.errorMessage}
        hasError={errors.retentionRate?.hasError}
        {...getOverrideProps(overrides, "retentionRate")}
      ></TextField>
      <TextField
        label="Engagement score"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={engagementScore}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore: value,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.engagementScore ?? value;
          }
          if (errors.engagementScore?.hasError) {
            runValidationTasks("engagementScore", value);
          }
          setEngagementScore(value);
        }}
        onBlur={() => runValidationTasks("engagementScore", engagementScore)}
        errorMessage={errors.engagementScore?.errorMessage}
        hasError={errors.engagementScore?.hasError}
        {...getOverrideProps(overrides, "engagementScore")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression: values,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.difficultyProgression ?? values;
          }
          setDifficultyProgression(values);
          setCurrentDifficultyProgressionValue("");
        }}
        currentFieldValue={currentDifficultyProgressionValue}
        label={"Difficulty progression"}
        items={difficultyProgression}
        hasError={errors?.difficultyProgression?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "difficultyProgression",
            currentDifficultyProgressionValue
          )
        }
        errorMessage={errors?.difficultyProgression?.errorMessage}
        setFieldValue={setCurrentDifficultyProgressionValue}
        inputFieldRef={difficultyProgressionRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Difficulty progression"
          isRequired={false}
          isReadOnly={false}
          value={currentDifficultyProgressionValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.difficultyProgression?.hasError) {
              runValidationTasks("difficultyProgression", value);
            }
            setCurrentDifficultyProgressionValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "difficultyProgression",
              currentDifficultyProgressionValue
            )
          }
          errorMessage={errors.difficultyProgression?.errorMessage}
          hasError={errors.difficultyProgression?.hasError}
          ref={difficultyProgressionRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "difficultyProgression")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Last updated"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={lastUpdated && convertToLocal(new Date(lastUpdated))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated: value,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.lastUpdated ?? value;
          }
          if (errors.lastUpdated?.hasError) {
            runValidationTasks("lastUpdated", value);
          }
          setLastUpdated(value);
        }}
        onBlur={() => runValidationTasks("lastUpdated", lastUpdated)}
        errorMessage={errors.lastUpdated?.errorMessage}
        hasError={errors.lastUpdated?.hasError}
        {...getOverrideProps(overrides, "lastUpdated")}
      ></TextField>
      <TextField
        label="Content type"
        isRequired={false}
        isReadOnly={false}
        value={contentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType: value,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.contentType ?? value;
          }
          if (errors.contentType?.hasError) {
            runValidationTasks("contentType", value);
          }
          setContentType(value);
        }}
        onBlur={() => runValidationTasks("contentType", contentType)}
        errorMessage={errors.contentType?.errorMessage}
        hasError={errors.contentType?.hasError}
        {...getOverrideProps(overrides, "contentType")}
      ></TextField>
      <TextField
        label="Difficulty"
        isRequired={false}
        isReadOnly={false}
        value={difficulty}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty: value,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.difficulty ?? value;
          }
          if (errors.difficulty?.hasError) {
            runValidationTasks("difficulty", value);
          }
          setDifficulty(value);
        }}
        onBlur={() => runValidationTasks("difficulty", difficulty)}
        errorMessage={errors.difficulty?.errorMessage}
        hasError={errors.difficulty?.hasError}
        {...getOverrideProps(overrides, "difficulty")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites: values,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.prerequisites ?? values;
          }
          setPrerequisites(values);
          setCurrentPrerequisitesValue("");
        }}
        currentFieldValue={currentPrerequisitesValue}
        label={"Prerequisites"}
        items={prerequisites}
        hasError={errors?.prerequisites?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("prerequisites", currentPrerequisitesValue)
        }
        errorMessage={errors?.prerequisites?.errorMessage}
        setFieldValue={setCurrentPrerequisitesValue}
        inputFieldRef={prerequisitesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Prerequisites"
          isRequired={false}
          isReadOnly={false}
          value={currentPrerequisitesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.prerequisites?.hasError) {
              runValidationTasks("prerequisites", value);
            }
            setCurrentPrerequisitesValue(value);
          }}
          onBlur={() =>
            runValidationTasks("prerequisites", currentPrerequisitesValue)
          }
          errorMessage={errors.prerequisites?.errorMessage}
          hasError={errors.prerequisites?.hasError}
          ref={prerequisitesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "prerequisites")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives: values,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.learningObjectives ?? values;
          }
          setLearningObjectives(values);
          setCurrentLearningObjectivesValue("");
        }}
        currentFieldValue={currentLearningObjectivesValue}
        label={"Learning objectives"}
        items={learningObjectives}
        hasError={errors?.learningObjectives?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "learningObjectives",
            currentLearningObjectivesValue
          )
        }
        errorMessage={errors?.learningObjectives?.errorMessage}
        setFieldValue={setCurrentLearningObjectivesValue}
        inputFieldRef={learningObjectivesRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Learning objectives"
          isRequired={false}
          isReadOnly={false}
          value={currentLearningObjectivesValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.learningObjectives?.hasError) {
              runValidationTasks("learningObjectives", value);
            }
            setCurrentLearningObjectivesValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "learningObjectives",
              currentLearningObjectivesValue
            )
          }
          errorMessage={errors.learningObjectives?.errorMessage}
          hasError={errors.learningObjectives?.hasError}
          ref={learningObjectivesRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "learningObjectives")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Estimated duration"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={estimatedDuration}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration: value,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.estimatedDuration ?? value;
          }
          if (errors.estimatedDuration?.hasError) {
            runValidationTasks("estimatedDuration", value);
          }
          setEstimatedDuration(value);
        }}
        onBlur={() =>
          runValidationTasks("estimatedDuration", estimatedDuration)
        }
        errorMessage={errors.estimatedDuration?.errorMessage}
        hasError={errors.estimatedDuration?.hasError}
        {...getOverrideProps(overrides, "estimatedDuration")}
      ></TextField>
      <TextAreaField
        label="Coach adaptations"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations: value,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.coachAdaptations ?? value;
          }
          if (errors.coachAdaptations?.hasError) {
            runValidationTasks("coachAdaptations", value);
          }
          setCoachAdaptations(value);
        }}
        onBlur={() => runValidationTasks("coachAdaptations", coachAdaptations)}
        errorMessage={errors.coachAdaptations?.errorMessage}
        hasError={errors.coachAdaptations?.hasError}
        {...getOverrideProps(overrides, "coachAdaptations")}
      ></TextAreaField>
      <TextAreaField
        label="Interactive elements"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements: value,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.interactiveElements ?? value;
          }
          if (errors.interactiveElements?.hasError) {
            runValidationTasks("interactiveElements", value);
          }
          setInteractiveElements(value);
        }}
        onBlur={() =>
          runValidationTasks("interactiveElements", interactiveElements)
        }
        errorMessage={errors.interactiveElements?.errorMessage}
        hasError={errors.interactiveElements?.hasError}
        {...getOverrideProps(overrides, "interactiveElements")}
      ></TextAreaField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags: values,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.tags ?? values;
          }
          setTags(values);
          setCurrentTagsValue("");
        }}
        currentFieldValue={currentTagsValue}
        label={"Tags"}
        items={tags}
        hasError={errors?.tags?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("tags", currentTagsValue)
        }
        errorMessage={errors?.tags?.errorMessage}
        setFieldValue={setCurrentTagsValue}
        inputFieldRef={tagsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Tags"
          isRequired={false}
          isReadOnly={false}
          value={currentTagsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.tags?.hasError) {
              runValidationTasks("tags", value);
            }
            setCurrentTagsValue(value);
          }}
          onBlur={() => runValidationTasks("tags", currentTagsValue)}
          errorMessage={errors.tags?.errorMessage}
          hasError={errors.tags?.hasError}
          ref={tagsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "tags")}
        ></TextField>
      </ArrayField>
      <TextField
        label="S3 content url"
        isRequired={false}
        isReadOnly={false}
        value={s3ContentUrl}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl: value,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.s3ContentUrl ?? value;
          }
          if (errors.s3ContentUrl?.hasError) {
            runValidationTasks("s3ContentUrl", value);
          }
          setS3ContentUrl(value);
        }}
        onBlur={() => runValidationTasks("s3ContentUrl", s3ContentUrl)}
        errorMessage={errors.s3ContentUrl?.errorMessage}
        hasError={errors.s3ContentUrl?.hasError}
        {...getOverrideProps(overrides, "s3ContentUrl")}
      ></TextField>
      <TextField
        label="Next review date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={nextReviewDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate: value,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.nextReviewDate ?? value;
          }
          if (errors.nextReviewDate?.hasError) {
            runValidationTasks("nextReviewDate", value);
          }
          setNextReviewDate(value);
        }}
        onBlur={() => runValidationTasks("nextReviewDate", nextReviewDate)}
        errorMessage={errors.nextReviewDate?.errorMessage}
        hasError={errors.nextReviewDate?.hasError}
        {...getOverrideProps(overrides, "nextReviewDate")}
      ></TextField>
      <TextField
        label="Interval"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={interval}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval: value,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.interval ?? value;
          }
          if (errors.interval?.hasError) {
            runValidationTasks("interval", value);
          }
          setInterval(value);
        }}
        onBlur={() => runValidationTasks("interval", interval)}
        errorMessage={errors.interval?.errorMessage}
        hasError={errors.interval?.hasError}
        {...getOverrideProps(overrides, "interval")}
      ></TextField>
      <TextField
        label="Ease factor"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={easeFactor}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor: value,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.easeFactor ?? value;
          }
          if (errors.easeFactor?.hasError) {
            runValidationTasks("easeFactor", value);
          }
          setEaseFactor(value);
        }}
        onBlur={() => runValidationTasks("easeFactor", easeFactor)}
        errorMessage={errors.easeFactor?.errorMessage}
        hasError={errors.easeFactor?.hasError}
        {...getOverrideProps(overrides, "easeFactor")}
      ></TextField>
      <TextField
        label="Repetitions"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={repetitions}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions: value,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.repetitions ?? value;
          }
          if (errors.repetitions?.hasError) {
            runValidationTasks("repetitions", value);
          }
          setRepetitions(value);
        }}
        onBlur={() => runValidationTasks("repetitions", repetitions)}
        errorMessage={errors.repetitions?.errorMessage}
        hasError={errors.repetitions?.hasError}
        {...getOverrideProps(overrides, "repetitions")}
      ></TextField>
      <TextField
        label="Last review date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={lastReviewDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate: value,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.lastReviewDate ?? value;
          }
          if (errors.lastReviewDate?.hasError) {
            runValidationTasks("lastReviewDate", value);
          }
          setLastReviewDate(value);
        }}
        onBlur={() => runValidationTasks("lastReviewDate", lastReviewDate)}
        errorMessage={errors.lastReviewDate?.errorMessage}
        hasError={errors.lastReviewDate?.hasError}
        {...getOverrideProps(overrides, "lastReviewDate")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory: values,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.performanceHistory ?? values;
          }
          setPerformanceHistory(values);
          setCurrentPerformanceHistoryValue("");
        }}
        currentFieldValue={currentPerformanceHistoryValue}
        label={"Performance history"}
        items={performanceHistory}
        hasError={errors?.performanceHistory?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "performanceHistory",
            currentPerformanceHistoryValue
          )
        }
        errorMessage={errors?.performanceHistory?.errorMessage}
        setFieldValue={setCurrentPerformanceHistoryValue}
        inputFieldRef={performanceHistoryRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Performance history"
          isRequired={false}
          isReadOnly={false}
          type="number"
          step="any"
          value={currentPerformanceHistoryValue}
          onChange={(e) => {
            let value = isNaN(parseFloat(e.target.value))
              ? e.target.value
              : parseFloat(e.target.value);
            if (errors.performanceHistory?.hasError) {
              runValidationTasks("performanceHistory", value);
            }
            setCurrentPerformanceHistoryValue(value);
          }}
          onBlur={() =>
            runValidationTasks(
              "performanceHistory",
              currentPerformanceHistoryValue
            )
          }
          errorMessage={errors.performanceHistory?.errorMessage}
          hasError={errors.performanceHistory?.hasError}
          ref={performanceHistoryRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "performanceHistory")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Created by"
        isRequired={false}
        isReadOnly={false}
        value={createdBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy: value,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdBy ?? value;
          }
          if (errors.createdBy?.hasError) {
            runValidationTasks("createdBy", value);
          }
          setCreatedBy(value);
        }}
        onBlur={() => runValidationTasks("createdBy", createdBy)}
        errorMessage={errors.createdBy?.errorMessage}
        hasError={errors.createdBy?.hasError}
        {...getOverrideProps(overrides, "createdBy")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members: values,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.members ?? values;
          }
          setMembers(values);
          setCurrentMembersValue("");
        }}
        currentFieldValue={currentMembersValue}
        label={"Members"}
        items={members}
        hasError={errors?.members?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("members", currentMembersValue)
        }
        errorMessage={errors?.members?.errorMessage}
        setFieldValue={setCurrentMembersValue}
        inputFieldRef={membersRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Members"
          isRequired={false}
          isReadOnly={false}
          value={currentMembersValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.members?.hasError) {
              runValidationTasks("members", value);
            }
            setCurrentMembersValue(value);
          }}
          onBlur={() => runValidationTasks("members", currentMembersValue)}
          errorMessage={errors.members?.errorMessage}
          hasError={errors.members?.hasError}
          ref={membersRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "members")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Max members"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={maxMembers}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers: value,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.maxMembers ?? value;
          }
          if (errors.maxMembers?.hasError) {
            runValidationTasks("maxMembers", value);
          }
          setMaxMembers(value);
        }}
        onBlur={() => runValidationTasks("maxMembers", maxMembers)}
        errorMessage={errors.maxMembers?.errorMessage}
        hasError={errors.maxMembers?.hasError}
        {...getOverrideProps(overrides, "maxMembers")}
      ></TextField>
      <SwitchField
        label="Is active"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isActive}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive: value,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.isActive ?? value;
          }
          if (errors.isActive?.hasError) {
            runValidationTasks("isActive", value);
          }
          setIsActive(value);
        }}
        onBlur={() => runValidationTasks("isActive", isActive)}
        errorMessage={errors.isActive?.errorMessage}
        hasError={errors.isActive?.hasError}
        {...getOverrideProps(overrides, "isActive")}
      ></SwitchField>
      <SwitchField
        label="Is public"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isPublic}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic: value,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.isPublic ?? value;
          }
          if (errors.isPublic?.hasError) {
            runValidationTasks("isPublic", value);
          }
          setIsPublic(value);
        }}
        onBlur={() => runValidationTasks("isPublic", isPublic)}
        errorMessage={errors.isPublic?.errorMessage}
        hasError={errors.isPublic?.hasError}
        {...getOverrideProps(overrides, "isPublic")}
      ></SwitchField>
      <SwitchField
        label="Allow chat"
        defaultChecked={false}
        isDisabled={false}
        isChecked={allowChat}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat: value,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.allowChat ?? value;
          }
          if (errors.allowChat?.hasError) {
            runValidationTasks("allowChat", value);
          }
          setAllowChat(value);
        }}
        onBlur={() => runValidationTasks("allowChat", allowChat)}
        errorMessage={errors.allowChat?.errorMessage}
        hasError={errors.allowChat?.hasError}
        {...getOverrideProps(overrides, "allowChat")}
      ></SwitchField>
      <SwitchField
        label="Allow voice"
        defaultChecked={false}
        isDisabled={false}
        isChecked={allowVoice}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice: value,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.allowVoice ?? value;
          }
          if (errors.allowVoice?.hasError) {
            runValidationTasks("allowVoice", value);
          }
          setAllowVoice(value);
        }}
        onBlur={() => runValidationTasks("allowVoice", allowVoice)}
        errorMessage={errors.allowVoice?.errorMessage}
        hasError={errors.allowVoice?.hasError}
        {...getOverrideProps(overrides, "allowVoice")}
      ></SwitchField>
      <TextField
        label="Start time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={startTime && convertToLocal(new Date(startTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime: value,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.startTime ?? value;
          }
          if (errors.startTime?.hasError) {
            runValidationTasks("startTime", value);
          }
          setStartTime(value);
        }}
        onBlur={() => runValidationTasks("startTime", startTime)}
        errorMessage={errors.startTime?.errorMessage}
        hasError={errors.startTime?.hasError}
        {...getOverrideProps(overrides, "startTime")}
      ></TextField>
      <TextField
        label="End time"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={endTime && convertToLocal(new Date(endTime))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime: value,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.endTime ?? value;
          }
          if (errors.endTime?.hasError) {
            runValidationTasks("endTime", value);
          }
          setEndTime(value);
        }}
        onBlur={() => runValidationTasks("endTime", endTime)}
        errorMessage={errors.endTime?.errorMessage}
        hasError={errors.endTime?.hasError}
        {...getOverrideProps(overrides, "endTime")}
      ></TextField>
      <TextAreaField
        label="Participants"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants: value,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.participants ?? value;
          }
          if (errors.participants?.hasError) {
            runValidationTasks("participants", value);
          }
          setParticipants(value);
        }}
        onBlur={() => runValidationTasks("participants", participants)}
        errorMessage={errors.participants?.errorMessage}
        hasError={errors.participants?.hasError}
        {...getOverrideProps(overrides, "participants")}
      ></TextAreaField>
      <TextAreaField
        label="Activities"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities: value,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.activities ?? value;
          }
          if (errors.activities?.hasError) {
            runValidationTasks("activities", value);
          }
          setActivities(value);
        }}
        onBlur={() => runValidationTasks("activities", activities)}
        errorMessage={errors.activities?.errorMessage}
        hasError={errors.activities?.hasError}
        {...getOverrideProps(overrides, "activities")}
      ></TextAreaField>
      <TextAreaField
        label="Chat messages"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages: value,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.chatMessages ?? value;
          }
          if (errors.chatMessages?.hasError) {
            runValidationTasks("chatMessages", value);
          }
          setChatMessages(value);
        }}
        onBlur={() => runValidationTasks("chatMessages", chatMessages)}
        errorMessage={errors.chatMessages?.errorMessage}
        hasError={errors.chatMessages?.hasError}
        {...getOverrideProps(overrides, "chatMessages")}
      ></TextAreaField>
      <SelectField
        label="Assessment type"
        placeholder="Please select an option"
        isDisabled={false}
        value={assessmentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType: value,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.assessmentType ?? value;
          }
          if (errors.assessmentType?.hasError) {
            runValidationTasks("assessmentType", value);
          }
          setAssessmentType(value);
        }}
        onBlur={() => runValidationTasks("assessmentType", assessmentType)}
        errorMessage={errors.assessmentType?.errorMessage}
        hasError={errors.assessmentType?.hasError}
        {...getOverrideProps(overrides, "assessmentType")}
      >
        <option
          children="Initial"
          value="INITIAL"
          {...getOverrideProps(overrides, "assessmentTypeoption0")}
        ></option>
        <option
          children="Progress"
          value="PROGRESS"
          {...getOverrideProps(overrides, "assessmentTypeoption1")}
        ></option>
        <option
          children="Focus check"
          value="FOCUS_CHECK"
          {...getOverrideProps(overrides, "assessmentTypeoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Completed at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={completedAt && convertToLocal(new Date(completedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt: value,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.completedAt ?? value;
          }
          if (errors.completedAt?.hasError) {
            runValidationTasks("completedAt", value);
          }
          setCompletedAt(value);
        }}
        onBlur={() => runValidationTasks("completedAt", completedAt)}
        errorMessage={errors.completedAt?.errorMessage}
        hasError={errors.completedAt?.hasError}
        {...getOverrideProps(overrides, "completedAt")}
      ></TextField>
      <TextAreaField
        label="Results"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results: value,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.results ?? value;
          }
          if (errors.results?.hasError) {
            runValidationTasks("results", value);
          }
          setResults(value);
        }}
        onBlur={() => runValidationTasks("results", results)}
        errorMessage={errors.results?.errorMessage}
        hasError={errors.results?.hasError}
        {...getOverrideProps(overrides, "results")}
      ></TextAreaField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps: values,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.knowledgeGaps ?? values;
          }
          setKnowledgeGaps(values);
          setCurrentKnowledgeGapsValue("");
        }}
        currentFieldValue={currentKnowledgeGapsValue}
        label={"Knowledge gaps"}
        items={knowledgeGaps}
        hasError={errors?.knowledgeGaps?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("knowledgeGaps", currentKnowledgeGapsValue)
        }
        errorMessage={errors?.knowledgeGaps?.errorMessage}
        setFieldValue={setCurrentKnowledgeGapsValue}
        inputFieldRef={knowledgeGapsRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Knowledge gaps"
          isRequired={false}
          isReadOnly={false}
          value={currentKnowledgeGapsValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.knowledgeGaps?.hasError) {
              runValidationTasks("knowledgeGaps", value);
            }
            setCurrentKnowledgeGapsValue(value);
          }}
          onBlur={() =>
            runValidationTasks("knowledgeGaps", currentKnowledgeGapsValue)
          }
          errorMessage={errors.knowledgeGaps?.errorMessage}
          hasError={errors.knowledgeGaps?.hasError}
          ref={knowledgeGapsRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "knowledgeGaps")}
        ></TextField>
      </ArrayField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus: values,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            values = result?.recommendedFocus ?? values;
          }
          setRecommendedFocus(values);
          setCurrentRecommendedFocusValue("");
        }}
        currentFieldValue={currentRecommendedFocusValue}
        label={"Recommended focus"}
        items={recommendedFocus}
        hasError={errors?.recommendedFocus?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks(
            "recommendedFocus",
            currentRecommendedFocusValue
          )
        }
        errorMessage={errors?.recommendedFocus?.errorMessage}
        setFieldValue={setCurrentRecommendedFocusValue}
        inputFieldRef={recommendedFocusRef}
        defaultFieldValue={""}
      >
        <TextField
          label="Recommended focus"
          isRequired={false}
          isReadOnly={false}
          value={currentRecommendedFocusValue}
          onChange={(e) => {
            let { value } = e.target;
            if (errors.recommendedFocus?.hasError) {
              runValidationTasks("recommendedFocus", value);
            }
            setCurrentRecommendedFocusValue(value);
          }}
          onBlur={() =>
            runValidationTasks("recommendedFocus", currentRecommendedFocusValue)
          }
          errorMessage={errors.recommendedFocus?.errorMessage}
          hasError={errors.recommendedFocus?.hasError}
          ref={recommendedFocusRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "recommendedFocus")}
        ></TextField>
      </ArrayField>
      <TextField
        label="Score"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={score}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score: value,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.score ?? value;
          }
          if (errors.score?.hasError) {
            runValidationTasks("score", value);
          }
          setScore(value);
        }}
        onBlur={() => runValidationTasks("score", score)}
        errorMessage={errors.score?.errorMessage}
        hasError={errors.score?.hasError}
        {...getOverrideProps(overrides, "score")}
      ></TextField>
      <TextField
        label="Rank"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={rank}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank: value,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.rank ?? value;
          }
          if (errors.rank?.hasError) {
            runValidationTasks("rank", value);
          }
          setRank(value);
        }}
        onBlur={() => runValidationTasks("rank", rank)}
        errorMessage={errors.rank?.errorMessage}
        hasError={errors.rank?.hasError}
        {...getOverrideProps(overrides, "rank")}
      ></TextField>
      <SelectField
        label="Timeframe"
        placeholder="Please select an option"
        isDisabled={false}
        value={timeframe}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe: value,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.timeframe ?? value;
          }
          if (errors.timeframe?.hasError) {
            runValidationTasks("timeframe", value);
          }
          setTimeframe(value);
        }}
        onBlur={() => runValidationTasks("timeframe", timeframe)}
        errorMessage={errors.timeframe?.errorMessage}
        hasError={errors.timeframe?.hasError}
        {...getOverrideProps(overrides, "timeframe")}
      >
        <option
          children="Daily"
          value="DAILY"
          {...getOverrideProps(overrides, "timeframeoption0")}
        ></option>
        <option
          children="Weekly"
          value="WEEKLY"
          {...getOverrideProps(overrides, "timeframeoption1")}
        ></option>
        <option
          children="Monthly"
          value="MONTHLY"
          {...getOverrideProps(overrides, "timeframeoption2")}
        ></option>
        <option
          children="Alltime"
          value="ALLTIME"
          {...getOverrideProps(overrides, "timeframeoption3")}
        ></option>
      </SelectField>
      <TextField
        label="Display name"
        isRequired={false}
        isReadOnly={false}
        value={displayName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName: value,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.displayName ?? value;
          }
          if (errors.displayName?.hasError) {
            runValidationTasks("displayName", value);
          }
          setDisplayName(value);
        }}
        onBlur={() => runValidationTasks("displayName", displayName)}
        errorMessage={errors.displayName?.errorMessage}
        hasError={errors.displayName?.hasError}
        {...getOverrideProps(overrides, "displayName")}
      ></TextField>
      <TextField
        label="Achievement type"
        isRequired={false}
        isReadOnly={false}
        value={achievementType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType: value,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.achievementType ?? value;
          }
          if (errors.achievementType?.hasError) {
            runValidationTasks("achievementType", value);
          }
          setAchievementType(value);
        }}
        onBlur={() => runValidationTasks("achievementType", achievementType)}
        errorMessage={errors.achievementType?.errorMessage}
        hasError={errors.achievementType?.hasError}
        {...getOverrideProps(overrides, "achievementType")}
      ></TextField>
      <TextField
        label="Earned at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={earnedAt && convertToLocal(new Date(earnedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt: value,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.earnedAt ?? value;
          }
          if (errors.earnedAt?.hasError) {
            runValidationTasks("earnedAt", value);
          }
          setEarnedAt(value);
        }}
        onBlur={() => runValidationTasks("earnedAt", earnedAt)}
        errorMessage={errors.earnedAt?.errorMessage}
        hasError={errors.earnedAt?.hasError}
        {...getOverrideProps(overrides, "earnedAt")}
      ></TextField>
      <TextField
        label="Title"
        isRequired={false}
        isReadOnly={false}
        value={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title: value,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Description"
        isRequired={false}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description: value,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Badge icon"
        isRequired={false}
        isReadOnly={false}
        value={badgeIcon}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon: value,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.badgeIcon ?? value;
          }
          if (errors.badgeIcon?.hasError) {
            runValidationTasks("badgeIcon", value);
          }
          setBadgeIcon(value);
        }}
        onBlur={() => runValidationTasks("badgeIcon", badgeIcon)}
        errorMessage={errors.badgeIcon?.errorMessage}
        hasError={errors.badgeIcon?.hasError}
        {...getOverrideProps(overrides, "badgeIcon")}
      ></TextField>
      <TextField
        label="Trigger value"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={triggerValue}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue: value,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.triggerValue ?? value;
          }
          if (errors.triggerValue?.hasError) {
            runValidationTasks("triggerValue", value);
          }
          setTriggerValue(value);
        }}
        onBlur={() => runValidationTasks("triggerValue", triggerValue)}
        errorMessage={errors.triggerValue?.errorMessage}
        hasError={errors.triggerValue?.hasError}
        {...getOverrideProps(overrides, "triggerValue")}
      ></TextField>
      <SelectField
        label="Achievement category"
        placeholder="Please select an option"
        isDisabled={false}
        value={achievementCategory}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory: value,
              metadata,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.achievementCategory ?? value;
          }
          if (errors.achievementCategory?.hasError) {
            runValidationTasks("achievementCategory", value);
          }
          setAchievementCategory(value);
        }}
        onBlur={() =>
          runValidationTasks("achievementCategory", achievementCategory)
        }
        errorMessage={errors.achievementCategory?.errorMessage}
        hasError={errors.achievementCategory?.hasError}
        {...getOverrideProps(overrides, "achievementCategory")}
      >
        <option
          children="Streak"
          value="STREAK"
          {...getOverrideProps(overrides, "achievementCategoryoption0")}
        ></option>
        <option
          children="Mastery"
          value="MASTERY"
          {...getOverrideProps(overrides, "achievementCategoryoption1")}
        ></option>
        <option
          children="Social"
          value="SOCIAL"
          {...getOverrideProps(overrides, "achievementCategoryoption2")}
        ></option>
        <option
          children="Consistency"
          value="CONSISTENCY"
          {...getOverrideProps(overrides, "achievementCategoryoption3")}
        ></option>
      </SelectField>
      <TextAreaField
        label="Metadata"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata: value,
              content,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.metadata ?? value;
          }
          if (errors.metadata?.hasError) {
            runValidationTasks("metadata", value);
          }
          setMetadata(value);
        }}
        onBlur={() => runValidationTasks("metadata", metadata)}
        errorMessage={errors.metadata?.errorMessage}
        hasError={errors.metadata?.hasError}
        {...getOverrideProps(overrides, "metadata")}
      ></TextAreaField>
      <TextAreaField
        label="Content"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content: value,
              createdAt,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.content ?? value;
          }
          if (errors.content?.hasError) {
            runValidationTasks("content", value);
          }
          setContent(value);
        }}
        onBlur={() => runValidationTasks("content", content)}
        errorMessage={errors.content?.errorMessage}
        hasError={errors.content?.hasError}
        {...getOverrideProps(overrides, "content")}
      ></TextAreaField>
      <TextField
        label="Created at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={createdAt && convertToLocal(new Date(createdAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt: value,
              updatedAt,
            };
            const result = onChange(modelFields);
            value = result?.createdAt ?? value;
          }
          if (errors.createdAt?.hasError) {
            runValidationTasks("createdAt", value);
          }
          setCreatedAt(value);
        }}
        onBlur={() => runValidationTasks("createdAt", createdAt)}
        errorMessage={errors.createdAt?.errorMessage}
        hasError={errors.createdAt?.hasError}
        {...getOverrideProps(overrides, "createdAt")}
      ></TextField>
      <TextField
        label="Updated at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        value={updatedAt && convertToLocal(new Date(updatedAt))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              entityType,
              userId,
              subject,
              contentId,
              conceptId,
              groupId,
              sessionId,
              assessmentId,
              achievementId,
              coachId,
              leaderboardType,
              scoreUserId,
              currentLevel,
              experiencePoints,
              streakCurrent,
              streakLongest,
              lastLessonDate,
              completedLessons,
              masteredConcepts,
              inProgressConcepts,
              unknownConcepts,
              confidenceScores,
              averageAccuracy,
              learningVelocity,
              retentionRate,
              engagementScore,
              difficultyProgression,
              lastUpdated,
              contentType,
              difficulty,
              prerequisites,
              learningObjectives,
              estimatedDuration,
              coachAdaptations,
              interactiveElements,
              tags,
              s3ContentUrl,
              nextReviewDate,
              interval,
              easeFactor,
              repetitions,
              lastReviewDate,
              performanceHistory,
              createdBy,
              members,
              maxMembers,
              isActive,
              isPublic,
              allowChat,
              allowVoice,
              startTime,
              endTime,
              participants,
              activities,
              chatMessages,
              assessmentType,
              completedAt,
              results,
              knowledgeGaps,
              recommendedFocus,
              score,
              rank,
              timeframe,
              displayName,
              achievementType,
              earnedAt,
              title,
              description,
              badgeIcon,
              triggerValue,
              achievementCategory,
              metadata,
              content,
              createdAt,
              updatedAt: value,
            };
            const result = onChange(modelFields);
            value = result?.updatedAt ?? value;
          }
          if (errors.updatedAt?.hasError) {
            runValidationTasks("updatedAt", value);
          }
          setUpdatedAt(value);
        }}
        onBlur={() => runValidationTasks("updatedAt", updatedAt)}
        errorMessage={errors.updatedAt?.errorMessage}
        hasError={errors.updatedAt?.hasError}
        {...getOverrideProps(overrides, "updatedAt")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
