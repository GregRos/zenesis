import { ZodAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"

export interface ZsThisDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsThis
}

export class ZsThis extends ZsMonoType<any, ZsThisDef> {
    readonly actsLike = ZodAny.create()
    static create() {
        return new ZsThis({ typeName: ZsTypeKind.ZsThis })
    }
}
