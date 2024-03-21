import { ZodAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../../core/kinds"
import { ZsMonoType } from "../../core/mono-type"

export interface ZsThisDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsThis
}

export class ZsThis extends ZsMonoType<any, ZsThisDef> {
    readonly actsLike = ZodAny.create()
    static create() {
        return new ZsThis({ typeName: ZsTypeKind.ZsThis })
    }
}
