import {
    InnerTypeOfFunction,
    OuterTypeOfFunction,
    ParseInput,
    ParseReturnType,
    z,
    ZodFirstPartyTypeKind,
    ZodFunction,
    ZodTuple,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsTypeVars } from "./type-var";
import { ZsMonoType } from "../mono-type";

export class ZsGenericFunction<
    Args extends ZodTuple<any, any> = ZodTuple<[], null>,
    Returns extends ZodTypeAny = ZodTypeAny,
    TypeVars extends ZsTypeVars = []
> extends ZsMonoType<
    OuterTypeOfFunction<Args, Returns>,
    ZsGenericFunctionDef<Args, Returns, TypeVars>
> {
    private _fun: ZodFunction<Args, Returns>;

    constructor(def: ZsGenericFunctionDef<Args, Returns, TypeVars>) {
        super(def);
        this._fun = new ZodFunction({
            ...def,
            typeName: ZodFirstPartyTypeKind.ZodFunction
        });
    }

    returns<NewReturnType extends ZodTypeAny>(
        returnType: NewReturnType
    ): ZsGenericFunction<Args, NewReturnType, TypeVars> {
        return new ZsGenericFunction({
            ...this._def,
            returns: returnType
        });
    }

    typeVars<TypeVars extends ZsTypeVars>(
        ...tVars: TypeVars
    ): ZsGenericFunction<Args, Returns, TypeVars> {
        return new ZsGenericFunction({
            ...this._def,
            typeVars: tVars
        });
    }

    implement<F extends InnerTypeOfFunction<Args, Returns>>(
        func: F
    ): ReturnType<F> extends Returns["_output"]
        ? (...args: Args["_input"]) => ReturnType<F>
        : OuterTypeOfFunction<Args, Returns> {
        return this._fun.implement(func);
    }

    strictImplement(
        func: InnerTypeOfFunction<Args, Returns>
    ): InnerTypeOfFunction<Args, Returns> {
        return this._fun.strictImplement(func);
    }

    validate<F extends InnerTypeOfFunction<Args, Returns>>(
        func: F
    ): ReturnType<F> extends Returns["_output"]
        ? (...args: Args["_input"]) => ReturnType<F>
        : OuterTypeOfFunction<Args, Returns> {
        return this._fun.validate(func);
    }

    args<Args2 extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...args: Args2
    ): ZsGenericFunction<
        ZodTuple<Args2, Args["_def"]["rest"]>,
        Returns,
        TypeVars
    > {
        return new ZsGenericFunction({
            ...this._def,
            args: z.tuple(args, this._def.args._def.rest)
        });
    }

    restArgs<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZsGenericFunction<ZodTuple<Args["items"], Rest>, Returns, TypeVars> {
        return new ZsGenericFunction({
            ...this._def,
            args: this._def.args.rest(rest)
        });
    }

    _parse(
        input: ParseInput
    ): ParseReturnType<OuterTypeOfFunction<Args, Returns>> {
        return this._fun._parse(input);
    }
}

export interface ZsGenericFunctionDef<
    Args extends ZodTuple<any, any>,
    Returns extends ZodTypeAny,
    TypeVars extends ZsTypeVars
> extends ZodTypeDef {
    args: Args;
    returns: Returns;
    typeName: "ZsGenericFunction";
    typeVars: TypeVars;
}
