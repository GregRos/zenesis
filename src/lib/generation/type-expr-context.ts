import {
    ClassDeclaration,
    InterfaceDeclaration,
    MethodDeclaration,
    MethodSignature,
    Modifier,
    ParameterDeclaration,
    PropertyDeclaration,
    PropertySignature,
    QuestionToken,
    SyntaxKind,
    TypeAliasDeclaration,
    TypeNode,
    TypeParameterDeclaration,
    TypeReferenceNode
} from "typescript"
import { tf } from "./tf"
import {
    BaseRecursionContext,
    NodeInspector, RecursionContextDef,
    SchemaInspector,
    ZodKindedAny
} from "../../../../zod-tools";
import { Map, Stack } from "immutable"
import { AnyZodTuple, ZodFunctionDef, ZodRawShape, ZodTypeAny } from "zod"
import { ZsClassMember } from "../construction/class-declarations/field"
import {
    ZsClass,
    ZsClassFragment,
    ZsFunction,
    ZsGenericType,
    ZsInstantiation,
    ZsInterface,
    ZsTypeAlias,
    ZsTypeKind,
    ZsTypeVar
} from "../construction"
import { getAccess, toVarianceToken } from "./expressions/tokens"
import { ZsModuleDecl } from "../construction/module-declarations/module-fragment"
import { extractModifiers } from "./extract-modifiers"
import { getParamInfo } from "./get-param-info"
import {
    JsDocHandler,
    MissingDeclHandler,
    zsInspect,
    ZsSchemaTable,
    ZsTypeExpressionTable,
    zsSchemaDomain
} from "./zt-types"
import { ZsImplements } from "../construction/class-declarations/implements"
import { ClassFragmentParts } from "./declarations/class-fragment"
import { ZsTypeVarsRecord } from "../construction/generic/type-var"
import { ZsGenericClass } from "../construction/generic/generic-type"
import { ContextInit, KindedAny, RootInit, ChildInit } from "zod-tools"

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

export interface TypeExprContextDef extends RecursionContextDef<ZsSchemaTable, ZsTypeExpressionTable, TypeExprContext>
    _refs: Map<ZodKindedAny, TypeReferenceNode>
    _getExternal?: MissingDeclHandler
    onJsdoc?: JsDocHandler
}

export class TypeExprContext extends BaseRecursionContext<
    ZsSchemaTable,
    ZsTypeExpressionTable,
    TypeExprContext
> {
    private readonly _scoped: TypeExprContextDef
    constructor(
        ...init:
            | [RootInit<TypeExprContext>]
            | [ChildInit<TypeExprContext>, TypeExprContextDef]
    ) {
        super(init[0])
        if (init.length === 2) {
            this._scoped = init[1]
        } else {
            this._scoped = {
                _refs: Map()
            }
        }
    }

    protected _child(
        next: NodeInspector<ZsSchemaTable, KindedAny>
    ): TypeExprContext {
        return new TypeExprContext(
            {
                parent: this,
                current: next
            },
            this._scoped
        )
    }

    protected _scope(scoped: TypeExprContextDef): TypeExprContext {
        return new TypeExprContext(
            {
                parent: this,
                current: this.current
            },
            scoped
        )
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
        const nested = this.withTypeVars(signature.typeVars)
        const typeArgs = nested.convertTypeVarsToDeclarations(
            signature.typeVarOrdering,
            signature.typeVars
        )
        const args = nested.convertParamsToDeclarations(signature.args)
        const returns = nested.recurse(signature.returns)
        return mapper(typeArgs, args, returns)
    }

    withTypeVars(typeVars: ZsTypeVarsRecord) {
        const extras = Map<ZodKindedAny, TypeReferenceNode>(
            Object.values(typeVars).map(typeVar => [
                typeVar,
                tf.createTypeReferenceNode(typeVar._def.name)
            ])
        )
        return this._child({
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

    convertTypeVarsToDeclarations(
        typeVarOrdering: string[],
        typeVars: ZsTypeVarsRecord
    ) {
        const typeVarDefs = typeVarOrdering.map(name => typeVars[name])
        const typeVarDeclarations = [] as TypeParameterDeclaration[]
        for (const typeVar of typeVarDefs) {
            typeVarDeclarations.push(
                this.convertTypeVarToDeclaration(typeVar._def)
            )
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
            typeVars: {},
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

    convertSignatureToEmptyDeclaration(
        sig: PropertySignature | MethodSignature
    ): PropertyDeclaration | MethodDeclaration {
        if (sig.kind === SyntaxKind.MethodSignature) {
            return tf.createMethodDeclaration(
                sig.modifiers,
                undefined,
                sig.name,
                sig.questionToken,
                sig.typeParameters,
                sig.parameters,
                sig.type,
                undefined
            )
        }
        return tf.createPropertyDeclaration(
            sig.modifiers,
            sig.name,
            sig.questionToken,
            sig.type,
            undefined
        )
    }

    convertTypeDeclaration(
        explicit: boolean,
        schema: ZsTypeAlias | ZsInterface | ZsClass,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const r = zsSchemaDomain.match(schema).cases<{
            else: never
            [ZsTypeKind.ZsClass]: ClassDeclaration
            [ZsTypeKind.ZsInterface]: InterfaceDeclaration
            [ZsTypeKind.ZsTypeAlias]: TypeAliasDeclaration
        }>({
            [ZsTypeKind.ZsClass]: node =>
                this.convertClassDeclaration(explicit, node._node, typeVars),
            [ZsTypeKind.ZsInterface]: node =>
                this.convertInterfaceDeclaration(
                    explicit,
                    node._node,
                    typeVars
                ),
            [ZsTypeKind.ZsTypeAlias]: node =>
                this.convertTypeAliasDeclaration(
                    explicit,
                    node._node,
                    typeVars
                ),
            else(node) {
                throw new Error(
                    `Unknown type declaration ${node._def.typeName}`
                )
            }
        })
        return r
    }

    convertGenericTypeToDeclaration(explicit: boolean, generic: ZsGenericType) {
        const scoped = this.withTypeVars(generic._def.vars)
        const typeVars = scoped.convertTypeVarsToDeclarations(
            generic._def.ordering,
            generic._def.vars
        )
        return scoped.convertTypeDeclaration(
            explicit,
            generic._def.innerType,
            typeVars
        )
    }

    convertClassDeclaration(
        explicit: boolean,
        clss: ZsClass,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = [
            tf.createModifier(SyntaxKind.DeclareKeyword)
        ]
        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }
        if (clss._def.abstract) {
            modifiers.push(tf.createModifier(SyntaxKind.AbstractKeyword))
        }
        const parts = this.convertClassFragment(clss._def.fragment)
        const parentRef =
            clss._def.parent !== null
                ? this.getTypeExprForHeritageClause(clss._def.parent as any)
                : undefined

        const extendsClause = parentRef
            ? [tf.createHeritageClause(SyntaxKind.ExtendsKeyword, [parentRef])]
            : []
        const implClause = parts.implements.length
            ? [
                  tf.createHeritageClause(
                      SyntaxKind.ImplementsKeyword,
                      parts.implements
                  )
              ]
            : []

        return tf.createClassDeclaration(
            modifiers,
            clss.name,
            typeVars,
            [...extendsClause, ...implClause],
            parts.members.map(x => this.convertSignatureToEmptyDeclaration(x))
        )
    }

    convertInterfaceDeclaration(
        explicit: boolean,
        iface: ZsInterface,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = [
            tf.createModifier(SyntaxKind.DeclareKeyword)
        ]
        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }
        const parts = this.convertClassFragment(iface._def.fragment)
        const extendsClause = parts.implements.length
            ? [
                  tf.createHeritageClause(
                      SyntaxKind.ExtendsKeyword,
                      parts.implements
                  )
              ]
            : []

        return tf.createInterfaceDeclaration(
            modifiers,
            iface.name,
            typeVars,
            [...extendsClause],
            parts.members
        )
    }

    convertTypeAliasDeclaration(
        explicit: boolean,
        alias: ZsTypeAlias,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = [
            tf.createModifier(SyntaxKind.DeclareKeyword)
        ]
        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }
        const type = this.recurse(alias._def.definition)
        return tf.createTypeAliasDeclaration(
            modifiers,
            alias.name,
            typeVars,
            type
        )
    }

    convertTypeRefToExpr(node: TypeReferenceNode) {
        const expr = tf.createIdentifier(node.typeName.getText())
        const typeArgs = node.typeArguments
        return tf.createExpressionWithTypeArguments(expr, typeArgs)
    }

    getTypeExprForHeritageClause(
        subject:
            | ZsClass
            | ZsInstantiation<ZsClass | ZsInterface | ZsTypeAlias>
            | ZsInterface
            | ZsTypeAlias
    ) {
        const typeRefNode = this.recurse(subject)
        return this.convertTypeRefToExpr(typeRefNode)
    }

    convertClassFragment(fragment: ZsClassFragment) {
        const result: ClassFragmentParts = {
            members: [],
            implements: []
        }
        for (const declaration of fragment._def.decls) {
            if (declaration instanceof ZsClassMember) {
                result.members.push(...this.convertMember(declaration))
            } else if (declaration instanceof ZsImplements) {
                result.implements.push(
                    this.getTypeExprForHeritageClause(
                        declaration._def.interface
                    )
                )
            }
        }
        return result
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
        if (inspected.is(ZsTypeKind.ZsOverloads)) {
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
