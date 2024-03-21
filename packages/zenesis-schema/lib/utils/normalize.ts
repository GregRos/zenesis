import { ZodFunction, ZodTuple, ZodTypeAny } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsFunction } from "../expressions/function"

export function convertZodFunctionToZsFunction<
    Args extends ZodTuple<any, any>,
    Returns extends ZodTypeAny
>(zodFunction: ZodFunction<Args, Returns>): ZsFunction<Args, Returns> {
    const zsFunction = new ZsFunction({
        typeName: ZsTypeKind.ZsFunction,
        args: zodFunction._def.args,
        returns: zodFunction._def.returns,
        description: zodFunction._def.description,
        errorMap: zodFunction._def.errorMap
    })
    return zsFunction
}
