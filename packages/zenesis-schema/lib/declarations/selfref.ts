import { ZsRefKind } from "../core/ref-kind"
import { ReferenceDef, createReference } from "../core/reference"
import { ZsGeneric } from "../generics/generic"
import { ZsTypeVarRefs } from "../generics/type-var"
import { ZsMakeResultType, ZsModuleDeclarableType } from "../utils/unions"

export interface ZsSelfrefDef<Referenced extends ZsModuleDeclarableType>
    extends ReferenceDef<Referenced> {
    readonly via: ZsRefKind.ZsSelfref
}

export interface ZsGenericSelfrefDef<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVarRefs
> extends ReferenceDef<ZsGeneric<Instance, Vars>> {
    readonly vars: Vars
}

export type ZsSelfref<Referenced extends ZsModuleDeclarableType> = Referenced &
    ZsSelfrefDef<Referenced>

export type ZsGenericSelfref<
    Instance extends ZsMakeResultType,
    Vars extends ZsTypeVarRefs
> = ZsGeneric<Instance, Vars> & ZsGenericSelfrefDef<Instance, Vars>

export function createSelfref<As extends ZsModuleDeclarableType>(
    def: Omit<ZsSelfrefDef<As>, "via">
): ZsSelfref<As> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsSelfref
    })
}

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
