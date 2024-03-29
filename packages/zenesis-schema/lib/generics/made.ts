import { ZodTypeAny } from "zod"
import { ZsRefKind } from "../core/ref-kind"
import { ReferenceDef, createReference } from "../core/reference"
import { ZsMakeResultType } from "../utils/unions"

export interface InstantiationDef<Ref extends ZsMakeResultType>
    extends ReferenceDef<Ref> {
    readonly typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
}

export type Instantiated<Ref extends ZsMakeResultType> = Ref &
    InstantiationDef<Ref>

export function createInstantiation<Ref extends ZsMakeResultType>(
    def: Omit<InstantiationDef<Ref>, "via">
): Instantiated<Ref> {
    return createReference({
        ...def,
        via: ZsRefKind.ZsInstantiation
    })
}
