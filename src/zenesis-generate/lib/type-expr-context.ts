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

import { Map, Stack } from "immutable"
import { AnyZodTuple, ZodFunctionDef, ZodRawShape, ZodTypeAny } from "zod"

import { getAccess, toVarianceToken } from "./tokens"
import { extractModifiers } from "./extract-modifiers"
import { getParamInfo } from "./get-param-info"

import {
    AnyTypeKind,
    ZodKindedAny,
    ZsClass,
    ZsClassBody,
    ZsDeclarable,
    ZsEnum,
    ZsExportable,
    ZsFunction,
    ZsGeneric,
    ZsImplements,
    ZsInterface,
    ZsMapVar,
    ZsOverloads,
    ZsReferable,
    ZsSchemaTable,
    ZsTypeAlias,
    ZsTypeVar,
    ZsTypeVarsRecord,
    ZsValue
} from "zenesis-schema"
import { ZsTsTable as ZsTsTable } from "./sz-expr"
import { ZsMember } from "zenesis-schema"
import { Lazy, lazy, seq } from "lazies"
import { cases } from "./cases"
import { NodeMap, TypeDeclRef } from "./node-map"
import { ScopeEscapeError } from "./module"
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

    get(node: ZsReferable) {
        return this._refs.get(node)
    }
    recurse<Node extends ZodKindedAny>(node: Node) {
        if (node._def.typeName in cases) {
            return (cases as any)[node._def.typeName].call(this, node) as any
        }
        throw new Error(`Node type not handled: ${node._def.typeName}`)
    }

    convertZodShape(shape: ZodRawShape) {
        return Object.entries(shape).flatMap(
            ([name, schema]): (MethodSignature | PropertySignature)[] => {
                const member = ZsMember.create(name, schema)
                return this.convertMember(member)
            }
        )
    }

    convertTypeRefToExpr(node: TypeReferenceNode) {
        const expr = tf.createIdentifier(node.typeName.getText())
        const typeArgs = node.typeArguments
        return tf.createExpressionWithTypeArguments(expr, typeArgs)
    }

    set(node: ZsDeclarable, type: TypeReferenceNode): TypeExprContext {
        return new TypeExprContext(this._refs.set(node, type))
    }

    getTypeExprForHeritageClause(subject: ZsImplements) {
        const typeRefNode = this.recurse(subject._def.implemented)
        return this.convertTypeRefToExpr(typeRefNode)
    }
    convertClassBody(fragment: ZsClassBody) {
        const decls = seq(seq(fragment._def.decls).toArray().pull())
        const impls = decls
            .ofTypes(ZsImplements)
            .map(x => this.getTypeExprForHeritageClause(x))
        const members = decls
            .ofTypes(ZsMember)
            .concatMap(x => this.convertMember(x))
        return {
            implements: impls.toArray().pull(),
            members: members.toArray().pull()
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
            parts.members.map(x => this.convertSignatureToEmptyDeclaration(x))
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
            parts.members
        )
    }
    convertGenericTypeToDeclaration(
        explicit: boolean,
        generic: ZsGeneric
    ): TypeAliasDeclaration | InterfaceDeclaration | ClassDeclaration {
        const scoped = this.withTypeVars(generic._def.vars)
        const typeVars = scoped.convertTypeVarsToDeclarations(
            generic._def.ordering,
            generic._def.vars
        )
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
        if (schema instanceof ZsTypeVar || schema instanceof ZsMapVar) {
            throw new ScopeEscapeError(schema)
        }
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
            throw new Error("Unreachable")
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
        const type = this.recurse(alias._def.definition)
        return tf.createTypeAliasDeclaration(
            modifiers,
            alias.name,
            typeVars,
            type
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
        let refs = this._refs
        for (const [name, typeVar] of Object.entries(typeVars)) {
            refs = refs.set(typeVar, tf.createTypeReferenceNode(name))
        }
        return new TypeExprContext(refs)
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

    convertZodFunctionToZsFunction(
        zodFunction: ZodFunctionDef<AnyZodTuple, ZodTypeAny>
    ): ZsFunction {
        const zsFunction = new ZsFunction({
            typeName: AnyTypeKind.ZsFunction,
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

    convertMember(member: ZsMember): (MethodSignature | PropertySignature)[] {
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
