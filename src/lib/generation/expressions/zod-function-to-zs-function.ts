import { AnyZodTuple, ZodFunction, ZodFunctionDef, ZodTypeAny } from "zod"
import { ZsFunction } from "../../construction/expressions/function"
import { ZsTypeKind } from "../../construction/kinds"

export function convertZodFunctionToZsFunction(
    zodFunction: ZodFunctionDef<AnyZodTuple, ZodTypeAny>
): ZsFunction {
    const zsFunction = new ZsFunction({
        typeName: ZsTypeKind.ZsFunction,
        args: zodFunction.args,
        returns: zodFunction.returns,
        description: zodFunction.description,
        errorMap: zodFunction.errorMap,
        typeArgs: {},
        typeVarOrdering: []
    })
    return zsFunction
}
