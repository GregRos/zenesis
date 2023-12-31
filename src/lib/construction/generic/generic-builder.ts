import { Reification, ZsTypeVar, ZsTypeVarsRecord } from "./type-var"
import { AnyZodTuple, ZodAny, ZodTypeAny } from "zod"
import { ZsGenericType } from "./generic-type"
import { TypeVarBuilder } from "./type-var-builder"
import { ZsFunction } from "../expressions/function"
import { ZsTypeKind } from "../kinds"

export class GenericBuilder<
    Names extends string,
    Vars extends ZsTypeVarsRecord<Names>
> {
    constructor(
        private _names: Names[],
        private _vars: Vars
    ) {}

    static create<Names extends string>(...names: [Names, ...Names[]]) {
        return new GenericBuilder(
            names,
            {} as Record<Names, ZsTypeVar<ZodAny, null>>
        )
    }

    where<
        Name extends Names,
        NewExtends extends ZodTypeAny = Vars[Name]["_def"]["extends"],
        NewDefault extends ZodTypeAny | null = Vars[Name]["_def"]["defaultType"]
    >(
        name: Name,
        declarator: (
            w: TypeVarBuilder<
                Vars[Name]["_def"]["extends"],
                Vars[Name]["_def"]["defaultType"]
            > &
                Reification<Names, Vars>
        ) => TypeVarBuilder<NewExtends, NewDefault>
    ): GenericBuilder<
        Names,
        {
            [K in keyof Vars]: K extends Name
                ? ZsTypeVar<NewExtends, NewDefault>
                : Vars[K]
        }
    > {
        return new GenericBuilder(this._names, {
            ...this._vars,
            [name]: declarator(new TypeVarBuilder(this._vars[name]) as any)
        }) as any
    }

    class(constructor: (reification: Reification<Names, Vars>) => any): any {
        const result = constructor(this._vars)
        return new ZsGenericType({
            typeName: ZsTypeKind.ZsGenericType,
            innerType: result,
            ordering: this._names,
            vars: this._vars
        })
    }

    function<ZParams extends AnyZodTuple, ZReturn extends ZodTypeAny>(
        constructor: (
            reification: Reification<Names, Vars>
        ) => ZsFunction<ZParams, ZReturn>
    ): ZsFunction<ZParams, ZReturn, Vars> {
        const instance = constructor(this._vars)
        return new ZsFunction<ZParams, ZReturn, Vars>({
            ...instance._def,
            typeVarOrdering: this._names,
            typeVars: this._vars
        })
    }
}
