import { RecordType, TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { VsMapVar } from "./map-var";
import { ZsMonoLike, ZsMonoType } from "../mono-type";

export interface ZsMappedDef<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>,
    Mapping extends ZodTypeAny
> extends ZodTypeDef {
    typeName: "ZsMapped";
    var: VsMapVar<In>;
    key: As;
    value: Mapping;
}

export class ZsMapped<
        In extends ZodTypeAny,
        As extends ZsMonoLike<PropertyKey>,
        Mapping extends ZodTypeAny
    >
    extends ZsMonoType<
        RecordType<TypeOf<As>, Mapping>,
        ZsMappedDef<In, As, Mapping>
    >
    implements ZsMappedBuilderValue<In, As>
{
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: VsMapVar<In>) => As
    ) {
        return new ZsMapped<In, As, Mapping>({
            ...this._def,
            key: mapping(this._def.var)
        });
    }

    value<Mapping extends ZodTypeAny>(
        mapping: (var_: VsMapVar<In>) => Mapping
    ) {
        return new ZsMapped<In, As, Mapping>({
            ...this._def,
            value: mapping(this._def.var)
        });
    }

    static create<In extends ZodTypeAny>(
        name: string,
        in_: In
    ): TypeOf<In> extends PropertyKey
        ? ZsMappedBuilderValue<In, In>
        : ZsMappedBuilderKey<In> {
        const var_ = VsMapVar.create(name, in_);
        return new ZsMapped<In, In, In>({
            typeName: "ZsMapped",
            var: var_,
            key: var_ as any,
            value: z.never() as any
        }) as any;
    }

    readonly actsLike = z.record(this._def.key, this._def.value);
}

export interface ZsMappedBuilderValue<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>
> extends ZsMappedBuilderKey<In> {
    value<Mapping extends ZodTypeAny>(
        mapping: (var_: VsMapVar<In>) => Mapping
    ): ZsMapped<In, As, Mapping>;
}

export interface ZsMappedBuilderKey<In extends ZodTypeAny> {
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: VsMapVar<In>) => As
    ): ZsMappedBuilderValue<In, As>;
}
