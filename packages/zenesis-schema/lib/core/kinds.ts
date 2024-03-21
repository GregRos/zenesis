import { ZodFirstPartyTypeKind } from "zod"

export enum ZsTypeKind {
    ZsIndexedAccess = "ZsIndexedAccess",
    ZsOverloads = "ZsOverloads",
    ZsClass = "ZsClass",
    ZsInterface = "ZsInterface",
    ZsTypeAlias = "ZsTypeAlias",
    ZsFunction = "ZsFunction",
    ZsConditional = "ZsConditional",
    ZsTypeArg = "ZsTypeArg",
    ZsMapped = "ZsMapped",
    ZsMapArg = "ZsMapArg",
    ZsInstantiation = "ZsInstantiation",
    ZsKeyof = "ZsKeyof",
    ZsEnum = "ZsEnum",
    ZsGenericType = "ZsGenericType",
    ZsAstExpr = "ZsAstExpr",
    ZsZenesisImport = "ZsZenesisImport",
    ZsZenesisGenericImport = "ZsZenesisGenericImport",
    ZsForeignImport = "ZsZoreignImport",
    ZsForallFunction = "ZsForallFunction",
    ZsThis = "ZsThis",
    ZsZenesisSelf = "ZsZenesisSelf",
    ZsScopedObject = "ZsScopedObject"
}

export type AnyTypeKind = ZsTypeKind | ZodFirstPartyTypeKind
export const AnyTypeKind = {
    ...ZodFirstPartyTypeKind,
    ...ZsTypeKind
} as const

export enum ZsModuleKind {
    ZsFile = "ZsFile",
    ZsNamespace = "ZsNamespace",
    ZsImportAny = "ZsImportAny",
    ZsForeign = "ZsImport"
}
