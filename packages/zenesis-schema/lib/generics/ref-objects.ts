import { ZsTypeVarRefs } from "./type-var"

export function getTypeArgObject<Vars extends ZsTypeVarRefs>(
    vars: Vars
): TypeVarRefsByName<Vars> {
    return Object.fromEntries(vars.map(v => [v.name, v])) as any
}
export function getTypeArgArray<Vars extends ZsTypeVarRefs>(
    vars: Vars
): TypeVarRefs<Vars> {
    return vars
}
export type TypeVarRefsByName<Vars extends ZsTypeVarRefs> = {
    [Var in Vars[number] as Var["name"]]: Var
}
export type TypeVarRefsByNameOrNumber<Vars extends ZsTypeVarRefs> = {
    [Var in Vars[number] as Var["name"]]: Var
} & {
    [I in keyof Vars]: Vars[I]
}
export type TypeVarRefs<Vars extends ZsTypeVarRefs> = {
    [I in keyof Vars]: Vars[I]
}
