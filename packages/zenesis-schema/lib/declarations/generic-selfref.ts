import { ZsRefKind } from "../core/ref-kind"
import { ZsReferenceDef, createReference } from "../core/reference"
import { ZsGeneric } from "../generics/generic"
import { ZsTypeVarRefs } from "../generics/type-var"
import { ZsMakeResultType } from "../utils/unions"

export interface ZsGenericSelfrefDef<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVarRefs
> extends ZsReferenceDef<ZsGeneric<Instance, Vars>> {
    readonly vars: Vars
}

export type ZsGenericSelfref<
    Instance extends ZsMakeResultType = ZsMakeResultType,
    Vars extends ZsTypeVarRefs = ZsTypeVarRefs
> = ZsGeneric<Instance, Vars> & ZsGenericSelfrefDef<Instance, Vars>

export function createGenericSelfref<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVarRefs
>(
    def: Omit<ZsGenericSelfrefDef<Instance, Vars>, "via">
): ZsGenericSelfref<Instance, Vars> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsSelfref
    })
}
