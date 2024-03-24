import { ZsTypeVarTuple } from "./type-var"

export function getTypeArgObject<Vars extends ZsTypeVarTuple>(
    vars: Vars
): TypeVarRefsByName<Vars> {
    return Object.fromEntries(vars.map(v => [v.name, v.arg])) as any
}
export function getTypeArgArray<Vars extends ZsTypeVarTuple>(
    vars: Vars
): TypeVarRefs<Vars> {
    return vars.map(v => v.arg) as any
}
export type TypeVarRefsByName<Vars extends ZsTypeVarTuple> = {
    [Var in Vars[number] as Var["name"]]: Var["arg"]
}
export type TypeVarRefsByNameOrNumber<Vars extends ZsTypeVarTuple> = {
    [Var in Vars[number] as Var["name"]]: Var["arg"]
} & {
    [I in keyof Vars]: Vars[I]["arg"]
}
export type TypeVarRefs<Vars extends ZsTypeVarTuple> = {
    [I in keyof Vars]: Vars[I]["arg"]
}
