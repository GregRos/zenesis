import { RecordType, TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"
import { ZsMappingKeyRef } from "./map-arg"

export interface ZsMappedDef<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>,
    Mapping extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMapped
    var: ZsMappingKeyRef<In>
    keyType: As
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
        mapping: (var_: ZsMappingKeyRef<ZIn>) => As
    ) {
        const result = mapping(this._def.var)
        return new ZsMapped<ZIn, As, ZMapping>({
            ...this._def,
            keyType: mapping(this._def.var)
        })
    }

    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMappingKeyRef<ZIn>) => Mapping
    ) {
        const mappingResult = mapping(this._def.var)
        return new ZsMapped<ZIn, ZAs, Mapping>({
            ...this._def,
            value: mappingResult
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
        const var_ = ZsMappingKeyRef.create(name, in_)
        return new ZsMapped<In, In, In>({
            typeName: ZsTypeKind.ZsMapped,
            var: var_,
            keyType: var_ as any,
            value: z.never() as any,
            modifiers: {
                readonly: null,
                optional: null
            }
        }) as any
    }

    readonly actsLike = z.record(this._def.keyType, this._def.value)
}

export interface ZsMappedBuilderValue<
    In extends ZodTypeAny,
    As extends ZsMonoLike<PropertyKey>
> extends ZsMappedBuilderKey<In> {
    value<Mapping extends ZodTypeAny>(
        mapping: (var_: ZsMappingKeyRef<In>) => Mapping
    ): ZsMapped<In, As, Mapping>
}

export interface ZsMappedBuilderKey<In extends ZodTypeAny> {
    key<As extends ZsMonoLike<PropertyKey>>(
        mapping: (var_: ZsMappingKeyRef<In>) => As
    ): ZsMappedBuilderValue<In, As>
}
export interface ZsMappedTypeModifiers {
    readonly: ZsModifierState
    optional: ZsModifierState
}
export type ZsModifierState = "+" | "-" | "normal" | null
