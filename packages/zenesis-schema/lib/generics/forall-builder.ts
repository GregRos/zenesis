import { ZodAny, ZodFunction } from "zod"
import { convertZodFunctionToZsFunction } from "../utils/normalize"
import { ZsGenericFunction } from "../expressions/forall-function"
import { ZsFunction } from "../expressions/function"
import { ZsStructural } from "../core/misc-node"
import { ZsGeneralizable, ZsMakeResultType } from "../utils/unions"
import { ZsGeneric } from "./forall-type"
import { ZsTypeVar, ZsTypeVarTuple } from "./type-var"

export interface ZsForallDef<Vars extends ZsTypeVarTuple> {
    vars: Vars
}

export type TypeVarRefsByName<Vars extends ZsTypeVarTuple> = {
    [Var in Vars[number] as Var["name"]]: Var["arg"]
}

export type TypeVarRefs<Vars extends ZsTypeVarTuple> = {
    [I in keyof Vars]: Vars[I]["arg"]
}

export const typeVar = Symbol("typeVar")

export type Generalize<
    Vars extends ZsTypeVarTuple,
    Schema extends ZsMakeResultType | ZsFunction
> = Schema extends ZsMakeResultType
    ? ZsGeneric<Schema, Vars>
    : Schema extends ZsFunction
      ? ZsGenericFunction<Vars, Schema>
      : never

export function getTypeArgObject<Vars extends ZsTypeVarTuple>(
    vars: Vars
): TypeVarRefsByName<Vars> {
    return Object.fromEntries(vars.map(v => [v.name, v.arg] as const)) as any
}

export function getTypeArgArray<Vars extends ZsTypeVarTuple>(
    vars: Vars
): TypeVarRefs<Vars> {
    return vars.map(v => v.arg) as any
}

/**
 * Builds a set of type variables. The number and names of the type vars is predetermined,
 * but this object lets you place constraints on them by name,
 */
export class Forall<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple
> extends ZsStructural<ZsForallDef<Vars>> {
    static create<Names extends [string, ...string[]]>(
        ...names: Names
    ): Forall<{
        [I in keyof Names]: ZsTypeVar<Names[I], ZodAny, null>
    }> {
        return new Forall({
            vars: names.map(name => ZsTypeVar.create(name)) as any
        }) as any
    }
    where<Name extends Vars[number]["name"], NewVar extends ZsTypeVar<Name>>(
        name: Name,
        declarator: (
            cur: Extract<Vars[number], { name: Name }>,
            others: TypeVarRefsByName<Vars>
        ) => NewVar
    ): Forall<{
        [I in keyof Vars]: Vars[I]["name"] extends Name ? NewVar : Vars[I]
    }> {
        const refs = getTypeArgObject(this._def.vars)
        return new Forall({
            vars: this._def.vars.map(v =>
                v.name === name ? declarator(v as any, refs) : v
            ) as any
        })
    }

    private _wrapOne(input: ZsGeneralizable) {
        if 
        if (input instanceof ZodFunction) {
            input = convertZodFunctionToZsFunction(input)
        }
        if (input instanceof ZsFunction) {
            return ZsGenericFunction.create(this._def.vars, input)
        } else if (isForallableType(input)) {
            return ZsGeneric.create(input, this._def.vars)
        } else {
            throw new Error("Invalid forallable")
        }
    }

    define<Result extends ZsForallable>(
        builder: (...args: TypeVarRefs<Vars>) => Result
    ): Generalize<Vars, Result>
    define<Result extends ZsForallable>(
        builder: (...args: TypeVarRefs<Vars>) => Iterable<Result>
    ): Iterable<Generalize<Vars, Result>>
    define(builder: Function): any {
        const refs = getTypeArgArray(this._def.vars)
        let result = builder(...refs)
        if (isForallableType(result)) {
            return this._wrapOne(result)
        }
        return [...result].map(x => this._wrapOne(x))
    }
}
