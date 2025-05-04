import { ZodFirstPartyTypeKind } from "zod"

export enum ZsTypeKind {
    ZsLookup = "ZsIndexedAccess",
    ZsOverloads = "ZsOverloads",
    ZsClass = "ZsClass",
    ZsInterface = "ZsInterface",
    ZsTypeAlias = "ZsTypeAlias",
    ZsFunction = "ZsFunction",
    ZsIf = "ZsIf",
    ZsTypeArg = "ZsTypeVarRef",
    ZsMapped = "ZsMapped",
    ZsMappingKeyRef = "ZsMappingKeyRef",
    ZsKeyof = "ZsKeyof",
    ZsEnum = "ZsEnum",
    ZsAstExpr = "ZsAstExpr",
    ZsForeignImport = "ZsZoreignImport",
    ZsGenericFunction = "ZsGenericFunction",
    ZsThis = "ZsThis",
    ZsInferredTypeRef = "ZsInferredTypeRef"
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
