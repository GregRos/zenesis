import {
    AnyTypeKind,
    ZsClass,
    ZsFunction,
    ZsGenericFunction,
    ZsImplements,
    ZsInterface,
    ZsMemberTable,
    ZsOverloads,
    ZsTypeVar
} from "@zenesis/schema"
import {
    Identifier,
    MethodDeclaration,
    MethodSignature,
    Modifier,
    ParameterDeclaration,
    PropertyDeclaration,
    PropertySignature,
    SyntaxKind,
    TypeNode,
    TypeParameterDeclaration,
    TypeReferenceNode
} from "typescript"
import { AnyZodTuple, ZodFunctionDef, ZodTypeAny, ZodUnknown } from "zod"
import { BaseContext } from "../common/context-base"
import { TypeExprContext } from "../expressions/type-expr-context"
import { extractModifiers } from "../utils/extract-modifiers"
import { getParamInfo } from "../utils/get-param-info"
import { NodeMap } from "../utils/node-map"
import { tf } from "../utils/tf"
import { toVarianceToken } from "../utils/tokens"
import { cases } from "./cases"
import { ZsToTsMemberTable } from "./table"

export class MemberContext extends BaseContext {
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
    create(refs: NodeMap): this {
        return new MemberContext(refs) as this
    }
    convert<Node extends ZsMemberTable[keyof ZsMemberTable]>(
        member: Node
    ): ZsToTsMemberTable[Node["_def"]["memberName"]] {
        return (cases as any)[member._def.memberName].call(this, member)
    }
    getTypeExprForHeritageClause(subject: ZsImplements) {
        const ctx = this.createExpressionContext()
        const typeRefNode = ctx.recurse(
            subject._def.implemented as ZsInterface | ZsClass
        )
        return this.convertTypeRefToExpr(typeRefNode)
    }

    createExpressionContext() {
        return new TypeExprContext(this._refs)
    }

    convertTypeRefToExpr(node: TypeReferenceNode) {
        const expr = node.typeName as Identifier
        const typeArgs = node.typeArguments
        return tf.createExpressionWithTypeArguments(expr, typeArgs)
    }
    convertTypeVarToDeclaration(typeVarx: ZsTypeVar) {
        const ctx = this.createExpressionContext()
        const constraint =
            typeVarx._def.extends &&
            !(typeVarx._def.extends instanceof ZodUnknown)
                ? ctx.recurse(typeVarx._def.extends)
                : undefined
        const defaultType = typeVarx._def.default
            ? ctx.recurse(typeVarx._def.default)
            : undefined
        const modifiers = [] as Modifier[]
        if (typeVarx._def.const) {
            modifiers.push(tf.createToken(SyntaxKind.ConstKeyword))
        }
        if (typeVarx._def.variance) {
            modifiers.push(...toVarianceToken(typeVarx._def.variance))
        }
        const typeParameter = tf.createTypeParameterDeclaration(
            modifiers,
            typeVarx._def.name,
            constraint,
            defaultType
        )
        return typeParameter
    }

    convertTypeVarsToDeclarations(typeVars: ZsTypeVar[]) {
        const typeVarDeclarations = [] as TypeParameterDeclaration[]
        for (const typeVar of typeVars) {
            typeVarDeclarations.push(this.convertTypeVarToDeclaration(typeVar))
        }
        return typeVarDeclarations
    }
    convertOverloadsToSomethings<T>(
        overloads: ZsOverloads,
        mapper: (
            typeVars: TypeParameterDeclaration[] | undefined,
            args: ParameterDeclaration[],
            returns: TypeNode
        ) => T
    ) {
        return overloads._def.overloads.map(overload => {
            return this.convertZsFunctionToSomething(overload, mapper)
        })
    }
    convertZsFunctionToSomething<T>(
        signature: ZsFunction | ZsGenericFunction,
        mapper: (
            typeVars: TypeParameterDeclaration[] | undefined,
            args: ParameterDeclaration[],
            returns: TypeNode
        ) => T
    ) {
        let typeVars: ZsTypeVar[]
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
        const returns = nested.createExpressionContext().recurse(f._def.returns)
        return mapper(typeArgs, args, returns)
    }

    convertParamsToDeclarations(tuple: AnyZodTuple) {
        const exprContext = this.createExpressionContext()
        const params = tuple.items.map((param, i) => {
            const { optional, innerType } = extractModifiers(
                param,
                "ZodOptional"
            )
            const info = getParamInfo(i, param.description)
            const paramType = exprContext.recurse(innerType)
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
            const arrType = exprContext.recurse(tuple._def.rest.array())
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
}
