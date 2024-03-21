import { ZodTypeDef } from "zod"

import { ZsStructural } from "../core/misc-node"
import { ZsDeclKind } from "../declarations/kind"
import { ZsMakeResultType } from "../utils/unions"
import { Instantiable } from "./instantiable"
import { ZsMade } from "./instantiation"
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
    implements Instantiable<Vars, Instance>
{
    readonly name = this._def.innerType.name

    make: Instantiable<Vars, Instance>["make"] = (...args) => {
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
