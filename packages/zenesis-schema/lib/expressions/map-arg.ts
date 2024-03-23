import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"

export interface ZsMapVarDef<In extends ZsMonoLike<any>> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMappingKeyRef
    name: string
    in: In
}

export class ZsMappingKeyRef<
    ZIn extends ZodTypeAny = ZodKindedAny
> extends ZsMonoType<TypeOf<ZIn>, ZsMapVarDef<ZIn>> {
    readonly actsLike = this._def.in
    readonly declaration = "mappingVar"
    readonly name = this._def.name
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new ZsMappingKeyRef<In>({
            typeName: ZsTypeKind.ZsMappingKeyRef,
            name,
            in: in_
        })
    }
}
