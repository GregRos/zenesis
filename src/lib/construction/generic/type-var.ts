import { z, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";

export interface ZsTypeVarRef<Extends> extends ZsMonoLike<Extends> {
    readonly declaration: "typeVar";
}

export class ZsTypeVar<
        Extends extends ZodTypeAny = ZodTypeAny,
        Default extends
            SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
    >
    extends ZsMonoType<Extends, ZsTypeVarDef<Extends, Default>>
    implements ZsTypeVarRef<Extends>
{
    readonly declaration = "typeVar";

    static create(name: string) {
        return new ZsTypeVar({
            typeName: ZsTypeKind.ZsTypeVar,
            name,
            extends: z.any(),
            default: null,
            const: false,
            variance: ""
        });
    }

    actsLike = this._def.extends;
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
    readonly typeName: ZsTypeKind.ZsTypeVar;
    readonly name: string;
    readonly extends: Extends;
    readonly default: Default;
    readonly const: boolean;
    readonly variance: ZsTypeVarVariance;
}
