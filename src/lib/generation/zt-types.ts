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
    TupleTypeNode,
    TypeLiteralNode,
    TypeNode,
    TypeOperatorNode,
    TypeReferenceNode,
    TypeReferenceType,
    UnionTypeNode
} from "typescript"
import { ZsModuleDecl } from "../construction/module-declarations/module-fragment"
import { OutTableOf, world, ZodFirstPartySchemaTable } from "zod-tools"
import { AnyTypeKind, ZsTypeKind } from "../construction/kinds"
import {
    ZsAccess,
    ZsClass,
    ZsConditional,
    ZsEnum,
    ZsFunction,
    ZsImport,
    ZsInstantiation,
    ZsInterface,
    ZsKeyof,
    ZsLookup,
    ZsMapped,
    ZsMapVar,
    ZsOverloads,
    ZsTypeAlias,
    ZsTypeVar
} from "../construction"

export type JsDocHandler = (node: JSDoc) => void
export type MissingDeclHandler = (node: ZsModuleDecl) => TypeReferenceNode

export const zsSchemaDomain = world<ZsSchemaTable>()

export const zsInspect = zsSchemaDomain.inspect

export abstract class ZsSchemaTable extends ZodFirstPartySchemaTable {
    [ZsTypeKind.ZsEnum]!: ZsEnum;
    [ZsTypeKind.ZsClass]!: ZsClass;
    [ZsTypeKind.ZsInterface]!: ZsInterface;
    [ZsTypeKind.ZsTypeVar]!: ZsTypeVar;
    [ZsTypeKind.ZsMapVar]!: ZsMapVar;
    [ZsTypeKind.ZsInstantiation]!: ZsInstantiation;
    [ZsTypeKind.ZsTypeAlias]!: ZsTypeAlias;
    [ZsTypeKind.ZsImportedType]!: ZsImport;
    [ZsTypeKind.ZsAccess]!: ZsAccess;
    [ZsTypeKind.ZsFunction]!: ZsFunction;
    [ZsTypeKind.ZsMapped]!: ZsMapped;
    [ZsTypeKind.ZsKeyof]!: ZsKeyof;
    [ZsTypeKind.ZsConditional]!: ZsConditional;
    [ZsTypeKind.ZsIndexedAccess]!: ZsLookup;
    [ZsTypeKind.ZsOverloads]!: ZsOverloads
}

export abstract class ZsTypeExpressionTable
    implements OutTableOf<ZsSchemaTable>
{
    else!: TypeNode;
    [AnyTypeKind.ZodEffects]!: never;
    [AnyTypeKind.ZodPipeline]!: never;
    [AnyTypeKind.ZodNativeEnum]!: UnionTypeNode;
    [AnyTypeKind.ZodEnum]!: UnionTypeNode;
    [AnyTypeKind.ZsEnum]!: TypeReferenceType;
    [AnyTypeKind.ZsClass]!: TypeReferenceNode;
    [AnyTypeKind.ZsInterface]!: TypeReferenceNode;
    [AnyTypeKind.ZsTypeVar]!: TypeReferenceNode;
    [AnyTypeKind.ZsMapVar]!: TypeReferenceNode;
    [AnyTypeKind.ZsInstantiation]!: TypeReferenceNode;
    [AnyTypeKind.ZsTypeAlias]!: TypeReferenceNode;
    [AnyTypeKind.ZsImportedType]!: TypeReferenceNode;
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
    [AnyTypeKind.ZsAccess]!: TypeNode;
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
