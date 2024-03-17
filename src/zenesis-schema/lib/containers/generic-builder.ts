import { ZodAny, ZodTypeAny } from "zod"
import { GenericBuilder } from "../declarations/generics/generic-builder"
import { Instantiable } from "../declarations/generics/instantiable"
import {
    Reification,
    ZsTypeVar,
    ZsTypeVarsRecord
} from "../declarations/generics/type-var"
import { TypeVarBuilder } from "../declarations/generics/type-var-builder"
import { ZsForeignImport } from "./foreign-import"
import { ZsForeignModule } from "./foreign-module"

export class GenericConstraintBuilder<
    Names extends string,
    Vars extends ZsTypeVarsRecord<Names>
> {
    constructor(
        private _source: ZsForeignModule,
        private _names: Names[],
        private _vars: Vars
    ) {}

    static create<Names extends string>(
        source: ZsForeignModule,
        ...names: [Names, ...Names[]]
    ) {
        return new GenericConstraintBuilder(
            source,
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
    ): GenericConstraintBuilder<
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

    import<As = any>(name: string): Instantiable<Vars, ZsForeignImport> {
        return ZsForeignImport.create(this._source, name)
    }
}
