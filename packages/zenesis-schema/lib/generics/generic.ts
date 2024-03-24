import { ZodTypeDef } from "zod"

import { ZsDeclKind } from "../core/declaration-kind"
import { ZsStructural } from "../core/misc-node"
import { ZsMakeResultType } from "../utils/unions"
import { ZsMade } from "./made"
import { Makable } from "./makable"
import { ZsTypeVarTuple } from "./type-var"

export interface ZsForallTypeDef<
    Vars extends ZsTypeVarTuple,
    Instance extends ZsMakeResultType
> extends ZodTypeDef {
    declName: ZsDeclKind.ZsForallType
    vars: Vars
    innerType: Instance
}

export class ZsGeneric<
        Instance extends ZsMakeResultType = ZsMakeResultType,
        Vars extends ZsTypeVarTuple = ZsTypeVarTuple
    >
    extends ZsStructural<ZsForallTypeDef<Vars, Instance>>
    implements Makable<Vars, Instance>
{
    readonly name = this._def.innerType.name

    make: Makable<Vars, Instance>["make"] = (...args) => {
        return ZsMade.create(this._def.innerType, this, args)
    }

    static create<
        Instance extends ZsMakeResultType,
        Vars extends ZsTypeVarTuple
    >(innerType: Instance, vars: Vars): ZsGeneric<Instance, Vars> {
        return new ZsGeneric({
            declName: ZsDeclKind.ZsForallType,
            innerType,
            vars
        })
    }
}
