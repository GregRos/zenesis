import {
    ZsTypeVar,
    ZsTypeVarVariance
} from "../../construction/generic/type-var"
import { tf } from "../tf"
import { TypeWalkerCtx } from "../../zod-walker/walker"
import { AnyTypeSchema } from "../../zod-walker/types"
import {
    Modifier,
    SyntaxKind,
    TypeNode,
    TypeParameterDeclaration
} from "typescript"

export function toVarianceToken(variance: ZsTypeVarVariance) {
    switch (variance) {
        case "":
            return []
        case "in":
            return [tf.createToken(SyntaxKind.InKeyword)]
        case "out":
            return [tf.createToken(SyntaxKind.OutKeyword)]
        case "inout":
            return [
                tf.createToken(SyntaxKind.InKeyword),
                tf.createToken(SyntaxKind.OutKeyword)
            ]
        default:
            throw new Error(`Unknown variance ${variance}`)
    }
}

export function convertTypeVarsToDeclarations(
    typeVars: ZsTypeVar[],
    ctx: TypeWalkerCtx<AnyTypeSchema, TypeNode>
) {
    const typeVarDefs = typeVars.map(typeVar => typeVar._def)
    const typeVarDeclarations = [] as TypeParameterDeclaration[]
    for (const typeVar of typeVarDefs) {
        const constraint = typeVar.extends
            ? ctx.recurse(typeVar.extends)
            : undefined
        const defaultType = typeVar.defaultType
            ? ctx.recurse(typeVar.defaultType)
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
        typeVarDeclarations.push(typeParameter)
    }
    return typeVarDeclarations
}
