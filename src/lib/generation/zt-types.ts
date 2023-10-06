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
    MethodSignature,
    Modifier,
    ParameterDeclaration,
    PropertySignature,
    QuestionToken,
    SyntaxKind,
    TupleTypeNode,
    TypeLiteralNode,
    TypeNode,
    TypeOperatorNode,
    TypeParameterDeclaration,
    TypeReferenceNode,
    TypeReferenceType,
    UnionTypeNode
} from "typescript"
import { ZsModuleDecl } from "../construction/module-declarations/module-fragment"
import {
    BaseContext,
    BaseContextDef,
    OutTableOf,
    Recurse,
    SchemaInspector,
    SchemaNodeInspector,
    world,
    ZodFirstPartySchemaTable,
    ZodKindedAny
} from "zod-tools"
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
import { tf } from "./tf"
import { zsTypeExprMatcher } from "./expressions/matcher"
import { ZsClassMember } from "../construction/class-declarations/field"
import { extractModifiers } from "./extract-modifiers"
import { AnyZodTuple, ZodFunctionDef, ZodRawShape, ZodTypeAny } from "zod"
import { getParamInfo } from "./get-param-info"
import { getAccess, toVarianceToken } from "./expressions/tokens"

export type JsdocHandler = (node: JSDoc) => void
export type MissingDeclHandler = (node: ZsModuleDecl) => TypeReferenceNode

function createMethodSignature(
    modifiers: Modifier[],
    questionToken: QuestionToken | undefined,
    name: string
) {
    return (
        typeArgs: TypeParameterDeclaration[] | undefined,
        args: ParameterDeclaration[],
        returns: TypeNode
    ) => {
        return tf.createMethodSignature(
            modifiers,
            name,
            questionToken,
            typeArgs,
            args,
            returns
        )
    }
}

export const ztSchemaWorld = world<ZsSchemaTable>()

export interface TypeExprMatcherStateDef extends BaseContextDef<ZsSchemaTable> {
    readonly _jsdocHandler?: JsdocHandler
    readonly _getExternal?: MissingDeclHandler
    readonly _refs: Map<ZodKindedAny, TypeReferenceNode>
}

export class ScopedZtMatcherState extends BaseContext<
    ZsSchemaTable,
    ZsTypeExpressionTable,
    ScopedZtMatcherState,
    TypeExprMatcherStateDef
> {
    protected _with(D: Partial<TypeExprMatcherStateDef>): ScopedZtMatcherState {
        return new ScopedZtMatcherState(this._recurse, {
            ...this._def,
            ...D
        })
    }
    static empty(
        recurse: Recurse<
            ZsSchemaTable,
            ZsTypeExpressionTable,
            ScopedZtMatcherState
        >
    ) {
        return new ScopedZtMatcherState(recurse, {
            _refs: Map(),
            path: Stack()
        })
    }
    convertZodShape(shape: ZodRawShape) {
        return Object.entries(shape).flatMap(
            ([name, schema]): (MethodSignature | PropertySignature)[] => {
                const member = new ZsClassMember({
                    name,
                    innerType: schema
                })
                return this.convertMember(member)
            }
        )
    }

    convertZsFunctionToSomething<T>(
        signature: ZsFunction["_def"],
        mapper: (
            typeVars: TypeParameterDeclaration[] | undefined,
            args: ParameterDeclaration[],
            returns: TypeNode
        ) => T
    ) {
        const typeVars = signature.typeVarOrdering.map(
            name => signature.typeArgs[name]
        )
        const typeArgs = this.convertTypeVarsToDeclarations(typeVars)
        const args = this.convertParamsToDeclarations(signature.args)
        const returns = this.recurse(signature.returns)
        return mapper(typeArgs, args, returns)
    }
    withTypeVars<T>(typeVars: ZsTypeVar[], fn: () => T) {
        const extras = Map<ZodKindedAny, TypeReferenceNode>(
            typeVars.map(typeVar => [
                typeVar,
                tf.createTypeReferenceNode(typeVar._def.name)
            ])
        )
        return this._with({
            _refs: this._def._refs.merge(extras)
        })
    }

    set(node: ZodKindedAny, type: TypeReferenceNode) {
        return this._with({
            _refs: this._def._refs.set(node, type)
        })
    }

    convertTypeVarToDeclaration(typeVar: ZsTypeVar["_def"]) {
        const constraint = typeVar.extends
            ? this.recurse(typeVar.extends)
            : undefined
        const defaultType = typeVar.defaultType
            ? this.recurse(typeVar.defaultType)
            : undefined
        const modifiers = [] as Modifier[]
        if (typeVar.const) {
            modifiers.push(tf.createToken(SyntaxKind.ConstKeyword))
        }
        if (typeVar.variance) {
            modifiers.push(...toVarianceToken(typeVar.variance))
        }
        const typeParameter = tf.createTypeParameterDeclaration(
            modifiers,
            typeVar.name,
            constraint,
            defaultType
        )
        return typeParameter
    }

    convertTypeVarsToDeclarations(typeVars: ZsTypeVar[]) {
        const typeVarDefs = typeVars.map(typeVar => typeVar._def)
        const typeVarDeclarations = [] as TypeParameterDeclaration[]
        for (const typeVar of typeVarDefs) {
            typeVarDeclarations.push(this.convertTypeVarToDeclaration(typeVar))
        }
        return typeVarDeclarations
    }

    get(
        node: ZodKindedAny | SchemaInspector<ZsSchemaTable, keyof ZsSchemaTable>
    ) {
        node = node instanceof SchemaNodeInspector ? node._node : node
        const ref = this._def._refs.get(node)
        if (ref) {
            return ref
        }
        const decl = this._def._getExternal?.(node as ZsModuleDecl)
        if (!decl) {
            throw new Error("Declaration not found.")
        }
        return decl
    }

    convertZodFunctionToZsFunction(
        zodFunction: ZodFunctionDef<AnyZodTuple, ZodTypeAny>
    ): ZsFunction {
        const zsFunction = new ZsFunction({
            typeName: ZsTypeKind.ZsFunction,
            args: zodFunction.args,
            returns: zodFunction.returns,
            description: zodFunction.description,
            errorMap: zodFunction.errorMap,
            typeArgs: {},
            typeVarOrdering: []
        })
        return zsFunction
    }

    convertParamsToDeclarations(tuple: AnyZodTuple) {
        const params = tuple.items.map((param, i) => {
            const { optional, innerType } = extractModifiers(
                param,
                "ZodOptional"
            )
            const info = getParamInfo(i, param.description)
            const paramType = this.recurse(innerType)
            const decl = tf.createParameterDeclaration(
                undefined,
                undefined,
                info.name,
                optional,
                paramType,
                undefined
            )
            return decl
        })
        if (tuple._def.rest) {
            const rest = tuple._def.rest
            const info = getParamInfo(params.length, rest.description)
            const arrType = this.recurse(tuple._def.rest.array())
            const restDecl = tf.createParameterDeclaration(
                undefined,
                tf.createToken(SyntaxKind.DotDotDotToken),
                info.name,
                undefined,
                arrType
            )
            params.push(restDecl)
        }
        return params
    }

    convertMember(
        member: ZsClassMember
    ): (MethodSignature | PropertySignature)[] {
        const modifiers = [] as Modifier[]

        if (member._def.access) {
            modifiers.push(getAccess(member._def.access))
        }

        const name = member.name
        const memberType = member._def.innerType
        const { optional, readonly, innerType } = extractModifiers(memberType)
        if (readonly) {
            modifiers.push(readonly)
        }
        const inspected = zsInspect(innerType)
        if (inspected.is("ZsOverloads")) {
            return inspected._def.overloads.map(overload => {
                const decl = this.convertZsFunctionToSomething(
                    overload._def,
                    createMethodSignature(modifiers, optional, name)
                )
                return decl
            })
        }

        return [
            tf.createPropertySignature(
                modifiers,
                name,
                optional,
                this.recurse(innerType)
            )
        ]
    }
}

export const zsInspect = ztSchemaWorld.inspect

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
