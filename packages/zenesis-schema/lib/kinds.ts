import { ZodFirstPartyTypeKind } from "zod"

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
    ZsEnum = "ZsEnum",
    ZsGenericType = "ZsGenericType",
    ZsAstExpr = "ZsAstExpr",
    ZsZenesisImport = "ZsZenesisImport",
    ZsZenesisGenericImport = "ZsZenesisGenericImport",
    ZsForeignImport = "ZsZoreignImport"
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
