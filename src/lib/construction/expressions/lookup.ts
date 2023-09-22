import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";
import { ZodNamedTypeAny } from "../../zod-walker/types";

export interface ZsIndexedTypeDef<
    ZTarget extends ZodTypeAny,
    TKey extends keyof TypeOf<ZTarget>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsLookup;
    target: ZTarget;
    index: ZsMonoLike<TKey>;
}

export class ZsIndexedType<
    Target extends ZodTypeAny = ZodNamedTypeAny,
    Key extends keyof TypeOf<Target> = keyof TypeOf<Target>
> extends ZsMonoType<TypeOf<Target>[Key], ZsIndexedTypeDef<Target, Key>> {
    readonly actsLike = z.any();
    static create<
        ZTarget extends ZodTypeAny,
        TKey extends keyof TypeOf<ZTarget>
    >(what: ZTarget, key: ZsMonoLike<TKey>) {
        return new ZsIndexedType<ZTarget, TKey>({
            typeName: ZsTypeKind.ZsLookup,
            target: what,
            index: key
        });
    }
}
