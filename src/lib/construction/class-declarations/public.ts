import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZodKindedAny } from "zod-tools"
import { ZsMonoType } from "../mono-type"
import { ZsTypeKind } from "../kinds"

export interface ZsAccessDef<ZType extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsAccess
    innerType: ZType
    access: "public" | "protected" | "private"
}

export class ZsAccess<
    ZType extends ZodTypeAny = ZodKindedAny
> extends ZsMonoType<TypeOf<ZType>, ZsAccessDef<ZType>> {
    get actsLike() {
        return this._def.innerType
    }

    static create<ZType extends ZodTypeAny>(
        access: "public" | "protected" | "private",
        type: ZType
    ) {
        return new ZsAccess({
            typeName: ZsTypeKind.ZsAccess,
            innerType: type,
            access
        })
    }
}
