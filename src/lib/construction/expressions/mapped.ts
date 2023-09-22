import { RecordType, TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMapVar } from "./map-var";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";
import { ZodNamedTypeAny } from "../../zod-walker/types";

export interface ZsMappedDef<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>,
    Mapping extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMapped;
    var: ZsMapVar<In>;
    key: As;
    value: Mapping;
    modifiers: ZsMappedTypeModifiers;
}

export interface ZsMappedTypeModifiers {
    readonly: "add" | "remove" | "readonly" | null;
    optional: "add" | "remove" | "optional" | null;
}

export class ZsMapped<
        In extends ZodTypeAny = ZodNamedTypeAny,
        As extends ZsMonoLike<PropertyKey> = ZodNamedTypeAny,
        Mapping extends ZodTypeAny = ZodNamedTypeAny
    >
    extends ZsMonoType<
        RecordType<TypeOf<As>, Mapping>,
        ZsMappedDef<In, As, Mapping>
    >
    implements ZsMappedBuilderValue<In, As>
{
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: ZsMapVar<In>) => As
    ) {
        return new ZsMapped<In, As, Mapping>({
            ...this._def,
            key: mapping(this._def.var)
        });
    }

    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMapVar<In>) => Mapping
    ) {
        return new ZsMapped<In, As, Mapping>({
            ...this._def,
            value: mapping(this._def.var)
        });
    }

    modifier<M extends keyof ZsMappedTypeModifiers>(
        modifier: keyof ZsMappedTypeModifiers,
        state: ZsMappedTypeModifiers[M]
    ) {
        return new ZsMapped<In, As, Mapping>({
            ...this._def,
            modifiers: {
                ...this._def.modifiers,
                [modifier]: state
            }
        });
    }

    static create<In extends ZodTypeAny>(
        name: string,
        in_: In
    ): TypeOf<In> extends PropertyKey
        ? ZsMappedBuilderValue<In, In>
        : ZsMappedBuilderKey<In> {
        const var_ = ZsMapVar.create(name, in_);
        return new ZsMapped<In, In, In>({
            typeName: ZsTypeKind.ZsMapped,
            var: var_,
            key: var_ as any,
            value: z.never() as any,
            modifiers: {
                readonly: false,
                optional: false
            }
        }) as any;
    }

    readonly actsLike = z.record(this._def.key, this._def.value);
}

export interface ZsMappedBuilderValue<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>
> extends ZsMappedBuilderKey<In> {
    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMapVar<In>) => Mapping
    ): ZsMapped<In, As, Mapping>;
}

export interface ZsMappedBuilderKey<In extends ZodTypeAny> {
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: ZsMapVar<In>) => As
    ): ZsMappedBuilderValue<In, As>;
}
