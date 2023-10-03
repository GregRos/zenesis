import { ZsFunction } from "../../construction/expressions/function"
import {
    ParameterDeclaration,
    TypeNode,
    TypeParameterDeclaration
} from "typescript"
import { convertTypeVarsToDeclarations } from "./convert-type-vars-to-declarations"
import { convertParamsToDeclarations } from "./params-into-declarations"
import { TypeExprMatcherContext } from "../expression-matcher"

export interface CallSignatureParts {
    typeArgs: TypeParameterDeclaration[] | undefined
    args: TypeNode[]
    returns: TypeNode
}

export function convertZsFunctionToSomething<T>(
    signature: ZsFunction["_def"],
    ctx: TypeExprMatcherContext,
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
    const args = convertParamsToDeclarations(signature.args, ctx)
    const returns = ctx.recurse(signature.returns)
    return mapper(typeArgs, args, returns)
}
