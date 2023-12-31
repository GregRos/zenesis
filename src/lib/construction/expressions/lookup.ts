import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../mono-type"
import { ZsTypeKind } from "../kinds"
import { ZodKindedAny } from "zod-tools"

export interface ZsLookupDef<
    ZTarget extends ZodTypeAny,
    TKey extends keyof TypeOf<ZTarget>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsIndexedAccess
    target: ZTarget
    index: ZsMonoLike<TKey>
}

export class ZsLookup<
    ZTarget extends ZodTypeAny = ZodKindedAny,
    TKey extends keyof TypeOf<ZTarget> = keyof TypeOf<ZTarget>
> extends ZsMonoType<TypeOf<ZTarget>[TKey], ZsLookupDef<ZTarget, TKey>> {
    readonly actsLike = z.any()
    static create<
        ZTarget extends ZodTypeAny,
        TKey extends keyof TypeOf<ZTarget>
    >(what: ZTarget, key: ZsMonoLike<TKey>) {
        return new ZsLookup<ZTarget, TKey>({
            typeName: ZsTypeKind.ZsIndexedAccess,
            target: what,
            index: key
        })
    }
}
