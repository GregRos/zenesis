import { ZodTypeDef } from "zod"
import { ZsGenericDeclarable } from "../declarations/unions"
import { ZsTypeVarTuple } from "./type-var"

import { ZsDeclKind } from "../declarations/kind"
import { ZsStructural } from "../misc-node"
import { Instantiable } from "./instantiable"
import { ZsInstantiation } from "./instantiation"

export interface ZsForallTypeDef<
    Vars extends ZsTypeVarTuple,
    Instance extends ZsGenericDeclarable
> extends ZodTypeDef {
    declName: ZsDeclKind.ZsForallType
    vars: Vars
    innerType: Instance
}

export class ZsForallType<
        Instance extends ZsGenericDeclarable = ZsGenericDeclarable,
        Vars extends ZsTypeVarTuple = ZsTypeVarTuple
    >
    extends ZsStructural<ZsForallTypeDef<Vars, Instance>>
    implements Instantiable<Vars, Instance>
{
    readonly name = this._def.innerType.name
    instantiate: Instantiable<Vars, Instance>["instantiate"] = (...args) => {
        return ZsInstantiation.create(this._def.innerType, args)
    }
}
