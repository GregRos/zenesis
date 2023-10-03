import { ZodTypeKind } from "./zod-kind"

export enum ZsTypeKind {
    ZsIndexedAccess = "ZsIndexedAccess",
    ZsOverloads = "ZsOverloads",
    ZsClass = "ZsClass",
    ZsInterface = "ZsInterface",
    ZsTypeAlias = "ZsTypeAlias",
    ZsFunction = "ZsFunction",
    ZsConditional = "ZsConditional",
    ZsTypeVar = "ZsTypeVar",
    ZsMapped = "ZsMapped",
    ZsMapVar = "ZsMapVar",
    ZsInstantiation = "ZsInstantiation",
    ZsKeyof = "ZsKeyof",
    ZsImportedType = "ZsImportedType",
    ZsAccess = "ZsAccess",
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
