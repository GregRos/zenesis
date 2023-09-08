import { Reification, ZsTypeVar, ZsTypeVarsRecord } from "./type-var";
import { ZodAny, ZodFunction, ZodTypeAny } from "zod";
import { ZsGenericFunction } from "../../expressions/generic-function";
import { Generic } from "./generic-type";
import { TypeVarBuilder } from "./type-var-builder";
import { ZsDeclaredType } from "../../refs";
import { ZsFunction } from "../../expressions/function";

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
        );
    }

    where<
        Name extends Names,
        NewExtends extends ZodTypeAny = Vars[Name]["_def"]["extends"],
        NewDefault extends ZodTypeAny | null = Vars[Name]["_def"]["default"]
    >(
        name: Name,
        declarator: (
            w: TypeVarBuilder<
                Vars[Name]["_def"]["extends"],
                Vars[Name]["_def"]["default"]
            > &
                Reification<Names, Vars>
        ) => TypeVarBuilder<NewExtends, NewDefault>
    ): GenericBuilder<
        Names,
        {
            [K in keyof Vars]: K extends Name
                ? ZsTypeVar<NewExtends, NewDefault>
                : Vars[K];
        }
    > {
        return new GenericBuilder(this._names, {
            ...this._vars,
            [name]: declarator(new TypeVarBuilder(this._vars[name]) as any)
        }) as any;
    }

    declare<Instance extends ZsDeclaredType<any>>(
        constructor: (reification: Reification<Names, Vars>) => Instance
    ): Generic<Vars, Instance> {
        const instance = constructor(this._vars);
        return new Generic<Vars, Instance>({
            instance: instance,
            ordering: this._names,
            vars: this._vars
        });
    }

    function<Function extends ZsFunction<any, any>>(
        constructor: (reification: Reification<Names, Vars>) => Function
    ): ZsGenericFunction<Vars, Function> {
        const instance = constructor(this._vars);
        return new ZsGenericFunction({
            typeName: "ZsGenericFunction",
            function: instance,
            ordering: this._names,
            typeArgs: this._vars
        });
    }
}
