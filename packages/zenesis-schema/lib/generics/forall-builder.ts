import { ZodAny } from "zod"
import { ZsStructural } from "../core/misc-node"
import { ZsFunction } from "../expressions/function"
import { ZsGeneralizable } from "../utils/unions"
import { isGeneralizableType } from "../utils/validate/is-type"
import { ZsGeneric } from "./generic"
import { ZsGenericFunction } from "./generic-function"
import { Generalize } from "./makable"
import {
    TypeVarRefs,
    TypeVarRefsByName,
    getTypeArgArray,
    getTypeArgObject
} from "./ref-objects"
import { FromVar, TypeVar, ZsTypeVarRef, ZsTypeVarRefs } from "./type-var"

export interface ZsForallDef<Vars extends ZsTypeVarRefs> {
    vars: Vars
}

/**
 * Builds a set of type variables. The number and names of the type vars is predetermined,
 * but this object lets you place constraints on them by name,
 */
export class ForallClause<
    Vars extends ZsTypeVarRefs = ZsTypeVarRefs
> extends ZsStructural<ZsForallDef<Vars>> {
    static create<Names extends [string, ...string[]]>(
        ...names: Names
    ): ForallClause<{
        [I in keyof Names]: ZsTypeVarRef<Names[I], ZodAny, null>
    }> {
        return new ForallClause({
            vars: names.map(name => TypeVar.create(name)) as any
        }) as any
    }
    where<Name extends Vars[number]["name"], NewVar extends TypeVar<Name>>(
        name: Name,
        declarator: (
            cur: Extract<Vars[number], { name: Name }>,
            others: TypeVarRefsByName<Vars>
        ) => NewVar
    ): ForallClause<{
        [I in keyof Vars]: Vars[I]["name"] extends Name
            ? FromVar<NewVar>
            : Vars[I]
    }> {
        const refs = getTypeArgObject(this._def.vars)
        return new ForallClause({
            vars: this._def.vars.map(v =>
                v.name === name ? declarator(v as any, refs) : v
            ) as any
        })
    }

    private _wrapOne(input: ZsGeneralizable) {
        if (input instanceof ZsFunction) {
            return ZsGenericFunction.create(this._def.vars, input)
        } else if (isGeneralizableType(input)) {
            return ZsGeneric.create(input, this._def.vars)
        } else {
            throw new Error("Invalid forallable")
        }
    }

    define<Result extends ZsGeneralizable>(
        builder: (...args: TypeVarRefs<Vars>) => Result
    ): Generalize<Vars, Result>
    define(builder: Function): any {
        const refs = getTypeArgArray(this._def.vars)
        let result = builder(...refs)
        return [...result].map(x => this._wrapOne(x))
    }
}
