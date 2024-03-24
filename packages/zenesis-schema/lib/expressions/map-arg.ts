import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZodKindedAny } from "../core/types"

export interface ZsMappedKeyRefDef<In extends ZsMonoLike<any>>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMappingKeyRef
    name: string
    in: In
}

export class ZsMappedKeyRef<
    ZIn extends ZodTypeAny = ZodKindedAny
> extends ZsMonoType<TypeOf<ZIn>, ZsMappedKeyRefDef<ZIn>> {
    readonly actsLike = this._def.in
    readonly declaration = "mappingVar"
    readonly name = this._def.name
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new ZsMappedKeyRef<In>({
            typeName: ZsTypeKind.ZsMappingKeyRef,
            name,
            in: in_
        })
    }
}
