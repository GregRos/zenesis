import { RecordType, TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMapVar } from "./map-var"
import { ZsMonoLike, ZsMonoType } from "../mono-type"
import { ZsTypeKind } from "../kinds"
import { ZodKindedAny } from "zod-tools"
import { ZsMappedTypeModifiers } from "../modifier-states"

export interface ZsMappedDef<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>,
    Mapping extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMapped
    var: ZsMapVar<In>
    nameType: As
    value: Mapping
    modifiers: ZsMappedTypeModifiers
}

export class ZsMapped<
        ZIn extends ZodTypeAny = ZodKindedAny,
        ZAs extends ZsMonoLike<PropertyKey> = ZodKindedAny,
        ZMapping extends ZodTypeAny = ZodKindedAny
    >
    extends ZsMonoType<
        RecordType<TypeOf<ZAs>, ZMapping>,
        ZsMappedDef<ZIn, ZAs, ZMapping>
    >
    implements ZsMappedBuilderValue<ZIn, ZAs>
{
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: ZsMapVar<ZIn>) => As
    ) {
        return new ZsMapped<ZIn, As, ZMapping>({
            ...this._def,
            nameType: mapping(this._def.var)
        })
    }

    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMapVar<ZIn>) => Mapping
    ) {
        return new ZsMapped<ZIn, ZAs, Mapping>({
            ...this._def,
            value: mapping(this._def.var)
        })
    }

    modifier<M extends keyof ZsMappedTypeModifiers>(
        modifier: keyof ZsMappedTypeModifiers,
        state: ZsMappedTypeModifiers[M]
    ) {
        return new ZsMapped<ZIn, ZAs, ZMapping>({
            ...this._def,
            modifiers: {
                ...this._def.modifiers,
                [modifier]: state
            }
        })
    }

    static create<In extends ZodTypeAny>(
        name: string,
        in_: In
    ): TypeOf<In> extends PropertyKey
        ? ZsMappedBuilderValue<In, In>
        : ZsMappedBuilderKey<In> {
        const var_ = ZsMapVar.create(name, in_)
        return new ZsMapped<In, In, In>({
            typeName: ZsTypeKind.ZsMapped,
            var: var_,
            nameType: var_ as any,
            value: z.never() as any,
            modifiers: {
                readonly: null,
                optional: null
            }
        }) as any
    }

    readonly actsLike = z.record(this._def.nameType, this._def.value)
}

export interface ZsMappedBuilderValue<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>
> extends ZsMappedBuilderKey<In> {
    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMapVar<In>) => Mapping
    ): ZsMapped<In, As, Mapping>
}

export interface ZsMappedBuilderKey<In extends ZodTypeAny> {
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: ZsMapVar<In>) => As
    ): ZsMappedBuilderValue<In, As>
}
