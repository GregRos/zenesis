import { ZodTypeDef } from "zod"

import { ZsDeclKind } from "../core/declaration-kind"
import { ZsStructural } from "../core/misc-node"
import { ZsMakeResultType } from "../utils/unions"
import { createInstantiation } from "./made"
import { Makable } from "./makable"
import { ZsTypeVarRefs } from "./type-var"

export interface ZsGenericDef<
    Vars extends ZsTypeVarRefs,
    Instance extends ZsMakeResultType
> extends ZodTypeDef {
    declName: ZsDeclKind.ZsGeneric
    vars: Vars
    innerType: Instance
}

export class ZsGeneric<
        Instance extends ZsMakeResultType = ZsMakeResultType,
        Vars extends ZsTypeVarRefs = ZsTypeVarRefs
    >
    extends ZsStructural<ZsGenericDef<Vars, Instance>>
    implements Makable<Vars, Instance>
{
    readonly _Instance!: Instance
    readonly name = this._def.innerType.name
    readonly vars = this._def.vars
    make: Makable<Vars, Instance>["make"] = (...args) => {
        return createInstantiation({
            deref: () => this._def.innerType,
            text: this._def.innerType.name,
            typeArgs: args,
            name: this.name
        })
    }

    static create<
        Instance extends ZsMakeResultType,
        Vars extends ZsTypeVarRefs
    >(innerType: Instance, vars: Vars): ZsGeneric<Instance, Vars> {
        return new ZsGeneric({
            declName: ZsDeclKind.ZsGeneric,
            innerType,
            vars
        })
    }
}
