import { ZsGenericType } from "./generic/generic-type";
import { ZsFunction } from "./expressions/function";
import { ZsConditional } from "./expressions/conditional";
import { ZsKeyof } from "./expressions/keyof";
import { ZsTypeof } from "./expressions/typeof";
import { ZsMapped } from "./expressions/mapped";
import { ZsObjectExpr } from "./expressions/object";
import { ZsWorld } from "../containers/world";
import { z } from "zod";
import {
    ZsModuleDecl,
    ZsModuleDeclarations,
    ZsModuleFragment
} from "./module-declarations/module-fragment";
import { ZsClassFragment } from "./class-declarations/class-fragment";

const fullZs = {
    generic: ZsGenericType.create,
    fun: ZsFunction.create,
    when: ZsConditional.create,
    keyof: ZsKeyof.create,
    mapped: ZsMapped.create,
    obj: ZsObjectExpr.create,
    world: ZsWorld.create,
    module: <Exports extends ZsModuleDecl>(
        exports: ZsModuleDeclarations<Exports>
    ) => {
        return ZsModuleFragment.create(exports);
    },
    class: ZsClassFragment.create,
    ...z
};

export const zs = fullZs as Omit<typeof fullZs, "function">;
