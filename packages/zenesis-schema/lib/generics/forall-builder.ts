import { ZodAny } from "zod"
import { ZsStructural } from "../core/misc-node"
import { ZsFunction } from "../expressions/function"
import { ZsGenericFunction } from "../expressions/generic-function"
import { ZsGeneralizable } from "../utils/unions"
import { TypeVarRefsByName, getTypeArgObject } from "./ref-objects"
import { ZsTypeVar, ZsTypeVars } from "./type-var"

export interface ZsForallDef<Vars extends ZsTypeVars> {
    vars: Vars
}

/**
 * Builds a set of type variables. The number and names of the type vars is predetermined,
 * but this object lets you place constraints on them by name,
 */
export class ForallFunctionBuilder<
    Vars extends ZsTypeVars = ZsTypeVars
> extends ZsStructural<ZsForallDef<Vars>> {
    static create<Names extends [string, ...string[]]>(
        ...names: Names
    ): ForallFunctionBuilder<{
        [I in keyof Names]: ZsTypeVar<Names[I], ZodAny, null>
    }> {
        return new ForallFunctionBuilder({
            vars: names.map(name => ZsTypeVar.create(name)) as any
        }) as any
    }
    where<Name extends Vars[number]["name"], NewVar extends ZsTypeVar<Name>>(
        name: Name,
        declarator: (
            cur: Extract<Vars[number], { name: Name }>,
            others: TypeVarRefsByName<Vars>
        ) => NewVar
    ): ForallFunctionBuilder<{
        [I in keyof Vars]: Vars[I]["name"] extends Name ? NewVar : Vars[I]
    }> {
        const refs = getTypeArgObject(this._def.vars)
        return new ForallFunctionBuilder({
            vars: this._def.vars.map(v =>
                v.name === name ? declarator(v as any, refs) : v
            ) as any
        })
    }

    private _wrapOne(input: ZsGeneralizable) {
        if (input instanceof ZsFunction) {
            return ZsGenericFunction.create(this._def.vars, input)
        } else {
            throw new Error("Invalid forallable")
        }
    }

    define<Result extends ZsFunction>(
        builder: (args: TypeVarRefsByName<Vars>) => Result
    ): ZsGenericFunction<Vars, Result>
    define(builder: Function): any {
        const refs = getTypeArgObject(this._def.vars)
        let result = builder(refs)
        return [...result].map(x => this._wrapOne(x))
    }
}
