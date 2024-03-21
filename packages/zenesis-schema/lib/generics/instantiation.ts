import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoType } from "../core/mono-type"
import { ZsShapedRef } from "../core/types"
import { ZsMakable, ZsMakeResultType } from "../utils/unions"

export interface ZsInstantiationDef<Instance extends ZsMakeResultType>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsInstantiation
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    instance: Instance
    makable: ZsMakable
}
export class ZsMade<
    Ref extends ZsMakeResultType = ZsMakeResultType
> extends ZsMonoType<TypeOf<Ref>, ZsInstantiationDef<Ref>> {
    get declaration(): Ref extends ZsShapedRef
        ? Ref["declaration"]
        : undefined {
        if ("declaration" in this.actsLike) {
            return this.actsLike.declaration as any
        }
        return undefined as any
    }
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
