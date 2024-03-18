import { ZodTuple, ZodTypeAny } from "zod"
import { ZsFunction, ZsRestBuilder } from "../../expressions/function"

export type MethodsDeclaration<Fun extends ZsFunction> = (
    declarator: MethodDeclarator
) => Generator<Fun>
export class MethodDeclarator {
    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsRestBuilder<ZodTuple<[...Args], null>> {
        return ZsFunction.create(...params)
    }
}
