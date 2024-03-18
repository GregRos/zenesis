import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsGenericDeclarable } from "../unions"
import { ZsTypeVar, ZsTypeVarsRecord } from "./type-var"

import { ZsInstantiation } from "../../expressions/instantiation"
import { ZsStructural } from "../../misc-node"
import { ZsDeclKind } from "../kind"
import { GenericBuilder } from "./generic-builder"
import { Instantiable } from "./instantiable"

export interface ZsGenericDef<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZodTypeAny
> extends ZodTypeDef {
    declName: ZsDeclKind.ZsGeneric
    vars: Vars
    innerType: Instance
    ordering: (keyof Vars)[]
}

export class ZsGeneric<
        Vars extends ZsTypeVarsRecord = ZsTypeVarsRecord,
        Instance extends ZsGenericDeclarable = ZsGenericDeclarable
    >
    extends ZsStructural<ZsGenericDef<Vars, Instance>>
    implements Instantiable<Vars, Instance>
{
    readonly name = this._def.innerType.name
    instantiate: Instantiable<Vars, Instance>["instantiate"] = args => {
        const typeArgs = this._def.ordering.map(name => args[name])
        return ZsInstantiation.create(this._def.innerType, typeArgs as any)
    }

    static create<Names extends string>(...names: [Names, ...Names[]]) {
        return new GenericBuilder(
            names,
            {} as Record<Names, ZsTypeVar<ZodAny, null>>
        )
    }
}
