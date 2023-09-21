import { ZodTypeKind } from "./zod-kind";

export enum ZsTypeKind {
    ZsOverloads = "ZsOverloads",
    ZsClass = "ZsClass",
    ZsInterface = "ZsInterface",
    ZsTypeAlias = "ZsTypeAlias",
    ZsFunction = "ZsFunction",
    ZsConditional = "ZsConditional",
    ZsGenericFunction = "ZsGenericFunction",
    ZsTypeVar = "ZsTypeVar",
    ZsMapped = "ZsMapped",
    ZsMapVar = "ZsMapVar",
    ZsInstantiation = "ZsInstantiation",
    ZsObjectExpr = "ZsObjectExpr",
    ZsTypeof = "ZsTypeof",
    ZsKeyof = "ZsKeyof",
    ZsImportedType = "ZsImportedType",
    ZsEnum = "ZsEnum",
    GenericZsType = "GenericZsType",
    GenericZsImportedType = "GenericZsImportedType"
}

export type AnyKind = ZsTypeKind | ZodTypeKind;
export const AnyKind = {
    ...ZodTypeKind,
    ...ZsTypeKind
} as const;

export enum ZsClassDeclKind {
    ZsImplements = "ZsImplements",
    ZsField = "ZsField",
    ZsMethod = "ZsMethod",
    ZsIndexer = "ZsIndexer",
    ZsConstructor = "ZsConstructor"
}

export enum ZsTypeCtorKind {}

export enum ZsModuleDeclKind {
    ZsValue = "ZsValue"
}
