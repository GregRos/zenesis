import { AnyZodTuple, ZodAny, ZodTypeAny } from "zod"
import { ZsClass } from "../../declarations/classlike/class"
import { ZsInterface } from "../../declarations/classlike/interface"
import { ZsFunction } from "../../expressions/function"
import { ZsTypeAlias } from "../alias"
import { ZsDeclKind } from "../kind"
import { ZsGeneric } from "./generic"
import { Reification, ZsTypeVar, ZsTypeVarsRecord } from "./type-var"
import { TypeVarBuilder } from "./type-var-builder"

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

    class<ZClass extends ZsClass>(
        constructor: (reification: Reification<Names, Vars>) => ZClass
    ) {
        const result = constructor(this._vars)
        return new ZsGeneric({
            declName: ZsDeclKind.ZsGeneric,
            innerType: result,
            ordering: this._names,
            vars: this._vars
        })
    }

    interface<ZInterface extends ZsInterface>(
        constructor: (reification: Reification<Names, Vars>) => ZInterface
    ) {
        const result = constructor(this._vars)
        return new ZsGeneric({
            declName: ZsDeclKind.ZsGeneric,
            innerType: result,
            ordering: this._names,
            vars: this._vars
        })
    }

    alias<ZAlias extends ZsTypeAlias>(
        constructor: (reification: Reification<Names, Vars>) => ZAlias
    ) {
        const result = constructor(this._vars)
        return new ZsGeneric({
            declName: ZsDeclKind.ZsGeneric,
            innerType: result,
            ordering: this._names,
            vars: this._vars
        })
    }

    function<ZParams extends AnyZodTuple, ZReturn extends ZodTypeAny>(
        constructor: (
            reification: Reification<Names, Vars>
        ) => ZsFunction<ZParams, ZReturn, Vars>
    ) {
        const instance = constructor(this._vars)
        return new ZsFunction({
            ...instance._def,
            typeVarOrdering: this._names,
            typeVars: this._vars
        })
    }
}
