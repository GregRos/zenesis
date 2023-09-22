import { Reification, ZsTypeVar, ZsTypeVarsRecord } from "./type-var";
import { ZodAny, ZodTypeAny } from "zod";
import { ZsGenericFunction } from "../expressions/generic-function";
import { ZsGenericType } from "./generic-type";
import { TypeVarBuilder } from "./type-var-builder";
import { ZsDeclaredType } from "../refs";
import { ZsFunction } from "../expressions/function";
import { ZsModuleDeclKind, ZsTypeCtorKind, ZsTypeKind } from "../kinds";
import { ZsTypeCtors } from "../expressions/instantiation";

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
                : Vars[K];
        }
    > {
        return new GenericBuilder(this._names, {
            ...this._vars,
            [name]: declarator(new TypeVarBuilder(this._vars[name]) as any)
        }) as any;
    }

    declare<Instance extends ZsTypeCtors>(
        constructor: (reification: Reification<Names, Vars>) => Instance
    ): ZsGenericType<Vars, Instance>;
    declare<Function extends ZsFunction<any, any>>(
        constructor: (reification: Reification<Names, Vars>) => Function
    ): ZsGenericFunction<Vars, Function>;
    declare(constructor: (reification: Reification<Names, Vars>) => any): any {
        const result = constructor(this._vars);
        if (result instanceof ZsFunction) {
            return new ZsGenericFunction({
                typeName: ZsTypeKind.ZsGenericFunction,
                function: result,
                ordering: this._names,
                typeArgs: this._vars
            });
        } else {
            return new ZsGenericType({
                typeName: ZsTypeKind.GenericZsType,
                instance: result,
                ordering: this._names,
                vars: this._vars
            });
        }
    }

    function<Function extends ZsFunction<any, any>>(
        constructor: (reification: Reification<Names, Vars>) => Function
    ): ZsGenericFunction<Vars, Function> {
        const instance = constructor(this._vars);
        return new ZsGenericFunction({
            typeName: ZsTypeKind.ZsGenericFunction,
            function: instance,
            ordering: this._names,
            typeArgs: this._vars
        });
    }
}
