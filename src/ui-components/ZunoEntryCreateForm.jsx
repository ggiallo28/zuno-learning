/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createZunoEntry } from "../api/graphql/mutations";
const client = generateClient();
export default function ZunoEntryCreateForm(props) {
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
    userId: "",
    entryType: "",
    timestamp: "",
  };
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [entryType, setEntryType] = React.useState(initialValues.entryType);
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setUserId(initialValues.userId);
    setEntryType(initialValues.entryType);
    setTimestamp(initialValues.timestamp);
    setErrors({});
  };
  const validations = {
    userId: [],
    entryType: [],
    timestamp: [],
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
          userId,
          entryType,
          timestamp,
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
            query: createZunoEntry.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ZunoEntryCreateForm")}
      {...rest}
    >
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId: value,
              entryType,
              timestamp,
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
      <SelectField
        label="Entry type"
        placeholder="Please select an option"
        isDisabled={false}
        value={entryType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              userId,
              entryType: value,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.entryType ?? value;
          }
          if (errors.entryType?.hasError) {
            runValidationTasks("entryType", value);
          }
          setEntryType(value);
        }}
        onBlur={() => runValidationTasks("entryType", entryType)}
        errorMessage={errors.entryType?.errorMessage}
        hasError={errors.entryType?.hasError}
        {...getOverrideProps(overrides, "entryType")}
      >
        <option
          children="User progress"
          value="USER_PROGRESS"
          {...getOverrideProps(overrides, "entryTypeoption0")}
        ></option>
        <option
          children="Assessment result"
          value="ASSESSMENT_RESULT"
          {...getOverrideProps(overrides, "entryTypeoption1")}
        ></option>
        <option
          children="Assessment definition"
          value="ASSESSMENT_DEFINITION"
          {...getOverrideProps(overrides, "entryTypeoption2")}
        ></option>
        <option
          children="Lesson completion"
          value="LESSON_COMPLETION"
          {...getOverrideProps(overrides, "entryTypeoption3")}
        ></option>
        <option
          children="Quiz attempt"
          value="QUIZ_ATTEMPT"
          {...getOverrideProps(overrides, "entryTypeoption4")}
        ></option>
        <option
          children="Course completion"
          value="COURSE_COMPLETION"
          {...getOverrideProps(overrides, "entryTypeoption5")}
        ></option>
        <option
          children="Group activity"
          value="GROUP_ACTIVITY"
          {...getOverrideProps(overrides, "entryTypeoption6")}
        ></option>
        <option
          children="Review"
          value="REVIEW"
          {...getOverrideProps(overrides, "entryTypeoption7")}
        ></option>
        <option
          children="Leaderboard entry"
          value="LEADERBOARD_ENTRY"
          {...getOverrideProps(overrides, "entryTypeoption8")}
        ></option>
        <option
          children="Session log"
          value="SESSION_LOG"
          {...getOverrideProps(overrides, "entryTypeoption9")}
        ></option>
        <option
          children="Achievement unlocked"
          value="ACHIEVEMENT_UNLOCKED"
          {...getOverrideProps(overrides, "entryTypeoption10")}
        ></option>
        <option
          children="Scheduled event"
          value="SCHEDULED_EVENT"
          {...getOverrideProps(overrides, "entryTypeoption11")}
        ></option>
        <option
          children="Knowledge gap"
          value="KNOWLEDGE_GAP"
          {...getOverrideProps(overrides, "entryTypeoption12")}
        ></option>
        <option
          children="Coach interaction"
          value="COACH_INTERACTION"
          {...getOverrideProps(overrides, "entryTypeoption13")}
        ></option>
        <option
          children="Learning analytics"
          value="LEARNING_ANALYTICS"
          {...getOverrideProps(overrides, "entryTypeoption14")}
        ></option>
        <option
          children="Other"
          value="OTHER"
          {...getOverrideProps(overrides, "entryTypeoption15")}
        ></option>
      </SelectField>
      <TextField
        label="Timestamp"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={timestamp && convertToLocal(new Date(timestamp))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              userId,
              entryType,
              timestamp: value,
            };
            const result = onChange(modelFields);
            value = result?.timestamp ?? value;
          }
          if (errors.timestamp?.hasError) {
            runValidationTasks("timestamp", value);
          }
          setTimestamp(value);
        }}
        onBlur={() => runValidationTasks("timestamp", timestamp)}
        errorMessage={errors.timestamp?.errorMessage}
        hasError={errors.timestamp?.hasError}
        {...getOverrideProps(overrides, "timestamp")}
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
