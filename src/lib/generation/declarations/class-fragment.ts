import {
    ZsClassFragment,
    ZsClassFragmentDef
} from "../../construction/class-declarations/class-fragment"
import { tf } from "../tf"
import { ClassElement, HeritageClause, TypeNode } from "typescript"
import { ZodKindedAny } from "../../../../../zod-tools"
import { seq } from "lazies"
import { ZsClassMember } from "../../construction/class-declarations/field"
import { ZsImplements } from "../../construction/class-declarations/implements"
import { ScopedZtMatcherState, zsInspect } from "../zt-types"

export interface ClassFragmentParts {
    members: ClassElement[]
    implements: TypeNode[]
}
