import { extractModifiers } from "../extract-modifiers"
import { getParamInfo } from "../get-param-info"
import { tf } from "../tf"
import { SyntaxKind, TypeNode } from "typescript"
import { AnyZodTuple } from "zod"

import { TypeExprMatcherContext } from "../expression-matcher"

export function convertParamsToDeclarations(
    tuple: AnyZodTuple,
    ctx: TypeExprMatcherContext
) {
    const params = tuple.items.map((param, i) => {
        const { optional, innerType } = extractModifiers(param, "ZodOptional")
        const info = getParamInfo(i, param.description)
        const paramType = ctx.recurse(innerType)
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
        const arrType = ctx.recurse(tuple._def.rest.array())
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
