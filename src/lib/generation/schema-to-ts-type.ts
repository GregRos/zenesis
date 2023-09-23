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

export declare class Blah implements Record<AnyTypeKind, TypeNode> {
    //! Not supported
    [AnyTypeKind.ZodEffects]: never;
    [AnyTypeKind.ZodPipeline]: never;

    //! Declared reference nodes
    [AnyTypeKind.ZsClass]: TypeReferenceNode;
    [AnyTypeKind.ZsEnum]: TypeReferenceNode;
    [AnyTypeKind.ZsInterface]: TypeReferenceNode;
    [AnyTypeKind.ZsTypeVar]: TypeReferenceNode;
    [AnyTypeKind.ZsMapVar]: TypeReferenceNode;
    [AnyTypeKind.ZsInstantiation]: TypeReferenceNode;
    [AnyTypeKind.ZodEnum]: TypeReferenceNode;
    [AnyTypeKind.ZodNativeEnum]: TypeReferenceNode;
    [AnyTypeKind.ZsTypeAlias]: TypeReferenceNode;
    [AnyTypeKind.ZsImportedType]: TypeReferenceNode;

    //! Built-in reference nodes
    [AnyTypeKind.ZodDate]: TypeReferenceNode;
    [AnyTypeKind.ZodPromise]: TypeReferenceNode;
    [AnyTypeKind.ZodReadonly]: TypeReferenceNode;
    [AnyTypeKind.ZodMap]: TypeReferenceNode;
    [AnyTypeKind.ZodSet]: TypeReferenceNode;
    [AnyTypeKind.ZodRecord]: TypeReferenceNode;

    //! Zod literal nodes
    [AnyTypeKind.ZodLiteral]: LiteralTypeNode;
    [AnyTypeKind.ZodNull]: LiteralTypeNode;
    [AnyTypeKind.ZodNaN]: LiteralTypeNode;

    //! Zod keyword type nodes
    [AnyTypeKind.ZodUndefined]: KeywordTypeNode;
    [AnyTypeKind.ZodBoolean]: KeywordTypeNode;
    [AnyTypeKind.ZodString]: KeywordTypeNode;
    [AnyTypeKind.ZodNumber]: KeywordTypeNode;
    [AnyTypeKind.ZodBigInt]: KeywordTypeNode;
    [AnyTypeKind.ZodAny]: KeywordTypeNode;
    [AnyTypeKind.ZodUnknown]: KeywordTypeNode;
    [AnyTypeKind.ZodNever]: KeywordTypeNode;
    [AnyTypeKind.ZodVoid]: KeywordTypeNode;
    [AnyTypeKind.ZodSymbol]: KeywordTypeNode;

    //! Zod passthrough nodes
    [AnyTypeKind.ZodLazy]: TypeNode;
    [AnyTypeKind.ZodBranded]: TypeNode;
    [AnyTypeKind.ZodCatch]: TypeNode;
    [AnyTypeKind.ZodDefault]: TypeNode;

    //! Zod union types
    [AnyTypeKind.ZodOptional]: UnionTypeNode;
    [AnyTypeKind.ZodUnion]: UnionTypeNode;
    [AnyTypeKind.ZodDiscriminatedUnion]: UnionTypeNode;
    [AnyTypeKind.ZodNullable]: UnionTypeNode;

    //! Function nodes
    [AnyTypeKind.ZsFunction]: FunctionTypeNode;
    [AnyTypeKind.ZodFunction]: FunctionTypeNode;
    [AnyTypeKind.ZsGenericFunction]: FunctionTypeNode;

    //! Zenesis type constructions
    [AnyTypeKind.ZsMapped]: MappedTypeNode;
    [AnyTypeKind.ZsKeyof]: TypeOperatorNode;
    [AnyTypeKind.ZsConditional]: ConditionalTypeNode;
    [AnyTypeKind.ZsIndexedAccess]: IndexedAccessTypeNode;
    [AnyTypeKind.ZsOverloads]: IntersectionTypeNode;

    //! Zod type constructions
    [AnyTypeKind.ZodObject]: LiteralTypeNode;
    [AnyTypeKind.ZodTuple]: TupleTypeNode;
    [AnyTypeKind.ZodIntersection]: IntersectionTypeNode;
    [AnyTypeKind.ZodArray]: ArrayTypeNode
}
