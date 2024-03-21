import { seq } from "lazies"
import { ZodTuple, ZodTypeAny } from "zod"
import { ZsGenericFunction } from "../../expressions/forall-function"
import { ZsFunction, ZsRestBuilder } from "../../expressions/function"
import {
    TypeVarRefs,
    TypeVarRefsByName,
    getTypeArgArray,
    getTypeArgObject
} from "../../generics/forall-builder"
import { ZsTypeVar, ZsTypeVarTuple } from "../../generics/type-var"
import { ZsFunctionLike } from "../../utils/unions"

export interface ForallOverload<Vars extends ZsTypeVarTuple> {}

export class MethodScopedForallBuilder<Vars extends ZsTypeVarTuple> {
    constructor(private _vars: Vars) {}
    where<Name extends Vars[number]["name"], NewVar extends ZsTypeVar<Name>>(
        name: Name,
        declarator: (
            cur: Extract<Vars[number], { name: Name }>,
            others: TypeVarRefsByName<Vars>
        ) => NewVar
    ): MethodScopedForallBuilder<{
        [I in keyof Vars]: Vars[I]["name"] extends Name ? NewVar : Vars[I]
    }> {
        return new MethodScopedForallBuilder(
            this._vars.map(v =>
                v.name === name
                    ? declarator(v as any, getTypeArgObject(this._vars))
                    : v
            ) as any
        )
    }

    Overloads<Func extends ZsFunction>(
        declarator: (
            this: Omit<MethodScopedFactory, "forall">,
            ...args: TypeVarRefs<Vars>
        ) => Iterable<Func>
    ): Iterable<ZsGenericFunction<Vars, Func>> {
        const varRefs = getTypeArgArray(this._vars)
        const factory = new MethodScopedFactory()
        const overloads = declarator.apply(factory, varRefs)
        return seq(overloads).map(func =>
            ZsGenericFunction.create(this._vars, func)
        )
    }
}

export class MethodScopedFactory {
    forall<Names extends [string, ...string[]]>(
        ...names: Names
    ): MethodScopedForallBuilder<{
        [I in keyof Names]: ZsTypeVar<Names[I], ZodTypeAny, null>
    }> {
        return new MethodScopedForallBuilder(
            names.map(name => ZsTypeVar.create(name)) as any
        )
    }

    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsRestBuilder<ZodTuple<[...Args], null>> {
        return ZsFunction.create(...params)
    }
}

export type MethodScope<Fun extends ZsFunctionLike> = (
    declarator: MethodDeclarator
) => Iterable<Fun>
export class MethodDeclarator {
    args<Args extends [ZodTypeAny, ...ZodTypeAny[]] | []>(
        ...params: Args
    ): ZsRestBuilder<ZodTuple<[...Args], null>> {
        return ZsFunction.create(...params)
    }

    forall<Names extends [string, ...string[]]>(...names: Names) {}
}
