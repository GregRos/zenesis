import {
    ParseInput,
    ParseReturnType,
    TypeOf,
    z,
    ZodAny,
    ZodTypeAny
} from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsDeclaredDef, ZsDeclaredType } from "./general";

export type ZsTypeVarVariance = "" | "in" | "out" | "inout";

export interface ZsTypeVarDef<
    Constraint extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Constraint> | null,
    Name extends string
> extends ZsDeclaredDef {
    typeName: "ZsTypeVar";
    name: Name;
    constraint: Constraint;
    default: Default;
    const: boolean;
    variance: ZsTypeVarVariance;
}

export class ZsTypeVar<
    Constraint extends ZodTypeAny = ZodAny,
    Default extends SchemaSubtypeOf<Constraint> | null = null,
    Name extends string = string
> extends ZsDeclaredType<
    TypeOf<Constraint>,
    ZsTypeVarDef<Constraint, Default, Name>
> {
    readonly declaration = "typeVar";
    _default!: Default;

    readonly actsLike = z.lazy(() => this._def.constraint);

    extends<
        NewConstraint extends
            Default extends SchemaSubtypeOf<NewConstraint> | null
                ? ZodTypeAny
                : never
    >(constraint: NewConstraint): ZsTypeVar<NewConstraint, Default, Name> {
        return new ZsTypeVar({
            ...this._def,
            constraint
        });
    }

    defaults<NewDefault extends SchemaSubtypeOf<Constraint> | null>(
        value: NewDefault
    ): ZsTypeVar<Constraint, NewDefault, Name>;
    defaults(value: any) {
        return new ZsTypeVar({
            ...this._def,
            default: value ?? null
        });
    }

    const(yes: boolean = true): ZsTypeVar<Constraint, Default, Name> {
        return new ZsTypeVar({
            ...this._def,
            const: yes
        });
    }

    variance(
        variance: ZsTypeVarVariance = ""
    ): ZsTypeVar<Constraint, Default, Name> {
        return new ZsTypeVar({
            ...this._def,
            variance
        });
    }

    static create<Name extends string>(
        name: Name
    ): ZsTypeVar<ZodAny, null, Name> {
        return new ZsTypeVar({
            typeName: "ZsTypeVar",
            name,
            constraint: z.any(),
            const: false,
            variance: "",
            default: null
        });
    }
}

export type ZsTypeVarAny = ZsTypeVar<
    ZodTypeAny,
    SchemaSubtypeOf<ZodTypeAny> | null
>;
export type ZsTypeVars = [ZsTypeVarAny, ...ZsTypeVarAny[]] | [];

export const $typeVar = ZsTypeVar.create;
