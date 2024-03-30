import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsTypeVars } from "../generics/type-var"
import { ZsFunction } from "./function"

export interface ZsGenericFunctionDef<
    Vars extends ZsTypeVars,
    Func extends ZsFunction
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericFunction
    vars: Vars
    innerType: Func
}

export class ZsGenericFunction<
    Vars extends ZsTypeVars = ZsTypeVars,
    Func extends ZsFunction = ZsFunction
> extends ZsMonoType<TypeOf<Func>, ZsGenericFunctionDef<Vars, Func>> {
    readonly actsLike = this._def.innerType

    static create<Vars extends ZsTypeVars, Func extends ZsFunction>(
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
