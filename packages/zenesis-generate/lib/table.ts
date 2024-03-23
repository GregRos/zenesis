import {
    ArrayTypeNode,
    ConditionalTypeNode,
    FunctionTypeNode,
    IndexedAccessTypeNode,
    IntersectionTypeNode,
    JSDoc,
    KeywordTypeNode,
    LiteralTypeNode,
    MappedTypeNode,
    ThisTypeNode,
    TupleTypeNode,
    TypeLiteralNode,
    TypeNode,
    TypeOperatorNode,
    TypeReferenceNode,
    TypeReferenceType,
    UnionTypeNode
} from "typescript"

import { AnyTypeKind, ZodKindedAny } from "@zenesis/schema"
export type JsDocHandler = (node: JSDoc) => void
export type MissingDeclHandler = (node: ZodKindedAny) => TypeReferenceNode

export abstract class ZsTsTable {
    [AnyTypeKind.ZsZenesisImport]!: TypeReferenceNode;
    [AnyTypeKind.ZsGenericFunction]!: FunctionTypeNode;
    [AnyTypeKind.ZsThis]!: ThisTypeNode;
    [AnyTypeKind.ZsSelfref]!: TypeReferenceNode;
    [AnyTypeKind.ZodEffects]!: never;
    [AnyTypeKind.ZodPipeline]!: never;
    [AnyTypeKind.ZodNativeEnum]!: UnionTypeNode;
    [AnyTypeKind.ZodEnum]!: UnionTypeNode;
    [AnyTypeKind.ZsEnum]!: TypeReferenceType;
    [AnyTypeKind.ZsClass]!: TypeReferenceNode;
    [AnyTypeKind.ZsInterface]!: TypeReferenceNode;
    [AnyTypeKind.ZsTypeVarRef]!: TypeReferenceNode;
    [AnyTypeKind.ZsMappingKeyRef]!: TypeReferenceNode;
    [AnyTypeKind.ZsInstantiation]!: TypeReferenceNode;
    [AnyTypeKind.ZsTypeAlias]!: TypeReferenceNode;
    [AnyTypeKind.ZsForeignImport]!: TypeReferenceNode;
    [AnyTypeKind.ZodDate]!: TypeReferenceNode;
    [AnyTypeKind.ZodPromise]!: TypeReferenceNode;
    [AnyTypeKind.ZodReadonly]!: TypeReferenceNode;
    [AnyTypeKind.ZodMap]!: TypeReferenceNode;
    [AnyTypeKind.ZodSet]!: TypeReferenceNode;
    [AnyTypeKind.ZodRecord]!: TypeReferenceNode;
    [AnyTypeKind.ZodLiteral]!: LiteralTypeNode;
    [AnyTypeKind.ZodNull]!: LiteralTypeNode;
    [AnyTypeKind.ZodNaN]!: LiteralTypeNode;
    [AnyTypeKind.ZodUndefined]!: KeywordTypeNode;
    [AnyTypeKind.ZodBoolean]!: KeywordTypeNode;
    [AnyTypeKind.ZodString]!: KeywordTypeNode;
    [AnyTypeKind.ZodNumber]!: KeywordTypeNode;
    [AnyTypeKind.ZodBigInt]!: KeywordTypeNode;
    [AnyTypeKind.ZodAny]!: KeywordTypeNode;
    [AnyTypeKind.ZodUnknown]!: KeywordTypeNode;
    [AnyTypeKind.ZodNever]!: KeywordTypeNode;
    [AnyTypeKind.ZodVoid]!: KeywordTypeNode;
    [AnyTypeKind.ZodSymbol]!: KeywordTypeNode;
    [AnyTypeKind.ZodLazy]!: TypeNode;
    [AnyTypeKind.ZodBranded]!: TypeNode;
    [AnyTypeKind.ZodCatch]!: TypeNode;
    [AnyTypeKind.ZodDefault]!: TypeNode;
    [AnyTypeKind.ZodOptional]!: UnionTypeNode;
    [AnyTypeKind.ZodUnion]!: UnionTypeNode;
    [AnyTypeKind.ZodDiscriminatedUnion]!: UnionTypeNode;
    [AnyTypeKind.ZodNullable]!: UnionTypeNode;
    [AnyTypeKind.ZsFunction]!: FunctionTypeNode;
    [AnyTypeKind.ZodFunction]!: FunctionTypeNode;
    [AnyTypeKind.ZsMapped]!: MappedTypeNode;
    [AnyTypeKind.ZsKeyof]!: TypeOperatorNode;
    [AnyTypeKind.ZsConditional]!: ConditionalTypeNode;
    [AnyTypeKind.ZsIndexedAccess]!: IndexedAccessTypeNode;
    [AnyTypeKind.ZsOverloads]!: TypeLiteralNode;
    [AnyTypeKind.ZodObject]!: TypeLiteralNode;
    [AnyTypeKind.ZodTuple]!: TupleTypeNode;
    [AnyTypeKind.ZodIntersection]!: IntersectionTypeNode;
    [AnyTypeKind.ZodArray]!: ArrayTypeNode
}
