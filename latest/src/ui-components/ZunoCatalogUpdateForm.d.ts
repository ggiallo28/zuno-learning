/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ZunoCatalog } from "../api/amplify.ts";
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
export declare type ZunoCatalogUpdateFormInputValues = {
    parentId?: string;
    itemType?: string;
};
export declare type ZunoCatalogUpdateFormValidationValues = {
    parentId?: ValidationFunction<string>;
    itemType?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ZunoCatalogUpdateFormOverridesProps = {
    ZunoCatalogUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    parentId?: PrimitiveOverrideProps<TextFieldProps>;
    itemType?: PrimitiveOverrideProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type ZunoCatalogUpdateFormProps = React.PropsWithChildren<{
    overrides?: ZunoCatalogUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    zunoCatalog?: ZunoCatalog;
    onSubmit?: (fields: ZunoCatalogUpdateFormInputValues) => ZunoCatalogUpdateFormInputValues;
    onSuccess?: (fields: ZunoCatalogUpdateFormInputValues) => void;
    onError?: (fields: ZunoCatalogUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ZunoCatalogUpdateFormInputValues) => ZunoCatalogUpdateFormInputValues;
    onValidate?: ZunoCatalogUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ZunoCatalogUpdateForm(props: ZunoCatalogUpdateFormProps): React.ReactElement;
