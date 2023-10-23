import { ZodFirstPartyTypeKind } from "zod"
import { ZsGenericType } from "./generic/generic-type"

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
    ZsEnum = "ZsEnum",
    ZsGenericType = "ZsGenericType",
    ZsValue = "ZsValue"
}

export type AnyTypeKind = ZsTypeKind | ZodFirstPartyTypeKind
export const AnyTypeKind = {
    ...ZodFirstPartyTypeKind,
    ...ZsTypeKind
} as const

export enum ZsClassDeclKind {
    ZsImplements = "ZsImplements",
    ZsClassMember = "ZsClassMember",
    ZsMethod = "ZsMethod",
    ZsIndexer = "ZsIndexer",
    ZsConstructor = "ZsConstructor"
}
