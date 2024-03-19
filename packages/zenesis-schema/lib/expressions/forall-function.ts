import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeVarTuple } from "../generics/type-var"
import { ZsTypeKind } from "../kinds"
import { ZsFunction } from "./function"

export interface ZsForallFunctionDef<
    Vars extends ZsTypeVarTuple,
    Func extends ZsFunction
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsForallFunction
    vars: Vars
    innerType: Func
}

export class ZsForallFunction<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple,
    Func extends ZsFunction = ZsFunction
> extends ZsMonoType<TypeOf<Func>, ZsForallFunctionDef<Vars, Func>> {
    readonly actsLike = this._def.innerType

    static create<Vars extends ZsTypeVarTuple, Func extends ZsFunction>(
        vars: Vars,
        func: Func
    ): ZsForallFunction<Vars, Func> {
        return new ZsForallFunction({
            typeName: ZsTypeKind.ZsForallFunction,
            vars,
            innerType: func
        })
    }
}
