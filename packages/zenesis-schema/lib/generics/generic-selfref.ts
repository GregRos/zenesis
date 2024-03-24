import { memoize } from "lazies"
import { ZsStructural } from "../core/misc-node"
import { ZsMakeResultType } from "../utils/unions"
import { ZsGeneric } from "./generic"
import { ZsMade } from "./made"
import { Makable } from "./makable"
import { ZsTypeVarTuple } from "./type-var"

export class ZsGenericSelfref<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple,
    Result extends ZsMakeResultType = ZsMakeResultType
> extends ZsStructural<ZsGenericSelfrefDef> {
    static create<Vars extends ZsTypeVarTuple, Result extends ZsMakeResultType>(
        vars: Vars,
        resolving: () => ZsGeneric
    ): ZsGenericSelfref<Vars, Result> {
        return new ZsGenericSelfref({
            resolving: memoize(resolving)
        })
    }

    make: Makable<Vars, ZsMakeResultType>["make"] = (...args) => {
        const resolvedSelf = this._def.resolving()
        return ZsMade.create(resolvedSelf._def.innerType, resolvedSelf, args)
    }
}
export interface ZsGenericSelfrefDef {
    resolving(): ZsGeneric
}
