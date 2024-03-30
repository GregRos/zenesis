import { ZodTypeAny } from "zod"
import { ZsRefKind } from "../core/ref-kind"
import { ZsReferenceDef, createReference } from "../core/reference"
import { ZsMakeResultType } from "../utils/unions"

export interface ZsInstantiatedDef<Ref extends ZsMakeResultType>
    extends ZsReferenceDef<Ref> {
    readonly typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
}

export type ZsInstantiated<Ref extends ZsMakeResultType> = Ref &
    ZsInstantiatedDef<Ref>

export function createInstantiation<Ref extends ZsMakeResultType>(
    def: Omit<ZsInstantiatedDef<Ref>, "via">
): ZsInstantiated<Ref> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsInstantiation
    })
}
