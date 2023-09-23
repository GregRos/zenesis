import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoType } from "../mono-type"

import { ZsTypeVarsRecord } from "../generic/type-var"
import { ZsFunction } from "./function"
import { ZsTypeKind } from "../kinds"

export interface ZsGenericFunctionDef<
    TypeArgs extends ZsTypeVarsRecord,
    F extends ZsFunction<any, any>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericFunction
    function: F
    ordering: (keyof TypeArgs)[]
    typeArgs: TypeArgs
}

export class ZsGenericFunction<
    ZArgsRecord extends ZsTypeVarsRecord = ZsTypeVarsRecord,
    ZFunction extends ZsFunction<any, any> = ZsFunction<any, any>
> extends ZsMonoType<
    TypeOf<ZFunction>,
    ZsGenericFunctionDef<ZArgsRecord, ZFunction>
> {
    readonly actsLike = this._def.function
}
