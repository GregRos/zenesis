import {
    ZsClassFragment,
    ZsClassFragmentDef
} from "../../construction/class-declarations/class-fragment"
import { tf } from "../tf"
import {
    ClassElement,
    ExpressionWithTypeArguments,
    HeritageClause,
    MethodSignature,
    PropertySignature,
    TypeElement,
    TypeNode
} from "typescript"
import { ZodKindedAny } from "../../../../../zod-tools"
import { seq } from "lazies"
import { ZsClassMember } from "../../construction/class-declarations/field"
import { ZsImplements } from "../../construction/class-declarations/implements"
import { zsInspect } from "../zt-types"
import { TypeExprContext } from "../type-expr-context"
import { zsTypeExprMatcher } from "../expressions/matcher"

export interface ClassFragmentParts {
    members: (PropertySignature | MethodSignature)[]
    implements: ExpressionWithTypeArguments[]
}
