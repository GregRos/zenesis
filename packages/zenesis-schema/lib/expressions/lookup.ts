import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZodKindedAny } from "../core/types"

export interface ZsLookupDef<
    ZTarget extends ZodTypeAny,
    TKey extends keyof TypeOf<ZTarget>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsIndexedAccess
    target: ZTarget
    index: ZsMonoLike<TKey>
}

export class ZsLookup<
    ZSubject extends ZodTypeAny = ZodKindedAny,
    TKey extends keyof TypeOf<ZSubject> = keyof TypeOf<ZSubject>
> extends ZsMonoType<TypeOf<ZSubject>[TKey], ZsLookupDef<ZSubject, TKey>> {
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
