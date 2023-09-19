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

export enum ZsClassDeclKind {
    ZsImplements = "ZsImplements",
    ZsField = "ZsField",
    ZsMethod = "ZsMethod",
    ZsIndexer = "ZsIndexer",
    ZsConstructor = "ZsConstructor"
}

export interface ZsClass

export enum ZsNodeKind {
    ZsNode = "ZsNode",
    ZsMember = "ZsMember",
    ZsMethod = "ZsMethod",
    ZsOverloads = "ZsOverloads",
    ZsValue = "ZsValue",
    ZsGeneric = "ZsGeneric",
    ZsImportedGeneric = "ZsImportedGeneric",
    ZsImplements = "ZsImplements",
    ZsField = "ZsField",
}
