import { ZsGenericType } from "./generic/generic-type";
import { ZsFunction } from "./expressions/function";
import { ZsConditional } from "./expressions/conditional";
import { ZsKeyof } from "./expressions/keyof";
import { ZsTypeof } from "./expressions/typeof";
import { ZsMapped } from "./expressions/mapped";
import { ZsObjectExpr } from "./expressions/object";
import { ZsUniverse } from "../containers/universe";
import { z } from "zod";

const fullZs = {
    generic: ZsGenericType.create,
    fun: ZsFunction.create,
    when: ZsConditional.create,
    keyof: ZsKeyof.create,
    mapped: ZsMapped.create,
    obj: ZsObjectExpr.create
    universe: ZsUniverse.create,
    ...z
};

export const zs = fullZs as Omit<typeof fullZs, "function">;
