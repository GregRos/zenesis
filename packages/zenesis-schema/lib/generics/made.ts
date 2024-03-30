import { ZodTypeAny } from "zod"
import { ZsRefKind } from "../core/ref-kind"
import {
    ZsReferenceDef,
    ZsReferenceInput,
    createReference
} from "../core/reference"
import { ZsMakeResultType } from "../utils/unions"

export interface ZsInstantiatedDef<Ref extends ZsMakeResultType>
    extends ZsReferenceDef<Ref> {
    readonly typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
}

export type ZsInstantiated<Ref extends ZsMakeResultType> = Ref &
    ZsInstantiatedDef<Ref>

export function createInstantiation<Ref extends ZsMakeResultType>(
    def: ZsReferenceInput<ZsInstantiatedDef<Ref>>
): ZsInstantiated<Ref> {
    return createReference(ZsRefKind.ZsInstantiation, def)
}
