import { ZsRefKind } from "../core/ref-kind"
import { ZsReferenceDef, createReference } from "../core/reference"
import { ZsModuleDeclarableType } from "../utils/unions"

export interface ZsSelfrefDef<Referenced extends ZsModuleDeclarableType>
    extends ZsReferenceDef<Referenced> {
    readonly via: ZsRefKind.ZsSelfref
}
export type ZsTypeSelfref<
    Referenced extends ZsModuleDeclarableType = ZsModuleDeclarableType
> = Referenced & ZsSelfrefDef<Referenced>

export function createSelfref<As extends ZsModuleDeclarableType>(
    def: Omit<ZsSelfrefDef<As>, "via">
): ZsTypeSelfref<As> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsSelfref
    })
}
