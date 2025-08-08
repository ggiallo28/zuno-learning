/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ZunoEntry } from "../api/amplify.ts";
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
export declare type ZunoEntryUpdateFormInputValues = {
    userId?: string;
    entryType?: string;
    timestamp?: string;
};
export declare type ZunoEntryUpdateFormValidationValues = {
    userId?: ValidationFunction<string>;
    entryType?: ValidationFunction<string>;
    timestamp?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoEntryUpdateFormOverridesProps = {
    ZunoEntryUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    entryType?: PrimitiveOverrideProps<SelectFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ZunoEntryUpdateFormProps = React.PropsWithChildren<{
    overrides?: ZunoEntryUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    zunoEntry?: ZunoEntry;
    onSubmit?: (fields: ZunoEntryUpdateFormInputValues) => ZunoEntryUpdateFormInputValues;
    onSuccess?: (fields: ZunoEntryUpdateFormInputValues) => void;
    onError?: (fields: ZunoEntryUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoEntryUpdateFormInputValues) => ZunoEntryUpdateFormInputValues;
    onValidate?: ZunoEntryUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoEntryUpdateForm(props: ZunoEntryUpdateFormProps): React.ReactElement;
