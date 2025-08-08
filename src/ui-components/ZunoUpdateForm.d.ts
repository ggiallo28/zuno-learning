/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Zuno } from "../api/amplify.ts";
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
export declare type ZunoUpdateFormInputValues = {
    entityType?: string;
    userId?: string;
    subject?: string;
    metadata?: string;
    rawContent?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type ZunoUpdateFormValidationValues = {
    entityType?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    subject?: ValidationFunction<string>;
    metadata?: ValidationFunction<string>;
    rawContent?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoUpdateFormOverridesProps = {
    ZunoUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    entityType?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    subject?: PrimitiveOverrideProps<TextFieldProps>;
    metadata?: PrimitiveOverrideProps<TextAreaFieldProps>;
    rawContent?: PrimitiveOverrideProps<TextAreaFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ZunoUpdateFormProps = React.PropsWithChildren<{
    overrides?: ZunoUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    zuno?: Zuno;
    onSubmit?: (fields: ZunoUpdateFormInputValues) => ZunoUpdateFormInputValues;
    onSuccess?: (fields: ZunoUpdateFormInputValues) => void;
    onError?: (fields: ZunoUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoUpdateFormInputValues) => ZunoUpdateFormInputValues;
    onValidate?: ZunoUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoUpdateForm(props: ZunoUpdateFormProps): React.ReactElement;
