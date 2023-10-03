import { Map, Stack } from "immutable"
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
import {
    MatcherContext,
    OutTableOf,
    SchemaInspector,
    SchemaNodeInspector,
    world,
    ZodFirstPartySchemaTable,
    ZodKindedAny
} from "zod-tools"
import { AnyTypeKind } from "../construction/kinds"
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

export type JsdocHandler = (node: JSDoc) => void
export type MissingDeclHandler = (node: ZsModuleDecl) => TypeReferenceNode

export abstract class ZsSchemaTable extends ZodFirstPartySchemaTable {
    ZsEnum!: ZsEnum
    ZsClass!: ZsClass
    ZsInterface!: ZsInterface
    ZsTypeVar!: ZsTypeVar
    ZsMapVar!: ZsMapVar
    ZsInstantiation!: ZsInstantiation
    ZsTypeAlias!: ZsTypeAlias
    ZsImportedType!: ZsImport
    ZsAccess!: ZsAccess
    ZsFunction!: ZsFunction
    ZsMapped!: ZsMapped
    ZsKeyof!: ZsKeyof
    ZsConditional!: ZsConditional
    ZsIndexedAccess!: ZsLookup
    ZsOverloads!: ZsOverloads
}

export type TypeExprMatcherContext = MatcherContext<
    ZsSchemaTable,
    ZsTypeExpressionTable,
    ZtExpressionMatcher
>
export const ztSchemaWorld = world<ZsSchemaTable>()

export class ZtExpressionMatcher {
    private _jsdocHandlers = Stack<JsdocHandler>()
    private _missingDeclHandlers = Stack<MissingDeclHandler>()
    private _refs = Map<ZodKindedAny, TypeReferenceNode>()

    emitDocumentationNode(node: JSDoc) {
        const top = this._jsdocHandlers.peek()
        if (!top) {
            throw new Error("No jsdoc handler")
        }
        top(node)
    }

    private _emitMissingDeclaration(decl: ZsModuleDecl) {
        const top = this._missingDeclHandlers.peek()
        if (!top) {
            throw new Error("No missing declaration handler")
        }
        return top(decl)
    }

    set(node: ZodKindedAny, type: TypeReferenceNode) {
        const old = this._refs
        this._refs = this._refs.set(node, type)
        return {
            dispose: () => {
                this._refs = old
            }
        }
    }

    get(
        node: ZodKindedAny | SchemaInspector<ZsSchemaTable, keyof ZsSchemaTable>
    ) {
        node = node instanceof SchemaNodeInspector ? node._node : node
        const ref = this._refs.get(node)
        if (ref) {
            return ref
        }
        const decl = this._emitMissingDeclaration(node as ZsModuleDecl)
        this._refs = this._refs.set(node, decl)
        return decl
    }

    onMissingDeclaration(handler: (node: ZsModuleDecl) => TypeReferenceNode) {
        this._missingDeclHandlers = this._missingDeclHandlers.push(handler)
        return {
            dispose: () => {
                this._missingDeclHandlers = this._missingDeclHandlers.pop()
            }
        }
    }

    onDocumentationNode(handler: (node: JSDoc) => void) {
        this._jsdocHandlers = this._jsdocHandlers.push(handler)
        return {
            dispose: () => {
                this._jsdocHandlers = this._jsdocHandlers.pop()
            }
        }
    }
}

export const zsExpressionMatcher = ztSchemaWorld.matcher(ZtExpressionMatcher)

export abstract class ZsTypeExpressionTable
    implements OutTableOf<ZsSchemaTable>
{
    else!: never;
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

export const zsInspect = ztSchemaWorld.inspect
