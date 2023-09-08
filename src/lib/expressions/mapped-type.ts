import { RecordType, TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeVarAny } from "../declarative/type-var";
import { VsMapVar } from "../declarative/source-var";

export interface ZsMappedDef<In, As extends PropertyKey, Value>
    extends ZodTypeDef {
    typeName: "ZsMapped";
    mapVar: VsMapVar<In, As>;
    value: ZsMonoLike<Value>;
}

export class ZsMapped<In, As extends PropertyKey, Value> extends ZsMonoType<
    RecordType<As, Value>,
    ZsMappedDef<In, As, Value>
> {
    readonly actsLike = z.record(this._def.mapVar._def.as, this._def.value);

    var(name: string) {}

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
