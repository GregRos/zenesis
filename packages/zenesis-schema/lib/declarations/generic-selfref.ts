import { ZsRefKind } from "../core/ref-kind"
import { ZsReferenceDef, createReference } from "../core/reference"
import { ZsGeneric } from "../generics/generic"
import { ZsTypeVars } from "../generics/type-var"
import { ZsMakeResultType } from "../utils/unions"

export interface ZsGenericSelfrefDef<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVars
> extends ZsReferenceDef<ZsGeneric<Instance, Vars>> {
    readonly vars: Vars
}

export type ZsGenericSelfref<
    Instance extends ZsMakeResultType = ZsMakeResultType,
    Vars extends ZsTypeVars = ZsTypeVars
> = ZsGeneric<Instance, Vars> & ZsGenericSelfrefDef<Instance, Vars>

export function createGenericSelfref<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVars
>(
    def: Omit<ZsGenericSelfrefDef<Instance, Vars>, "via">
): ZsGenericSelfref<Instance, Vars> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsSelfref
    })
}
