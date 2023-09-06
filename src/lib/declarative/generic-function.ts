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
import { ZodiTypeVars } from "./type-var";
import { ZodiMonoType } from "../mono-type";

export class ZodiGenericFunction<
    Args extends ZodTuple<any, any> = ZodTuple<[], null>,
    Returns extends ZodTypeAny = ZodTypeAny,
    TypeVars extends ZodiTypeVars = []
> extends ZodiMonoType<
    OuterTypeOfFunction<Args, Returns>,
    ZvGenericFunctionDef<Args, Returns, TypeVars>
> {
    private _fun: ZodFunction<Args, Returns>;

    constructor(def: ZvGenericFunctionDef<Args, Returns, TypeVars>) {
        super(def);
        this._fun = new ZodFunction({
            ...def,
            typeName: ZodFirstPartyTypeKind.ZodFunction
        });
    }

    returns<NewReturnType extends ZodTypeAny>(
        returnType: NewReturnType
    ): ZodiGenericFunction<Args, NewReturnType, TypeVars> {
        return new ZodiGenericFunction({
            ...this._def,
            returns: returnType
        });
    }

    typeVars<TypeVars extends ZodiTypeVars>(
        ...tVars: TypeVars
    ): ZodiGenericFunction<Args, Returns, TypeVars> {
        return new ZodiGenericFunction({
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
    ): ZodiGenericFunction<
        ZodTuple<Args2, Args["_def"]["rest"]>,
        Returns,
        TypeVars
    > {
        return new ZodiGenericFunction({
            ...this._def,
            args: z.tuple(args, this._def.args._def.rest)
        });
    }

    restArgs<Rest extends ZodTypeAny>(
        rest: Rest
    ): ZodiGenericFunction<ZodTuple<Args["items"], Rest>, Returns, TypeVars> {
        return new ZodiGenericFunction({
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

export interface ZvGenericFunctionDef<
    Args extends ZodTuple<any, any>,
    Returns extends ZodTypeAny,
    TypeVars extends ZodiTypeVars
> extends ZodTypeDef {
    args: Args;
    returns: Returns;
    typeName: "ZvGenericFunction";
    typeVars: TypeVars;
}
