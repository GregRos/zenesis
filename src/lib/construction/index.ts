import { ZsGenericType } from "./generic/generic-type";
import { ZsFunction } from "./expressions/function";
import { ZsClass } from "./declarative/class";
import { ZsInterface } from "./declarative/interface";
import { ZsTypeAlias } from "./declarative/alias";
import { ZsConditional } from "./expressions/conditional";
import { ZsKeyof } from "./expressions/keyof";
import { ZsTypeof } from "./expressions/typeof";
import { ZsMapped } from "./expressions/mapped";
import { ZsMember } from "./declarative/member";
import { ZsObjectExpr } from "./expressions/object";

export const zs = {
    generic: ZsGenericType.create,
    fun: ZsFunction.create,
    when: ZsConditional.create,
    keyof: ZsKeyof.create,
    typeof: ZsTypeof.create,
    mapped: ZsMapped.create,
    obj: ZsObjectExpr.create
};
