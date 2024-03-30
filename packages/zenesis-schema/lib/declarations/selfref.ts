import { ZsRefKind } from "../core/ref-kind"
import {
    ZsReferenceDef,
    ZsReferenceInput,
    createReference
} from "../core/reference"
import { ZsModuleDeclarableType } from "../utils/unions"

export interface ZsSelfrefDef<Referenced extends ZsModuleDeclarableType>
    extends ZsReferenceDef<Referenced> {
    readonly via: ZsRefKind.ZsSelfref
}
export type ZsTypeSelfref<
    Referenced extends ZsModuleDeclarableType = ZsModuleDeclarableType
> = Referenced & ZsSelfrefDef<Referenced>

export function createSelfref<As extends ZsModuleDeclarableType>(
    def: ZsReferenceInput<ZsSelfrefDef<As>>
): ZsTypeSelfref<As> {
    return createReference(ZsRefKind.ZsSelfref, def)
}
