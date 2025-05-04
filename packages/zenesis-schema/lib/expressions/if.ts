import { TypeOf, ZodTypeAny, ZodTypeDef, z } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
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

    extends<ZExtends extends ZodTypeAny>(
        extends_: () => ZExtends
    ): ZsIf<ZSubject, ZExtends, Then, Else> {
        return new ZsIf({
            ...this._def,
            extends: extends_()
        })
    }

    then<ZThen extends ZodTypeAny>(
        then: () => ZThen
    ): ZsIf<ZSubject, ZExtends, ZThen, Else> {
        return new ZsIf({
            ...this._def,
            then: then()
        })
    }

    else<ZElse extends ZodTypeAny>(
        else_: ZElse
    ): ZsIf<ZSubject, ZExtends, Then, ZElse> {
        return new ZsIf({
            ...this._def,
            else: else_
        })
    }

    static create<ZSubject extends ZodTypeAny>(
        subject: ZSubject
    ): ZsConditionalExtends<ZSubject> {
        return new ZsIf({
            typeName: ZsTypeKind.ZsIf,
            subject: subject,
            extends: z.unknown(),
            then: z.never(),
            else: z.never()
        })
    }
}

export interface ZsIfDef<
    ZSubject extends ZodTypeAny,
    ZExtends extends ZodTypeAny,
    ZThen extends ZodTypeAny,
    ZElse extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsIf
    subject: ZSubject
    extends: ZExtends
    then: ZThen
    else: ZElse
}

export interface ZsConditionalExtends<ZWhat extends ZodTypeAny> {
    extends<ZExtends extends ZodTypeAny>(
        extends_: () => ZExtends
    ): ZsConditionalThen<ZWhat, ZExtends>
}

export interface ZsConditionalThen<
    ZWhat extends ZodTypeAny,
    ZExtends extends ZodTypeAny
> {
    then<ZThen extends ZodTypeAny>(
        then: () => ZThen
    ): ZsConditionalElse<ZWhat, ZExtends, ZThen>
}

export interface ZsConditionalElse<
    ZWhat extends ZodTypeAny,
    ZExtends extends ZodTypeAny,
    ZThen extends ZodTypeAny
> {
    else<ZElse extends ZodTypeAny>(
        else_: ZElse
    ): ZsIf<ZWhat, ZExtends, ZThen, ZElse>
}
