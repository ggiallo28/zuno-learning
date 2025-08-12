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
import { getZunoCatalog } from "../api/graphql/queries";
import { updateZunoCatalog } from "../api/graphql/mutations";
const client = generateClient();
export default function ZunoCatalogUpdateForm(props) {
  const {
    id: idProp,
    zunoCatalog: zunoCatalogModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    parentId: "",
    itemType: "",
    timestamp: "",
  };
  const [parentId, setParentId] = React.useState(initialValues.parentId);
  const [itemType, setItemType] = React.useState(initialValues.itemType);
  const [timestamp, setTimestamp] = React.useState(initialValues.timestamp);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = zunoCatalogRecord
      ? { ...initialValues, ...zunoCatalogRecord }
      : initialValues;
    setParentId(cleanValues.parentId);
    setItemType(cleanValues.itemType);
    setTimestamp(cleanValues.timestamp);
    setErrors({});
  };
  const [zunoCatalogRecord, setZunoCatalogRecord] =
    React.useState(zunoCatalogModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getZunoCatalog.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getZunoCatalog
        : zunoCatalogModelProp;
      setZunoCatalogRecord(record);
    };
    queryData();
  }, [idProp, zunoCatalogModelProp]);
  React.useEffect(resetStateValues, [zunoCatalogRecord]);
  const validations = {
    parentId: [],
    itemType: [{ type: "Required" }],
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
          parentId: parentId ?? null,
          itemType,
          timestamp: timestamp ?? null,
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
            query: updateZunoCatalog.replaceAll("__typename", ""),
            variables: {
              input: {
                id: zunoCatalogRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ZunoCatalogUpdateForm")}
      {...rest}
    >
      <TextField
        label="Parent id"
        isRequired={false}
        isReadOnly={false}
        value={parentId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              parentId: value,
              itemType,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.parentId ?? value;
          }
          if (errors.parentId?.hasError) {
            runValidationTasks("parentId", value);
          }
          setParentId(value);
        }}
        onBlur={() => runValidationTasks("parentId", parentId)}
        errorMessage={errors.parentId?.errorMessage}
        hasError={errors.parentId?.hasError}
        {...getOverrideProps(overrides, "parentId")}
      ></TextField>
      <SelectField
        label="Item type"
        placeholder="Please select an option"
        isDisabled={false}
        value={itemType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              parentId,
              itemType: value,
              timestamp,
            };
            const result = onChange(modelFields);
            value = result?.itemType ?? value;
          }
          if (errors.itemType?.hasError) {
            runValidationTasks("itemType", value);
          }
          setItemType(value);
        }}
        onBlur={() => runValidationTasks("itemType", itemType)}
        errorMessage={errors.itemType?.errorMessage}
        hasError={errors.itemType?.hasError}
        {...getOverrideProps(overrides, "itemType")}
      >
        <option
          children="Course"
          value="COURSE"
          {...getOverrideProps(overrides, "itemTypeoption0")}
        ></option>
        <option
          children="Quiz"
          value="QUIZ"
          {...getOverrideProps(overrides, "itemTypeoption1")}
        ></option>
        <option
          children="Lesson"
          value="LESSON"
          {...getOverrideProps(overrides, "itemTypeoption2")}
        ></option>
        <option
          children="Coach"
          value="COACH"
          {...getOverrideProps(overrides, "itemTypeoption3")}
        ></option>
        <option
          children="Achievement"
          value="ACHIEVEMENT"
          {...getOverrideProps(overrides, "itemTypeoption4")}
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
              parentId,
              itemType,
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
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || zunoCatalogModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || zunoCatalogModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
