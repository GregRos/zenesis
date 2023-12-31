import { AnyZodTuple, z, ZodTuple, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../mono-type"
import { InnerTypeOfFunction } from "zod/lib/types"
import { ZsTypeKind } from "../kinds"
import { ZsTypeVarsRecord } from "../generic/type-var"

export interface ZsFunctionDef<
    ZParams extends AnyZodTuple,
    ZReturns extends ZodTypeAny,
    ZTypeArgs extends ZsTypeVarsRecord
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsFunction
    args: ZParams
    returns: ZReturns
    typeVars: ZTypeArgs
    typeVarOrdering: (keyof ZTypeArgs)[]
}

export class ZsFunction<
    ZTuple extends AnyZodTuple = AnyZodTuple,
    ZReturns extends ZodTypeAny = ZodTypeAny,
    ZTypeArgs extends ZsTypeVarsRecord = ZsTypeVarsRecord
> extends ZsMonoType<
    InnerTypeOfFunction<ZTuple, ZReturns>,
    ZsFunctionDef<ZTuple, ZReturns, ZTypeArgs>
> {
    readonly actsLike = z.function(this._def.args, this._def.returns)

    private get _rest() {
        return this._def.args._def.rest
    }

    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsFunction<
        ZodTuple<Args, this["_def"]["args"]["_def"]["rest"]>,
        ZReturns,
        ZTypeArgs
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
        ZReturns,
        ZTypeArgs
    > {
        return new ZsFunction({
            ...this._def,
            args: this._def.args.rest(rest)
        })
    }

    returns<Return2 extends ZodTypeAny>(
        returns: Return2
    ): ZsFunction<ZTuple, Return2, ZTypeArgs> {
        return new ZsFunction({
            ...this._def,
            returns
        })
    }

    static create<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        args: Args
    ): ZsRestBuilder<ZodTuple<Args, null>> {
        return new ZsFunction({
            typeName: ZsTypeKind.ZsFunction,
            args: z.tuple(args),
            returns: z.unknown(),
            typeVars: {},
            typeVarOrdering: []
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
