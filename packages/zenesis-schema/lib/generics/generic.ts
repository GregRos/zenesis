import { ZodTypeDef } from "zod"

import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsStructural } from "../core/misc-node"
import { SchemaSubtypeOf } from "../core/operators"
import { ZsGeneralizableType } from "../utils/unions"
import { ZsInstantiated, createInstantiation } from "./made"
import { ZsTypeVars } from "./type-var"

export interface ZsGenericDef<
    Vars extends ZsTypeVars,
    Instance extends ZsGeneralizableType
> extends ZodTypeDef {
    declName: ZsModuleDeclKind.ZsGeneric
    vars: Vars
    innerType: Instance
}

export class ZsGeneric<
    Instance extends ZsGeneralizableType = ZsGeneralizableType,
    Vars extends ZsTypeVars = ZsTypeVars
> extends ZsStructural<ZsGenericDef<Vars, Instance>> {
    readonly _Instance!: Instance
    readonly name = this._def.innerType.name
    readonly vars = this._def.vars
    make(
        ...args: {
            [I in keyof Vars]: SchemaSubtypeOf<Vars[I]["_def"]["extends"]>
        }
    ): ZsInstantiated<Instance> {
        return createInstantiation({
            deref: () => this._def.innerType,
            text: this._def.innerType.name,
            typeArgs: args,
            name: this.name
        })
    }

    static create<
        Instance extends ZsGeneralizableType,
        Vars extends ZsTypeVars
    >(innerType: Instance, vars: Vars): ZsGeneric<Instance, Vars> {
        return new ZsGeneric({
            declName: ZsModuleDeclKind.ZsGeneric,
            innerType,
            vars
        })
    }
}
