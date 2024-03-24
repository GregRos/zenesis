import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsShapedRef } from "../core/types"
import { ZsMakable, ZsMakeResultType } from "../utils/unions"

export interface ZsMadeDef<Instance extends ZsMakeResultType>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsInstantiation
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    instance: Instance
    makable: ZsMakable
}
export class ZsMade<
    Ref extends ZsMakeResultType = ZsMakeResultType
> extends ZsMonoType<TypeOf<Ref>, ZsMadeDef<Ref>> {
    static create<Made extends ZsMakeResultType>(
        instance: Made,
        makable: ZsMakable,
        typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    ): ZsMade<Made> {
        return new ZsMade({
            typeName: ZsTypeKind.ZsInstantiation,
            typeArgs,
            instance,
            makable
        })
    }

    get shape(): Ref extends ZsShapedRef ? Ref["shape"] : undefined {
        if ("shape" in this.actsLike) {
            return this.actsLike.shape as any
        }
        return undefined as any
    }

    get actsLike() {
        return this._def.instance
    }
}
