import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"

export class ZsIf<
    ZSubject extends ZodTypeAny = ZodKindedAny,
    ZExtends extends ZodTypeAny = ZodKindedAny,
    Then extends ZodTypeAny = ZodKindedAny,
    Else extends ZodTypeAny = ZodKindedAny
> extends ZsMonoType<
    TypeOf<Then> | TypeOf<Else>,
    ZsIfDef<ZSubject, ZExtends, Then, Else>
> {
    readonly actsLike = this._def.then.or(this._def.else)

    extends<Extends2 extends ZodTypeAny>(extends2: Extends2) {
        return new ZsIf<ZSubject, Extends2, Then, Else>({
            ...this._def,
            extends: extends2
        })
    }

    then<ZThen extends ZodTypeAny>(then: ZThen) {
        return new ZsIf<ZSubject, ZExtends, ZThen>({
            ...this._def,
            then: then
        })
    }

    static create<ZWhat extends ZodTypeAny>(
        what: ZWhat
    ): ZsConditionalExtends<ZWhat> {
        return new ZsIf({
            typeName: ZsTypeKind.ZsConditional,
            what: what,
            extends: z.never(),
            then: z.never(),
            else: z.never()
        })
    }

    else<ZElse extends ZodTypeAny>(else_: ZElse) {
        return new ZsIf<ZSubject, ZExtends, Then, ZElse>({
            ...this._def,
            else: else_
        })
    }
}

export interface ZsIfDef<
    ZSubject extends ZodTypeAny,
    ZExtends extends ZodTypeAny,
    ZThen extends ZodTypeAny,
    ZElse extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsConditional
    what: ZSubject
    extends: ZExtends
    then: ZThen
    else: ZElse
}

export interface ZsConditionalExtends<ZWhat extends ZodTypeAny> {
    extends<ZExtends extends ZodTypeAny>(
        extends_: ZExtends
    ): ZsConditionalThen<ZWhat, ZExtends>
}

export interface ZsConditionalThen<
    ZWhat extends ZodTypeAny,
    ZExtends extends ZodTypeAny
> extends ZsConditionalExtends<ZWhat> {
    then<ZThen extends ZodTypeAny, ZOtherwise extends ZodTypeAny>(
        then: ZThen
    ): ZsConditionalElse<ZWhat, ZExtends, ZThen>
}

export interface ZsConditionalElse<
    ZWhat extends ZodTypeAny,
    ZExtends extends ZodTypeAny,
    ZThen extends ZodTypeAny
> extends ZsConditionalThen<ZWhat, ZExtends> {
    else<ZElse extends ZodTypeAny>(
        else_: ZElse
    ): ZsIf<ZWhat, ZExtends, ZThen, ZElse>
}
