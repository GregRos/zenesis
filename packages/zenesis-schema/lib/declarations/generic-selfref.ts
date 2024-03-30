import { ZsRefKind } from "../core/ref-kind"
import { ZsReferenceDef, createReference } from "../core/reference"
import { ZsGeneric } from "../generics/generic"
import { ZsTypeVars } from "../generics/type-var"
import { ZsGeneralizableType } from "../utils/unions"

export interface ZsGenericSelfrefDef<
    Instance extends ZsGeneralizableType,
    Vars extends ZsTypeVars
> extends ZsReferenceDef<ZsGeneric<Instance, Vars>> {
    readonly vars: Vars
}

export type ZsGenericSelfref<
    Instance extends ZsGeneralizableType = ZsGeneralizableType,
    Vars extends ZsTypeVars = ZsTypeVars
> = ZsGeneric<Instance, Vars> & ZsGenericSelfrefDef<Instance, Vars>

export function createGenericSelfref<
    Instance extends ZsGeneralizableType,
    Vars extends ZsTypeVars
>(
    def: Omit<ZsGenericSelfrefDef<Instance, Vars>, "via">
): ZsGenericSelfref<Instance, Vars> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsSelfref
    })
}
