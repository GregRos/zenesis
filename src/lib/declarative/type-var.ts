import { z, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsMonoType } from "../mono-type";

export class ZsTypeVar<
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsMonoType<Extends, ZsTypeVarDef<Extends, Default>> {
    static create(name: string) {
        return new ZsTypeVar({
            typeName: "ZsTypeVar",
            name,
            extends: z.any(),
            default: null,
            const: false,
            variance: ""
        });
    }

    actsLike = this._def.extends;
}

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
        );
    }

    default<Default extends SchemaSubtypeOf<Extends> | null>(
        defaultValue: Default
    ): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                default: defaultValue
            })
        );
    }

    const(constant: boolean): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                const: constant
            })
        );
    }

    variance(variance: ZsTypeVarVariance): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                variance
            })
        );
    }
}

export type ZsTypeVarsRecord<Names extends string = any> = {
    [K in Names]: ZsTypeVar;
};
export type Reification<
    Names extends keyof Vars,
    Vars extends ZsTypeVarsRecord
> = {
    [K in Names]: Vars[K]["_def"]["extends"];
};

export type ZsTypeVarVariance = "" | "in" | "out" | "inout";

export interface ZsTypeVarDef<
    Extends extends ZodTypeAny = any,
    Default extends SchemaSubtypeOf<Extends> | null = any
> extends ZodTypeDef {
    readonly typeName: "ZsTypeVar";
    readonly name: string;
    readonly extends: Extends;
    readonly default: Default;
    readonly const: boolean;
    readonly variance: ZsTypeVarVariance;
}
