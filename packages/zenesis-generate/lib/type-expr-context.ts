import {
    ClassDeclaration,
    Identifier,
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
    AnyZodTuple,
    ZodFunctionDef,
    ZodRawShape,
    ZodTuple,
    ZodTypeAny,
    ZodUnknown
} from "zod"

import { extractModifiers } from "./extract-modifiers"
import { getParamInfo } from "./get-param-info"
import { getAccess, toVarianceToken } from "./tokens"

import {
    AnyTypeKind,
    ZodKindedAny,
    ZsClass,
    ZsClassBody,
    ZsConstructor,
    ZsDeclarable,
    ZsEnum,
    ZsFunction,
    ZsGeneric,
    ZsGenericFunction,
    ZsImplements,
    ZsIndexer,
    ZsInterface,
    ZsOverloads,
    ZsProperty,
    ZsReferableTypeLike,
    ZsSchemaTable,
    ZsTypeAlias,
    ZsTypeVarRef,
    ZsValue,
    describeZenesisNode
} from "@zenesis/schema"

import { seq } from "lazies"
import { cases } from "./cases"
import { NodeMap } from "./node-map"
import { ZsTsTable } from "./table"
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

export class TypeExprContext {
    constructor(private readonly _refs: NodeMap) {}

    get(node: ZsReferableTypeLike) {
        return this._refs.get(node)
    }
    recurse<Node extends ZodKindedAny>(
        node: Node
    ): Node["_def"]["typeName"] extends keyof ZsTsTable
        ? ZsTsTable[Node["_def"]["typeName"]]
        : ZsTsTable[keyof ZsTsTable] {
        if (node._def.typeName in cases) {
            return (cases as any)[node._def.typeName].call(this, node) as any
        }
        throw new Error(`Node type not handled: ${node._def.typeName}`)
    }

    convertZodShape(shape: ZodRawShape) {
        return Object.entries(shape).flatMap(
            ([name, schema]): (MethodSignature | PropertySignature)[] => {
                const member = ZsProperty.create(name, schema)
                return this.convertMember(member)
            }
        )
    }

    convertTypeRefToExpr(node: TypeReferenceNode) {
        const expr = node.typeName as Identifier
        const typeArgs = node.typeArguments
        return tf.createExpressionWithTypeArguments(expr, typeArgs)
    }

    set(node: ZsReferableTypeLike, type: TypeReferenceNode): TypeExprContext {
        return new TypeExprContext(this._refs.set(node, type))
    }

    getTypeExprForHeritageClause(subject: ZsImplements) {
        const typeRefNode = this.recurse(
            subject._def.implemented as ZsInterface | ZsClass
        )
        return this.convertTypeRefToExpr(typeRefNode)
    }

    *getAutoProperties(
        body: ZsClassBody,
        depth = 0
    ): Iterable<ZsProperty | ZsIndexer | ZsConstructor> {
        const impls = [] as ZsImplements[]
        const names = new Set<string>()
        for (const decl of body._def.decls) {
            if (decl instanceof ZsImplements) {
                impls.push(decl)
                continue
            }
            if ("name" in decl) {
                names.add(decl.name)
            }
            if (decl instanceof ZsConstructor) {
                if (depth !== 0) {
                    throw new Error("Cannot implicitly implement constructor!")
                }
            }
            yield decl
        }
        const properties = seq(impls).concatMap(x => {
            if (x._def.auto) {
                return this.getAutoProperties(
                    x._def.implemented.body,
                    depth + 1
                )
            } else {
                return []
            }
        })
        yield* properties.filter(x => {
            if ("name" in x) {
                return !names.has(x.name)
            }
            return true
        })
    }

    convertClassBody(body: ZsClassBody) {
        const wrapped = seq(body._def.decls).cache()
        const properties = wrapped.ofTypes(ZsProperty)
        const impls = wrapped.ofTypes(ZsImplements)
        const autoProperties = seq(this.getAutoProperties(body))

        const heritageClauses = seq(impls)
            .map(x => this.getTypeExprForHeritageClause(x))
            .toArray()
            .pull()
        const membersx = properties.concat(autoProperties).uniq()

        const members = membersx
            .ofTypes(ZsProperty)
            .concatMap(x => this.convertMember(x))
            .toArray()
            .pull()
        const indexers = membersx
            .ofTypes(ZsIndexer)
            .map(x => this.convertIndexer(x))
            .toArray()
            .pull()

        const ctors = membersx
            .ofTypes(ZsConstructor)
            .map(x => this.convertConstructor(x))
            .toArray()
            .pull()
        return {
            implements: heritageClauses,
            members: members,
            indexers,
            ctors
        }
    }
    convertClassDeclaration(
        explicit: boolean,
        clss: ZsClass,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = []

        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }

        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))

        if (clss._def.abstract) {
            modifiers.push(tf.createModifier(SyntaxKind.AbstractKeyword))
        }
        const parts = this.convertClassBody(clss._def.body)
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
            [
                ...parts.members.map(x =>
                    this.convertSignatureToEmptyDeclaration(x)
                ),
                ...parts.ctors,
                ...parts.indexers
            ]
        )
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
    convertInterfaceDeclaration(
        explicit: boolean,
        iface: ZsInterface,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = []

        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }

        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))
        const parts = this.convertClassBody(iface._def.body)
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
            [...parts.members, ...parts.indexers]
        )
    }
    convertGenericTypeToDeclaration(
        explicit: boolean,
        generic: ZsGeneric
    ): TypeAliasDeclaration | InterfaceDeclaration | ClassDeclaration {
        const scoped = this.withTypeVars(generic._def.vars)
        const typeVars = scoped.convertTypeVarsToDeclarations(generic._def.vars)
        return scoped.convertDeclaration(
            explicit,
            generic._def.innerType,
            typeVars
        )
    }
    convertDeclaration(
        explicit: boolean,
        schema: ZsDeclarable,
        typeVars?: TypeParameterDeclaration[] | undefined
    ) {
        if (schema instanceof ZsTypeAlias) {
            return this.convertTypeAliasDeclaration(explicit, schema, typeVars)
        } else if (schema instanceof ZsInterface) {
            return this.convertInterfaceDeclaration(explicit, schema, typeVars)
        } else if (schema instanceof ZsClass) {
            return this.convertClassDeclaration(explicit, schema, typeVars)
        } else if (schema instanceof ZsGeneric) {
            return this.convertGenericTypeToDeclaration(explicit, schema)
        } else if (schema instanceof ZsValue) {
            throw new Error("Values not implemented")
        } else if (schema instanceof ZsEnum) {
            throw new Error("Enums not implemented")
        } else {
            throw new Error(
                `Can't add module-level declaration for ${describeZenesisNode(schema)}`
            )
        }
    }

    convertTypeAliasDeclaration(
        explicit: boolean,
        alias: ZsTypeAlias,
        typeVars: TypeParameterDeclaration[] | undefined
    ) {
        const modifiers: Modifier[] = []

        if (explicit) {
            modifiers.push(tf.createModifier(SyntaxKind.ExportKeyword))
        }

        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))
        const type = this.recurse(alias._def.definition())
        return tf.createTypeAliasDeclaration(
            modifiers,
            alias.name,
            typeVars,
            type
        )
    }
    convertZsFunctionToSomething<T>(
        signature: ZsFunction | ZsGenericFunction,
        mapper: (
            typeVars: TypeParameterDeclaration[] | undefined,
            args: ParameterDeclaration[],
            returns: TypeNode
        ) => T
    ) {
        let typeVars: ZsTypeVarRef[]
        let f: ZsFunction
        if (signature instanceof ZsGenericFunction) {
            typeVars = signature._def.vars
            f = signature._def.innerType
        } else {
            typeVars = []
            f = signature
        }
        const nested = this.withTypeVars(typeVars)
        const typeArgs = nested.convertTypeVarsToDeclarations(typeVars)
        const args = nested.convertParamsToDeclarations(f._def.args)
        const returns = nested.recurse(f._def.returns)
        return mapper(typeArgs, args, returns)
    }

    withTypeVars(typeVars: ZsTypeVarRef[]) {
        let refs = this._refs
        for (const typeVar of typeVars) {
            refs = refs.set(typeVar, tf.createTypeReferenceNode(typeVar.name))
        }
        return new TypeExprContext(refs)
    }

    convertTypeVarToDeclaration(typeVar: ZsTypeVarRef["_def"]) {
        const constraint =
            typeVar.extends && !(typeVar.extends instanceof ZodUnknown)
                ? this.recurse(typeVar.extends)
                : undefined
        const defaultType = typeVar.default
            ? this.recurse(typeVar.default)
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

    convertTypeVarsToDeclarations(typeVars: ZsTypeVarRef[]) {
        const typeVarDeclarations = [] as TypeParameterDeclaration[]
        for (const typeVar of typeVars) {
            typeVarDeclarations.push(
                this.convertTypeVarToDeclaration(typeVar._def)
            )
        }
        return typeVarDeclarations
    }

    convertZodFunctionToZsFunction(
        zodFunction: ZodFunctionDef<AnyZodTuple, ZodTypeAny>
    ): ZsFunction {
        const zsFunction = new ZsFunction({
            typeName: AnyTypeKind.ZsFunction,
            args: zodFunction.args,
            returns: zodFunction.returns,
            description: zodFunction.description,
            errorMap: zodFunction.errorMap
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

    convertConstructor(constructor: ZsConstructor) {
        const params = this.convertParamsToDeclarations(constructor._def.args)
        return tf.createConstructorDeclaration(undefined, params, undefined)
    }

    convertIndexer(indexer: ZsIndexer) {
        const keyParams = this.convertParamsToDeclarations(
            ZodTuple.create([indexer._def.keyType])
        )
        const valueType = this.recurse(indexer._def.valueType)
        return tf.createIndexSignature(undefined, keyParams, valueType)
    }

    convertMember(member: ZsProperty): (MethodSignature | PropertySignature)[] {
        const modifiers = [] as Modifier[]

        if (member._def.access !== "public") {
            modifiers.push(getAccess(member._def.access ?? "public"))
        }

        const name = member.name
        const memberType = member._def
            .innerType as ZsSchemaTable[keyof ZsSchemaTable]
        const { optional, readonly, innerType } = extractModifiers(memberType)
        if (readonly) {
            modifiers.push(readonly)
        }
        if (memberType instanceof ZsOverloads) {
            return memberType._def.overloads.map(overload => {
                const decl = this.convertZsFunctionToSomething(
                    overload,
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
