import { ZodTypeAny, ZodTypeDef, ZodUnknown } from "zod"
import { ZsStructural } from "../core/misc-node"
import { SchemaSubtypeOf } from "../core/operators"
import { ZsTypeArg } from "./type-arg"
;``
export interface ZsTypeVarDef<
    Name extends string,
    Extends extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Extends> | null
> extends ZodTypeDef {
    readonly arg: ZsTypeArg<Name>
    readonly extends: Extends
    readonly default: Default
    readonly const: boolean
    readonly variance: ZsTypeVarVariance
}
export class ZsTypeVar<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsStructural<ZsTypeVarDef<Name, Extends, Default>> {
    readonly name = this._def.arg.name
    readonly arg = this._def.arg as ZsTypeArg<Name>
    default<NewDefault extends SchemaSubtypeOf<Extends> | null>(
        newDefault: NewDefault
    ) {
        return new ZsTypeVar({
            ...this._def,
            default: newDefault
        })
    }
    extends<
        NewExtends extends Default extends NewExtends | null
            ? ZodTypeAny
            : never
    >(extends_: NewExtends) {
        return new ZsTypeVar({
            ...this._def,
            extends: extends_
        })
    }
    static create<Name extends string>(name: Name) {
        return new ZsTypeVar({
            arg: ZsTypeArg.create(name),
            extends: ZodUnknown.create(),
            default: null,
            const: false,
            variance: ""
        })
    }

    const(flag: boolean) {
        return new ZsTypeVar({
            ...this._def,
            const: flag
        })
    }

    variance(variance: ZsTypeVarVariance) {
        return new ZsTypeVar({
            ...this._def,
            variance
        })
    }
}

export type ZsTypeVarTuple = [ZsTypeVar, ...ZsTypeVar[]]

export type ZsTypeVarVariance = "" | "in" | "out" | "inout"
