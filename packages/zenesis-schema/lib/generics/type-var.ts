import { ZodTypeAny, ZodUnknown } from "zod"
import { ZsMemberKind } from "../core/member-kind"
import { ZsStructural } from "../core/misc-node"
import { SchemaSubtypeOf } from "../core/operators"
import { ZsTypeArg } from "./type-arg"

export interface ZsTypeVarDef<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> {
    readonly memberName: ZsMemberKind.ZsTypeVar
    readonly name: Name
    readonly extends: Extends
    readonly default: Default
    readonly const: boolean
    readonly variance: ZsTypeVarVariance
}

export type ZsTypeVars = [ZsTypeVar, ...ZsTypeVar[]]
export type ZsTypeVarVariance = "" | "in" | "out" | "inout"

export class ZsTypeVar<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsStructural<ZsTypeVarDef<Name, Extends, Default>> {
    readonly arg = ZsTypeArg.create(this)
    readonly name = this._def.name
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
            memberName: ZsMemberKind.ZsTypeVar,
            name,
            const: false,
            extends: ZodUnknown.create(),
            default: null,
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
