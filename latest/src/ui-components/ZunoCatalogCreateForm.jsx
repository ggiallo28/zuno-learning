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
import { createZunoCatalog } from "../graphql/mutations";
const client = generateClient();
export default function ZunoCatalogCreateForm(props) {
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
    parentId: "",
    itemType: "",
  };
  const [parentId, setParentId] = React.useState(initialValues.parentId);
  const [itemType, setItemType] = React.useState(initialValues.itemType);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setParentId(initialValues.parentId);
    setItemType(initialValues.itemType);
    setErrors({});
  };
  const validations = {
    parentId: [],
    itemType: [{ type: "Required" }],
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
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          parentId,
          itemType,
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
            query: createZunoCatalog.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ZunoCatalogCreateForm")}
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
          children="Lesson"
          value="LESSON"
          {...getOverrideProps(overrides, "itemTypeoption1")}
        ></option>
        <option
          children="Quiz"
          value="QUIZ"
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
