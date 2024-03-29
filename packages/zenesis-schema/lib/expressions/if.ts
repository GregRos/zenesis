import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
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

    static create<ZWhat extends ZodTypeAny>(
        what: ZWhat
    ): ZsConditionalExtends<ZWhat> {
        return {
            extends(extends_: any) {
                return {
                    then(then) {
                        return {
                            else(else_) {
                                return new ZsIf({
                                    typeName: ZsTypeKind.ZsConditional,
                                    what,
                                    extends: extends_(),
                                    then: then(),
                                    else: else_
                                })
                            }
                        }
                    }
                }
            }
        }
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
