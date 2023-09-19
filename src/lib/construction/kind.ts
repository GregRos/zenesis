import { ZodFirstPartyTypeKind } from "zod";

export enum ZsTypeKind {
    TypeAlias = "ZsTypeAlias",
    Interface = "ZsInterface",
    Class = "ZsClass",
    Function = "ZsFunction",
    Conditional = "ZsConditional",
    Keyof = "ZsKeyof",
    Typeof = "ZsTypeof",
    Mapped = "ZsMapped",
    ObjectExpr = "ZsObject",
    TypeVar = "ZsTypeVar",
    MapVar = "ZsMapVar",
    Instantiation = "ZsInstantiation",
    GenericFunction = "ZsGenericFunction",
    Overloads = "ZsOverloads",
    ImportedType = "ZsImportedType",
    TypeRef = "ZsCommonTypeRef"
}

export enum ZsNodeKind {
    Value = "ZsValue",
    Member = "ZsMember",
    Generic = "ZsGeneric",
    ImportedGeneric = "ZsImportedGeneric"
}

export const AnyKind = {
    ...ZodFirstPartyTypeKind,
    ...ZsTypeKind
};
export type AnyKind = ZsTypeKind | ZodFirstPartyTypeKind;
