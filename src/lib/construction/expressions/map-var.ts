import { ZsMonoLike, ZsMonoType } from "../mono-type"
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../kinds"
import { ZodKindedAny } from "zod-tools"

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
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new ZsMapVar<In>({
            typeName: ZsTypeKind.ZsMapVar,
            name,
            in: in_
        })
    }
}
