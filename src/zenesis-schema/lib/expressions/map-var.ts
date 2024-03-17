import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"
import { ZsTypeKind } from "../kinds"

export interface ZsMapVarDef<In extends ZsMonoLike<any>> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsMapVar
    name: string
    in: In
}

export class ZsMapVar<ZIn extends ZodTypeAny = ZodKindedAny> extends ZsMonoType<
    TypeOf<ZIn>,
    ZsMapVarDef<ZIn>
> {
    readonly actsLike = this._def.in
    readonly declaration = "mappingVar"
    readonly name = this._def.name
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new ZsMapVar<In>({
            typeName: ZsTypeKind.ZsMapVar,
            name,
            in: in_
        })
    }
}
