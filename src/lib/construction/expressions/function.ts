import {
    AnyZodTuple,
    z,
    ZodArray,
    ZodFunction,
    ZodTuple,
    ZodType,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoType } from "../mono-type";
import { InnerTypeOfFunction } from "zod/lib/types";
import { ZsTypeKind } from "../kind";

export interface ZsFunctionDef<
    Tuple extends AnyZodTuple,
    Return extends ZodTypeAny
> extends ZodTypeDef {
    typeName: ZsTypeKind.Function;
    args: Tuple;
    returns: Return;
}

export class ZsFunction<
    Tuple extends AnyZodTuple,
    Return extends ZodTypeAny
> extends ZsMonoType<
    InnerTypeOfFunction<Tuple, Return>,
    ZsFunctionDef<Tuple, Return>
> {
    readonly actsLike = z.function(this._def.args, this._def.returns);

    private get _rest() {
        return this._def.args._def.rest;
    }

    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsFunction<
        ZodTuple<Args, this["_def"]["args"]["_def"]["rest"]>,
        Return
    > {
        const args = z.tuple(params);
        return new ZsFunction({
            typeName: ZsTypeKind.Function,
            args: this._rest ? args.rest(this._rest) : args,
            returns: this._def.returns
        });
    }

    rest<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZsFunction<
        ZodTuple<this["_def"]["args"]["_def"]["items"], Rest>,
        Return
    > {
        return new ZsFunction({
            typeName: ZsTypeKind.Function,
            args: this._def.args.rest(rest),
            returns: this._def.returns
        });
    }

    returns<Return2 extends ZodTypeAny>(
        returns: Return2
    ): ZsFunction<Tuple, Return2> {
        return new ZsFunction({
            typeName: ZsTypeKind.Function,
            args: this._def.args,
            returns
        });
    }

    static create<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...args: Args
    ): ZsRestBuilder<ZodTuple<Args, null>> {
        return new ZsFunction({
            typeName: ZsTypeKind.Function,
            args: z.tuple(args),
            returns: z.unknown()
        });
    }
}

export interface ZsRestBuilder<Tuple extends AnyZodTuple> {
    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsRestBuilder<ZodTuple<Args, Tuple["_def"]["rest"]>>;

    rest<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZsRestBuilder<ZodTuple<Tuple["_def"]["items"], Rest>>;

    returns<Return extends ZodTypeAny>(
        returns: Return
    ): ZsFunction<Tuple, Return>;
}

export const fun = ZsFunction.create;
