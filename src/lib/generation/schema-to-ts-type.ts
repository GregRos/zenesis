import { AnyKind } from "../construction/kinds"
import {
    ArrayTypeNode,
    ConditionalTypeNode,
    FunctionTypeNode,
    IndexedAccessTypeNode,
    IntersectionTypeNode,
    KeywordTypeNode,
    LiteralTypeNode,
    MappedTypeNode,
    MethodDeclaration,
    ObjectType,
    TupleTypeNode,
    TypeNode,
    TypeOperatorNode,
    TypeReferenceNode,
    UnionTypeNode
} from "typescript"
import { AnyTypeSchema, ZodNameOf } from "../zod-walker/types"

export declare class Blah implements Record<AnyKind, TypeNode> {
    //! Not supported
    [AnyKind.ZodEffects]: never;
    [AnyKind.ZodPipeline]: never;

    //! Declared reference nodes
    [AnyKind.ZsClass]: TypeReferenceNode;
    [AnyKind.ZsEnum]: TypeReferenceNode;
    [AnyKind.ZsInterface]: TypeReferenceNode;
    [AnyKind.ZsTypeVar]: TypeReferenceNode;
    [AnyKind.ZsMapVar]: TypeReferenceNode;
    [AnyKind.ZsInstantiation]: TypeReferenceNode;
    [AnyKind.ZodEnum]: TypeReferenceNode;
    [AnyKind.ZodNativeEnum]: TypeReferenceNode;
    [AnyKind.ZsTypeAlias]: TypeReferenceNode;
    [AnyKind.ZsImportedType]: TypeReferenceNode;

    //! Built-in reference nodes
    [AnyKind.ZodDate]: TypeReferenceNode;
    [AnyKind.ZodPromise]: TypeReferenceNode;
    [AnyKind.ZodReadonly]: TypeReferenceNode;
    [AnyKind.ZodMap]: TypeReferenceNode;
    [AnyKind.ZodSet]: TypeReferenceNode;
    [AnyKind.ZodRecord]: TypeReferenceNode;

    //! Zod literal nodes
    [AnyKind.ZodLiteral]: LiteralTypeNode;
    [AnyKind.ZodNull]: LiteralTypeNode;
    [AnyKind.ZodNaN]: LiteralTypeNode;

    //! Zod keyword type nodes
    [AnyKind.ZodUndefined]: KeywordTypeNode;
    [AnyKind.ZodBoolean]: KeywordTypeNode;
    [AnyKind.ZodString]: KeywordTypeNode;
    [AnyKind.ZodNumber]: KeywordTypeNode;
    [AnyKind.ZodBigInt]: KeywordTypeNode;
    [AnyKind.ZodAny]: KeywordTypeNode;
    [AnyKind.ZodUnknown]: KeywordTypeNode;
    [AnyKind.ZodNever]: KeywordTypeNode;
    [AnyKind.ZodVoid]: KeywordTypeNode;
    [AnyKind.ZodSymbol]: KeywordTypeNode;

    //! Zod passthrough nodes
    [AnyKind.ZodLazy]: TypeNode;
    [AnyKind.ZodBranded]: TypeNode;
    [AnyKind.ZodCatch]: TypeNode;
    [AnyKind.ZodDefault]: TypeNode;

    //! Zod union types
    [AnyKind.ZodOptional]: UnionTypeNode;
    [AnyKind.ZodUnion]: UnionTypeNode;
    [AnyKind.ZodDiscriminatedUnion]: UnionTypeNode;
    [AnyKind.ZodNullable]: UnionTypeNode;

    //! Function nodes
    [AnyKind.ZsFunction]: FunctionTypeNode;
    [AnyKind.ZodFunction]: FunctionTypeNode;
    [AnyKind.ZsGenericFunction]: FunctionTypeNode;

    //! Zenesis type constructions
    [AnyKind.ZsMapped]: MappedTypeNode;
    [AnyKind.ZsKeyof]: TypeOperatorNode;
    [AnyKind.ZsConditional]: ConditionalTypeNode;
    [AnyKind.ZsIndexedAccess]: IndexedAccessTypeNode;
    [AnyKind.ZsOverloads]: IntersectionTypeNode;

    //! Zod type constructions
    [AnyKind.ZodObject]: LiteralTypeNode;
    [AnyKind.ZodTuple]: TupleTypeNode;
    [AnyKind.ZodIntersection]: IntersectionTypeNode;
    [AnyKind.ZodArray]: ArrayTypeNode
}
