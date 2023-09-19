import { TypeOf, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";

import { ZsTypeVarsRecord } from "../generic/type-var";
import { ZsFunction } from "./function";
import { ZsTypeKind } from "../kinds";

export interface ZsGenericFunctionDef<
    TypeArgs extends ZsTypeVarsRecord,
    F extends ZsFunction<any, any>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsGenericFunction;
    function: F;
    ordering: (keyof TypeArgs)[];
    typeArgs: TypeArgs;
}

export class ZsGenericFunction<
    TypeArgs extends ZsTypeVarsRecord,
    Function extends ZsFunction<any, any>
> extends ZsMonoType<
    TypeOf<Function>,
    ZsGenericFunctionDef<TypeArgs, Function>
> {
    readonly actsLike = this._def.function;
}
