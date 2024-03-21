import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoType } from "../core/mono-type"
import { ZodKindedAny } from "../core/types"

export class ZsConditional<
    ZWhat extends ZodTypeAny = ZodKindedAny,
    ZExtends extends ZodTypeAny = ZodKindedAny,
    ZThen extends ZodTypeAny = ZodKindedAny,
    ZElse extends ZodTypeAny = ZodKindedAny
> extends ZsMonoType<
    TypeOf<ZThen> | TypeOf<ZElse>,
    ZsConditionalDef<ZWhat, ZExtends, ZThen, ZElse>
> {
    readonly actsLike = this._def.then.or(this._def.otherwise)

    when<What2 extends ZodTypeAny>(what2: What2) {
        return new ZsConditional<What2, ZExtends, ZThen, ZElse>({
            ...this._def,
            what: what2
        })
    }

    extends<Extends2 extends ZodTypeAny>(extends2: Extends2) {
        return new ZsConditional<ZWhat, Extends2, ZThen, ZElse>({
            ...this._def,
            extends: extends2
        })
    }

    then<ZThen extends ZodTypeAny, ZElse extends ZodTypeAny>(
        then: ZThen,
        otherwise: ZElse
    ) {
        return new ZsConditional<ZWhat, ZExtends, ZThen, ZElse>({
            ...this._def,
            then: then,
            otherwise: otherwise
        })
    }

    static create<ZWhat extends ZodTypeAny>(
        what: ZWhat
    ): ZsConditionalExtends<ZWhat> {
        return new ZsConditional({
            typeName: ZsTypeKind.ZsConditional,
            what: what,
            extends: z.never(),
            then: z.never(),
            otherwise: z.never()
        })
    }
}

export interface ZsConditionalDef<
    ZWhat extends ZodTypeAny,
    ZExtends extends ZodTypeAny,
    ZThen extends ZodTypeAny,
    ZElse extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsConditional
    what: ZWhat
    extends: ZExtends
    then: ZThen
    otherwise: ZElse
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
        then: ZThen,
        otherwise: ZOtherwise
    ): ZsConditional<ZWhat, ZExtends, ZThen, ZOtherwise>
}
