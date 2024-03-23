import { TypeOf, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeVarTuple } from "../generics/type-var"
import { ZsFunction } from "./function"

export interface ZsGenericFunctionDef<
    Vars extends ZsTypeVarTuple,
    Func extends ZsFunction
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericFunction
    vars: Vars
    innerType: Func
}

export class ZsGenericFunction<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple,
    Func extends ZsFunction = ZsFunction
> extends ZsMonoType<TypeOf<Func>, ZsGenericFunctionDef<Vars, Func>> {
    readonly actsLike = this._def.innerType

    static create<Vars extends ZsTypeVarTuple, Func extends ZsFunction>(
        vars: Vars,
        func: Func
    ): ZsGenericFunction<Vars, Func> {
        return new ZsGenericFunction({
            typeName: ZsTypeKind.ZsGenericFunction,
            vars,
            innerType: func
        })
    }
}
