import { ZodTypeAny } from "zod"
import { SchemaSubtypeOf } from "../../core/operators"
import { ZsTypeVar, ZsTypeVarVariance } from "./type-var"

export class TypeVarBuilder<
    Extends extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Extends> | null
> {
    constructor(private _var: ZsTypeVar<Extends, Default>) {}

    extends<
        Extends extends Default extends SchemaSubtypeOf<Extends> | null
            ? ZodTypeAny
            : never
    >(constraint: Extends): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder<Extends, Default>(
            new ZsTypeVar({
                ...this._var._def,
                extends: constraint
            })
        )
    }

    default<Default extends SchemaSubtypeOf<Extends> | null>(
        defaultValue: Default
    ): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                defaultType: defaultValue
            })
        )
    }

    const(constant: boolean): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                const: constant
            })
        )
    }

    variance(variance: ZsTypeVarVariance): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                variance
            })
        )
    }
}
