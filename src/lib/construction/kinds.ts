import { ZodFirstPartyTypeKind } from "zod";

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
    ZsImportedGeneric = "ZsImportedGeneric"
}

export type AnyTypeKind = ZsTypeKind | ZodFirstPartyTypeKind;
export const AnyTypeKind = {
    ...ZodFirstPartyTypeKind,
    ...ZsTypeKind
};

export enum ZsNodeKind {
    ZsNode = "ZsNode",
    ZsMember = "ZsMember",
    ZsOverloads = "ZsOverloads",
    ZsValue = "ZsValue",
    ZsGeneric = "ZsGeneric",
    ZsImportedGeneric = "ZsImportedGeneric"
}
