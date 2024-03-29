import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsFunction } from "../expressions/function"
import { ZsTypeVarRefs } from "./type-var"

export interface ZsGenericFunctionDef<
    Vars extends ZsTypeVarRefs,
    Func extends ZsFunction
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericFunction
    vars: Vars
    innerType: Func
}

export class ZsGenericFunction<
    Vars extends ZsTypeVarRefs = ZsTypeVarRefs,
    Func extends ZsFunction = ZsFunction
> extends ZsMonoType<TypeOf<Func>, ZsGenericFunctionDef<Vars, Func>> {
    readonly actsLike = this._def.innerType

    static create<Vars extends ZsTypeVarRefs, Func extends ZsFunction>(
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
