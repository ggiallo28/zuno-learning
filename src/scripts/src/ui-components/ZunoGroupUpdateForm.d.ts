/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ZunoGroup } from "../api/amplify.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ZunoGroupUpdateFormInputValues = {
    name?: string;
    subjectArea?: string;
    createdBy?: string;
    members?: string[];
};
export declare type ZunoGroupUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    subjectArea?: ValidationFunction<string>;
    createdBy?: ValidationFunction<string>;
    members?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoGroupUpdateFormOverridesProps = {
    ZunoGroupUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    subjectArea?: PrimitiveOverrideProps<TextFieldProps>;
    createdBy?: PrimitiveOverrideProps<TextFieldProps>;
    members?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ZunoGroupUpdateFormProps = React.PropsWithChildren<{
    overrides?: ZunoGroupUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    zunoGroup?: ZunoGroup;
    onSubmit?: (fields: ZunoGroupUpdateFormInputValues) => ZunoGroupUpdateFormInputValues;
    onSuccess?: (fields: ZunoGroupUpdateFormInputValues) => void;
    onError?: (fields: ZunoGroupUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoGroupUpdateFormInputValues) => ZunoGroupUpdateFormInputValues;
    onValidate?: ZunoGroupUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoGroupUpdateForm(props: ZunoGroupUpdateFormProps): React.ReactElement;
