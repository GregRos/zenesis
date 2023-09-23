import { ZsFunction } from "../../construction/expressions/function"
import { TypeWalkerCtx } from "../../zod-walker/walker"
import { AnyTypeSchema } from "../../zod-walker/types"
import {
    ParameterDeclaration,
    TypeNode,
    TypeParameterDeclaration
} from "typescript"
import { convertTypeVarsToDeclarations } from "./convert-type-vars-to-declarations"
import { convertParamsToDeclarations } from "./params-into-declarations"

export interface CallSignatureParts {
    typeArgs: TypeParameterDeclaration[] | undefined
    args: TypeNode[]
    returns: TypeNode
}

export function convertZsFunctionToSomething<T>(
    signature: ZsFunction["_def"],
    ctx: TypeWalkerCtx<AnyTypeSchema, TypeNode>,
    mapper: (
        typeVars: TypeParameterDeclaration[] | undefined,
        args: ParameterDeclaration[],
        returns: TypeNode
    ) => T
) {
    const typeVars = signature.typeVarOrdering.map(
        name => signature.typeArgs[name]
    )
    const typeArgs = convertTypeVarsToDeclarations(typeVars, ctx)
    const args = convertParamsToDeclarations(ctx, signature.args)
    const returns = ctx.recurse(signature.returns)
    return mapper(typeArgs, args, returns)
}
