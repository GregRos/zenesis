import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"

export interface ZsKeyofDef<Of extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsKeyof
    of: Of
}

export const PropertyKey = z.union([z.string(), z.number(), z.symbol()])

export class ZsKeyof<ZOf extends ZodTypeAny = ZodKindedAny> extends ZsMonoType<
    keyof TypeOf<ZOf>,
    ZsKeyofDef<ZOf>
> {
    readonly actsLike = PropertyKey as ZsMonoLike<keyof ZOf>

    get of() {
        return this._def.of
    }

    static create<Container extends ZodTypeAny>(what: Container) {
        return new ZsKeyof<Container>({
            typeName: ZsTypeKind.ZsKeyof,
            of: what
        })
    }
}
