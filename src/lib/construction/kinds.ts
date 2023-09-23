import { ZodTypeKind } from "./zod-kind"

export enum ZsTypeKind {
    ZsIndexedAccess = "ZsIndexedAccess",
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
    ZsKeyof = "ZsKeyof",
    ZsImportedType = "ZsImportedType",
    ZsEnum = "ZsEnum"
}

export type AnyTypeKind = ZsTypeKind | ZodTypeKind
export const AnyTypeKind = {
    ...ZodTypeKind,
    ...ZsTypeKind
} as const

export enum ZsClassDeclKind {
    ZsImplements = "ZsImplements",
    ZsField = "ZsField",
    ZsMethod = "ZsMethod",
    ZsIndexer = "ZsIndexer",
    ZsConstructor = "ZsConstructor"
}

export enum ZsModuleDeclKind {
    ZsValue = "ZsValue"
}
