/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ZunoEntryCreateFormInputValues = {
    userId?: string;
    entryType?: string;
    timestamp?: string;
};
export declare type ZunoEntryCreateFormValidationValues = {
    userId?: ValidationFunction<string>;
    entryType?: ValidationFunction<string>;
    timestamp?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoEntryCreateFormOverridesProps = {
    ZunoEntryCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    entryType?: PrimitiveOverrideProps<SelectFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ZunoEntryCreateFormProps = React.PropsWithChildren<{
    overrides?: ZunoEntryCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ZunoEntryCreateFormInputValues) => ZunoEntryCreateFormInputValues;
    onSuccess?: (fields: ZunoEntryCreateFormInputValues) => void;
    onError?: (fields: ZunoEntryCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoEntryCreateFormInputValues) => ZunoEntryCreateFormInputValues;
    onValidate?: ZunoEntryCreateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoEntryCreateForm(props: ZunoEntryCreateFormProps): React.ReactElement;
