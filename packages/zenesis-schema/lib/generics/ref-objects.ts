import { ZsTypeVars } from "./type-var"

export function getTypeArgObject<Vars extends ZsTypeVars>(
    vars: Vars
): TypeVarRefsByName<Vars> {
    return Object.fromEntries(vars.map(v => [v.name, v])) as any
}
export function getTypeArgArray<Vars extends ZsTypeVars>(
    vars: Vars
): TypeVarRefs<Vars> {
    return vars.map(v => v.ref) as TypeVarRefs<Vars>
}
export type TypeVarRefsByName<Vars extends ZsTypeVars> = {
    [Var in Vars[number] as Var["name"]]: Var["ref"]
}
export type TypeVarRefsByNameOrNumber<Vars extends ZsTypeVars> = {
    [Var in Vars[number] as Var["name"]]: Var["ref"]
} & {
    [I in keyof Vars]: Vars[I]["ref"]
}
export type TypeVarRefs<Vars extends ZsTypeVars> = {
    [I in keyof Vars]: Vars[I]["ref"]
}
