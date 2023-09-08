import { TypeOf, ZodFunction, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";

import { ZsTypeVarsRecord } from "./type-var";

export interface ZsGenericFunctionDef<
    TypeArgs extends ZsTypeVarsRecord,
    F extends ZodFunction<any, any>
> extends ZodTypeDef {
    typeName: "ZsGenericFunction";
    function: F;
    ordering: (keyof TypeArgs)[];
    typeArgs: TypeArgs;
}

export class ZsGenericFunction<
    TypeArgs extends ZsTypeVarsRecord,
    Function extends ZodFunction<any, any>
> extends ZsMonoType<
    TypeOf<Function>,
    ZsGenericFunctionDef<TypeArgs, Function>
> {
    readonly actsLike = this._def.function;
}
