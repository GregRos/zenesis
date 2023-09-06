import {
    ParseInput,
    ParseReturnType,
    TypeOf,
    z,
    ZodAny,
    ZodTypeAny
} from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZodiDeclaredDef, ZodiDeclaredMonoType } from "./general";

export type ZodiTypeVarVariance = "" | "in" | "out" | "inout";

export interface ZodiTypeVarDef<
    Constraint extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Constraint> | null,
    Name extends string
> extends ZodiDeclaredDef {
    name: Name;
    constraint: Constraint;
    default: Default;
    const: boolean;
    variance: ZodiTypeVarVariance;
}

export class ZodiTypeVar<
    Constraint extends ZodTypeAny = ZodAny,
    Default extends SchemaSubtypeOf<Constraint> | null = null,
    Name extends string = string
> extends ZodiDeclaredMonoType<
    TypeOf<Constraint>,
    ZodiTypeVarDef<Constraint, Default, Name>
> {
    readonly declaration = "typeVar";
    _default!: Default;
    constructor(def: ZodiTypeVarDef<Constraint, Default, Name>) {
        super(def);
    }

    _parse(input: ParseInput): ParseReturnType<Constraint> {
        return this._def.constraint._parse(input);
    }

    extends<
        NewConstraint extends
            Default extends SchemaSubtypeOf<NewConstraint> | null
                ? ZodTypeAny
                : never
    >(constraint: NewConstraint): ZodiTypeVar<NewConstraint, Default, Name> {
        return new ZodiTypeVar({
            ...this._def,
            constraint
        });
    }

    defaults<NewDefault extends SchemaSubtypeOf<Constraint> | null>(
        value: NewDefault
    ): ZodiTypeVar<Constraint, NewDefault, Name>;
    defaults(value: any) {
        return new ZodiTypeVar({
            ...this._def,
            default: value ?? null
        });
    }

    const(yes: boolean = true): ZodiTypeVar<Constraint, Default, Name> {
        return new ZodiTypeVar({
            ...this._def,
            const: yes
        });
    }

    variance(
        variance: ZodiTypeVarVariance = ""
    ): ZodiTypeVar<Constraint, Default, Name> {
        return new ZodiTypeVar({
            ...this._def,
            variance
        });
    }

    static create<Name extends string>(
        name: Name
    ): ZodiTypeVar<ZodAny, null, Name> {
        return new ZodiTypeVar({
            name,
            constraint: z.any(),
            const: false,
            variance: "",
            default: null
        });
    }
}

export type ZodiTypeVarAny = ZodiTypeVar<
    ZodTypeAny,
    SchemaSubtypeOf<ZodTypeAny> | null
>;
export type ZodiTypeVars = [ZodiTypeVarAny, ...ZodiTypeVarAny[]] | [];

export const $typeVar = ZodiTypeVar.create;
