import { ZodAny } from "zod"
import { ZsMonoLike } from "../core/mono-type"
import { ZsForallable, ZsGenericDeclarable } from "../declarations/unions"
import { ZsForallFunction } from "../expressions/forall-function"
import { ZsFunction } from "../expressions/function"
import { ZsStructural } from "../misc-node"
import { ZsForallType } from "./forall-type"
import { ZsTypeArg } from "./type-arg"
import { ZsTypeVar, ZsTypeVarTuple } from "./type-var"

export interface ZsForallDef<Vars extends ZsTypeVarTuple> {
    vars: Vars
}

export type TypeVarRefs<Vars extends ZsTypeVarTuple> = {
    [Var in Vars[number] as Var["name"]]: Var["arg"]
}

export const typeVar = Symbol("typeVar")

export function createVarRef<Var extends ZsTypeVar>(
    var_: Var
): ZsMonoLike<Var["_def"]["extends"]["_input"]> {
    return ZsTypeArg.create(var_.name)
}

export function createTypeVarRefs<Vars extends ZsTypeVarTuple>(
    vars: Vars
): TypeVarRefs<Vars> {
    const refs = vars.map(createVarRef)
    return Object.fromEntries(vars.map((v, i) => [v.name, refs[i]])) as any
}

export interface WhereBuilder<Vars extends ZsTypeVarTuple, Result> {
    define(builder: (args: TypeVarRefs<Vars>) => Result): Result
}

export type TransformForall<
    Vars extends ZsTypeVarTuple,
    Schema extends ZsForallable
> = Schema extends ZsGenericDeclarable
    ? ZsForallType<Schema, Vars>
    : Schema extends ZsFunction
      ? ZsForallFunction<Vars, Schema>
      : never

/**
 * Builds a set of type variables. The number and names of the type vars is predetermined,
 * but this object lets you place constraints on them by name,
 */
export class ForallBuilder<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple
> extends ZsStructural<ZsForallDef<Vars>> {
    static create<Names extends [string, ...string[]]>(
        ...names: Names
    ): ForallBuilder<{
        [I in keyof Names]: ZsTypeVar<Names[I], ZodAny, null>
    }> {
        return new ForallBuilder({
            vars: names.map(name => ZsTypeVar.create(name)) as any
        }) as any
    }
    where<Name extends Vars[number]["name"], NewVar extends ZsTypeVar<Name>>(
        name: Name,
        declarator: (
            typeVar: Extract<Vars[number], { name: Name }>,
            typeArgs: TypeVarRefs<Vars>
        ) => NewVar
    ): ForallBuilder<{
        [I in keyof Vars]: Vars[I]["name"] extends Name ? NewVar : Vars[I]
    }> {
        return new ForallBuilder({
            vars: this._def.vars.map(v =>
                v.name === name ? declarator(v as any, {} as any) : v
            ) as any
        })
    }

    define<Result extends ZsForallable>(
        builder: (args: TypeVarRefs<Vars>) => Result
    ): TransformForall<Vars, Result>
    define<Result extends ZsForallable>(
        builder: (args: TypeVarRefs<Vars>) => Iterable<Result>
    ): Iterable<TransformForall<Vars, Result>>
    define(builder: Function): any {
        const refs = createTypeVarRefs(this._def.vars)
        return builder(refs) as any
    }
}
