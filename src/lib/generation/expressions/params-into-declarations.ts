import { AnyTypeSchema } from "../../zod-walker/types"
import { ExtractModifier, extractModifiers } from "../extract-modifiers"
import { getParamInfo } from "../get-param-info"
import { tf } from "../tf"
import { TypeWalkerCtx } from "../../zod-walker/walker"
import { SyntaxKind, TypeNode } from "typescript"
import { AnyZodTuple } from "zod"

export function convertParamsToDeclarations(
    ctx: TypeWalkerCtx<AnyTypeSchema, TypeNode>,
    tuple: AnyZodTuple
) {
    const params = tuple.items.map((param, i) => {
        const { optional, innerType } = extractModifiers(
            param,
            ExtractModifier.Optional
        )
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
