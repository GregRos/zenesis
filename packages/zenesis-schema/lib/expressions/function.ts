import { AnyZodTuple, z, ZodTuple, ZodTypeAny, ZodTypeDef } from "zod"
import { InnerTypeOfFunction } from "zod/lib/types"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../kinds"

export interface ZsFunctionDef<
    ZParams extends AnyZodTuple,
    ZReturns extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsFunction
    args: ZParams
    returns: ZReturns
}

export class ZsFunction<
    ZTuple extends AnyZodTuple = ZodTuple<any, any>,
    ZReturns extends ZodTypeAny = ZodTypeAny
> extends ZsMonoType<
    InnerTypeOfFunction<ZTuple, ZReturns>,
    ZsFunctionDef<ZTuple, ZReturns>
> {
    readonly actsLike = z.function(this._def.args, this._def.returns)

    private get _rest() {
        return this._def.args._def.rest
    }

    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsFunction<
        ZodTuple<Args, this["_def"]["args"]["_def"]["rest"]>,
        ZReturns
    > {
        const args = z.tuple(params)
        return new ZsFunction({
            ...this._def,
            args: this._rest ? args.rest(this._rest) : args
        })
    }

    rest<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZsFunction<
        ZodTuple<this["_def"]["args"]["_def"]["items"], Rest>,
        ZReturns
    > {
        return new ZsFunction({
            ...this._def,
            args: this._def.args.rest(rest)
        })
    }

    returns<Return2 extends ZodTypeAny>(
        returns: Return2
    ): ZsFunction<ZTuple, Return2> {
        return new ZsFunction({
            ...this._def,
            returns
        })
    }

    static create<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...args: Args
    ): ZsRestBuilder<ZodTuple<Args, null>> {
        return new ZsFunction({
            typeName: ZsTypeKind.ZsFunction,
            args: z.tuple(args),
            returns: z.unknown()
        })
    }
}

export interface ZsRestBuilder<Tuple extends AnyZodTuple> {
    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsRestBuilder<ZodTuple<Args, Tuple["_def"]["rest"]>>

    rest<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZsRestBuilder<ZodTuple<Tuple["_def"]["items"], Rest>>

    returns<Return extends ZodTypeAny>(
        returns: Return
    ): ZsFunction<Tuple, Return>
}
