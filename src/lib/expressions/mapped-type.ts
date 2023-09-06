import { SubtypeClause } from "./clause";
import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";

export type KeyIn = SubtypeClause<PropertyKey, PropertyKey>;

export type getMappedType<Clause extends KeyIn, Mapping extends ZodTypeAny> = {
    [K in TypeOf<Clause["supertype"]> as TypeOf<
        Clause["subtype"]
    >]: TypeOf<Mapping>;
};

export interface ZsMappedDef<
    Clause extends SubtypeClause,
    Mapping extends ZodTypeAny
> extends ZodTypeDef {
    typeName: "ZsMapped";
    clause: Clause;
    mapping: Mapping;
}

export class ZsMapped<
    Clause extends KeyIn,
    Mapping extends ZodTypeAny
> extends ZsMonoType<
    getMappedType<Clause, Mapping>,
    ZsMappedDef<Clause, Mapping>
> {
    readonly actsLike = z.lazy(() => z.record());

    get of() {
        return this._def.clause;
    }

    static create<Clause extends KeyIn, Mapping extends ZodTypeAny>(
        clause: Clause,
        mapping: Mapping
    ) {
        return new ZsMapped<Clause, Mapping>({
            typeName: "ZsMapped",
            clause,
            mapping
        });
    }
}
