import { QuestionToken, ReadonlyKeyword } from "typescript"
import { AnyTypeKind, ZsTypeKind } from "../construction/kinds"
import { zodInspect, ZodKindedAny } from "zod-tools"
import { ZodOptional, ZodReadonly } from "zod"
import { Seq, seq } from "lazies"
import { zsSchemaDomain } from "./zt-types"
import { getOptional, getReadonly } from "./expressions/tokens"

export interface ExtractedType {
    innerType: ZodKindedAny
    readonly?: ReadonlyKeyword
    optional?: QuestionToken
}

type ExtractableType = "ZodOptional" | "ZodReadonly"
export function extractModifiers(
    typeWithModifiers: ZodKindedAny,
    ...modifierTypes: ExtractableType[]
) {
    const onlyTypes = new Set<string>(modifierTypes)
    const extracted: ExtractedType = {} as any
    const nodes = zsSchemaDomain.match(typeWithModifiers).cases<{
        else: Iterable<ZodKindedAny>
    }>({
        *else(node) {
            yield node._node
            if ("innerType" in node._def && onlyTypes.has(node.kind)) {
                yield* this.recurse(node._def.innerType as any)
            }
        }
    })
    for (const node of nodes) {
        if (node._def.typeName === "ZodOptional") {
            extracted.optional = getOptional("normal")
        } else if (node._def.typeName === "ZodReadonly") {
            extracted.readonly = getReadonly("normal")
        } else {
            extracted.innerType = node
        }
    }
    return extracted
}
