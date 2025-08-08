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
export declare type ZunoCatalogCreateFormInputValues = {
    parentId?: string;
    itemType?: string;
    timestamp?: string;
};
export declare type ZunoCatalogCreateFormValidationValues = {
    parentId?: ValidationFunction<string>;
    itemType?: ValidationFunction<string>;
    timestamp?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoCatalogCreateFormOverridesProps = {
    ZunoCatalogCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    parentId?: PrimitiveOverrideProps<TextFieldProps>;
    itemType?: PrimitiveOverrideProps<SelectFieldProps>;
    timestamp?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ZunoCatalogCreateFormProps = React.PropsWithChildren<{
    overrides?: ZunoCatalogCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ZunoCatalogCreateFormInputValues) => ZunoCatalogCreateFormInputValues;
    onSuccess?: (fields: ZunoCatalogCreateFormInputValues) => void;
    onError?: (fields: ZunoCatalogCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoCatalogCreateFormInputValues) => ZunoCatalogCreateFormInputValues;
    onValidate?: ZunoCatalogCreateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoCatalogCreateForm(props: ZunoCatalogCreateFormProps): React.ReactElement;
