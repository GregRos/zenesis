import {
    Reification,
    TypeVarBuilder,
    ZsTypeVar,
    ZsTypeVarsRecord
} from "./type-var";
import { ZodAny, ZodFunction, ZodTypeAny } from "zod";
import { ZsDeclaration } from "./general";
import { ZsGenericFunction } from "./generic-function";
import { SchemaSubtypeOf } from "../utils";

import { ZsInstantiation } from "./instantiation";

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

    declare<Instance extends ZsDeclaration<any>>(
        constructor: (reification: Reification<Names, Vars>) => Instance
    ): Generic<Vars, Instance> {
        const instance = constructor(this._vars);
        return new Generic(this._names, this._vars, instance);
    }

    function<Function extends ZodFunction<any, any>>(
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

export class Generic<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZodTypeAny
> {
    constructor(
        private _ordering: (keyof Vars)[],
        private _vars: Vars,
        private _instance: Instance
    ) {}

    instantiate<
        TypeArgs extends {
            [Name in keyof Vars as Vars[Name] extends ZsTypeVar<any, null>
                ? Name
                : never]: SchemaSubtypeOf<Vars[Name]["_def"]["extends"]>;
        } & {
            [Name in keyof Vars]?: SchemaSubtypeOf<
                Vars[Name]["_def"]["extends"]
            >;
        }
    >(args: TypeArgs): ZsInstantiation<Instance> {
        const typeArgs = this._ordering.map(name => args[name]);
        return new ZsInstantiation({
            typeArgs: typeArgs as any,
            instance: this._instance,
            typeName: "ZsInstantiation"
        });
    }
}
