import { ZodRawShape } from "zod"
import { extractModifiers } from "../extract-modifiers"
import { matchType } from "../../zod-walker/patterns"
import { AnyTypeKind } from "../../construction/kinds"
import { tf } from "../tf"
import { TypeWalkerCtx } from "../../zod-walker/walker"
import { AnyTypeSchema } from "../../zod-walker/types"
import {
    MethodSignature,
    Modifier,
    ParameterDeclaration,
    PropertySignature,
    QuestionToken,
    TypeNode,
    TypeParameterDeclaration
} from "typescript"
import { convertZsFunctionToSomething } from "./function-to-call-signature"

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

export function convertMemberList(
    shape: ZodRawShape,
    ctx: TypeWalkerCtx<AnyTypeSchema, TypeNode>
) {
    return Object.entries(shape).flatMap(
        ([name, schema]): (MethodSignature | PropertySignature)[] => {
            const { optional, readonly, innerType } = extractModifiers(schema)
            if (matchType(innerType, AnyTypeKind.ZsOverloads)) {
                return innerType._def.overloads.map(overload => {
                    const decl = convertZsFunctionToSomething(
                        overload._def,
                        ctx,
                        createMethodSignature([], optional, name)
                    )
                    return decl
                })
            }
            return [
                tf.createPropertySignature(
                    readonly ? [readonly] : [],
                    name,
                    optional,
                    ctx.recurse(innerType)
                )
            ]
        }
    )
}
