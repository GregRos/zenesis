import { AnyTypeKind } from "../construction/kinds"
import {
    ArrayTypeNode,
    ConditionalTypeNode,
    FunctionTypeNode,
    IndexedAccessTypeNode,
    IntersectionTypeNode,
    KeywordTypeNode,
    LiteralTypeNode,
    MappedTypeNode,
    TupleTypeNode,
    TypeNode,
    TypeOperatorNode,
    TypeReferenceNode,
    UnionTypeNode
} from "typescript"
import {
    AnyZodTuple,
    ZodAny,
    ZodArray,
    ZodBigInt,
    ZodBoolean,
    ZodBranded,
    ZodCatch,
    ZodDate,
    ZodDefault,
    ZodDiscriminatedUnion,
    ZodDiscriminatedUnionOption,
    ZodEnum,
    ZodFunction,
    ZodIntersection,
    ZodLazy,
    ZodLiteral,
    ZodMap,
    ZodNaN,
    ZodNativeEnum,
    ZodNever,
    ZodNull,
    ZodNullable,
    ZodNumber,
    ZodObject,
    ZodOptional,
    ZodPromise,
    ZodRawShape,
    ZodReadonly,
    ZodRecord,
    ZodSet,
    ZodString,
    ZodSymbol,
    ZodTuple,
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid
} from "zod"

import {
    ZsClass,
    ZsInterface,
    ZsTypeVar,
    ZsMapVar,
    ZsInstantiation,
    ZsTypeAlias,
    ZsImport,
    ZsAccess,
    ZsFunction,
    ZsMapped,
    ZsKeyof,
    ZsConditional,
    ZsLookup,
    ZsOverloads
} from "../construction"
import { ZodNamedTypeAny } from "./types"

export type InOut<Z extends ZodNamedTypeAny, T extends TypeNode> = {
    input: Z
    output: T
}

export declare abstract class SchemaToTsNode
    implements Record<AnyTypeKind, InOut<ZodNamedTypeAny, TypeNode>>
{
    [AnyTypeKind.ZodEffects]: never;
    [AnyTypeKind.ZodPipeline]: never;
    [AnyTypeKind.ZodNativeEnum]: never;
    [AnyTypeKind.ZodEnum]: never;

    [AnyTypeKind.ZsClass]: InOut<ZsClass, TypeReferenceNode>;
    [AnyTypeKind.ZsInterface]: InOut<ZsInterface, TypeReferenceNode>;
    [AnyTypeKind.ZsTypeVar]: InOut<ZsTypeVar, TypeReferenceNode>;
    [AnyTypeKind.ZsMapVar]: InOut<ZsMapVar, TypeReferenceNode>;
    [AnyTypeKind.ZsInstantiation]: InOut<ZsInstantiation, TypeReferenceNode>;
    [AnyTypeKind.ZsTypeAlias]: InOut<ZsTypeAlias, TypeReferenceNode>;
    [AnyTypeKind.ZsImportedType]: InOut<ZsImport, TypeReferenceNode>;
    [AnyTypeKind.ZodDate]: InOut<ZodDate, TypeReferenceNode>;
    [AnyTypeKind.ZodPromise]: InOut<
        ZodPromise<ZodNamedTypeAny>,
        TypeReferenceNode
    >;
    [AnyTypeKind.ZodReadonly]: InOut<
        ZodReadonly<ZodNamedTypeAny>,
        TypeReferenceNode
    >;
    [AnyTypeKind.ZodMap]: InOut<ZodMap, TypeReferenceNode>;
    [AnyTypeKind.ZodSet]: InOut<ZodSet, TypeReferenceNode>;
    [AnyTypeKind.ZodRecord]: InOut<ZodRecord, TypeReferenceNode>;
    [AnyTypeKind.ZodLiteral]: InOut<ZodLiteral<any>, LiteralTypeNode>;
    [AnyTypeKind.ZodNull]: InOut<ZodNull, LiteralTypeNode>;
    [AnyTypeKind.ZodNaN]: InOut<ZodNaN, LiteralTypeNode>;
    [AnyTypeKind.ZodUndefined]: InOut<ZodUndefined, KeywordTypeNode>;
    [AnyTypeKind.ZodBoolean]: InOut<ZodBoolean, KeywordTypeNode>;
    [AnyTypeKind.ZodString]: InOut<ZodString, KeywordTypeNode>;
    [AnyTypeKind.ZodNumber]: InOut<ZodNumber, KeywordTypeNode>;
    [AnyTypeKind.ZodBigInt]: InOut<ZodBigInt, KeywordTypeNode>;
    [AnyTypeKind.ZodAny]: InOut<ZodAny, KeywordTypeNode>;
    [AnyTypeKind.ZodUnknown]: InOut<ZodUnknown, KeywordTypeNode>;
    [AnyTypeKind.ZodNever]: InOut<ZodNever, KeywordTypeNode>;
    [AnyTypeKind.ZodVoid]: InOut<ZodVoid, KeywordTypeNode>;
    [AnyTypeKind.ZodSymbol]: InOut<ZodSymbol, KeywordTypeNode>;
    [AnyTypeKind.ZodLazy]: InOut<ZodLazy<ZodNamedTypeAny>, TypeNode>;
    [AnyTypeKind.ZodBranded]: InOut<ZodBranded<ZodNamedTypeAny, any>, TypeNode>;
    [AnyTypeKind.ZodCatch]: InOut<ZodCatch<ZodNamedTypeAny>, TypeNode>;
    [AnyTypeKind.ZodDefault]: InOut<ZodDefault<ZodNamedTypeAny>, TypeNode>;
    [AnyTypeKind.ZsAccess]: InOut<ZsAccess, TypeNode>;
    [AnyTypeKind.ZodOptional]: InOut<
        ZodOptional<ZodNamedTypeAny>,
        UnionTypeNode
    >;
    [AnyTypeKind.ZodUnion]: InOut<
        ZodUnion<[ZodNamedTypeAny, ...ZodNamedTypeAny[]]>,
        UnionTypeNode
    >;
    [AnyTypeKind.ZodDiscriminatedUnion]: InOut<
        ZodDiscriminatedUnion<string, ZodDiscriminatedUnionOption<string>[]>,
        UnionTypeNode
    >;
    [AnyTypeKind.ZodNullable]: InOut<
        ZodNullable<ZodNamedTypeAny>,
        UnionTypeNode
    >;
    [AnyTypeKind.ZsFunction]: InOut<ZsFunction, FunctionTypeNode>;
    [AnyTypeKind.ZodFunction]: InOut<
        ZodFunction<AnyZodTuple, ZodNamedTypeAny>,
        FunctionTypeNode
    >;
    [AnyTypeKind.ZsMapped]: InOut<ZsMapped, MappedTypeNode>;
    [AnyTypeKind.ZsKeyof]: InOut<ZsKeyof, TypeOperatorNode>;
    [AnyTypeKind.ZsConditional]: InOut<ZsConditional, ConditionalTypeNode>;
    [AnyTypeKind.ZsIndexedAccess]: InOut<ZsLookup, IndexedAccessTypeNode>;
    [AnyTypeKind.ZsOverloads]: InOut<ZsOverloads, IntersectionTypeNode>;
    [AnyTypeKind.ZodObject]: InOut<ZodObject<ZodRawShape>, LiteralTypeNode>;
    [AnyTypeKind.ZodTuple]: InOut<AnyZodTuple, TupleTypeNode>;
    [AnyTypeKind.ZodIntersection]: InOut<
        ZodIntersection<ZodNamedTypeAny, ZodNamedTypeAny>,
        IntersectionTypeNode
    >;
    [AnyTypeKind.ZodArray]: InOut<ZodArray<ZodNamedTypeAny>, ArrayTypeNode>
}
