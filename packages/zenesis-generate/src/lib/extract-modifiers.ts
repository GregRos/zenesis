import { ZodKindedAny } from "@zenesis/schema"
import { QuestionToken, ReadonlyKeyword } from "typescript"
import { getOptional, getReadonly } from "./tokens"

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

    const nodes: ZodKindedAny[] = []
    for (
        let node = typeWithModifiers;
        node;
        node = "innerType" in node._def && (node._def.innerType as any)
    ) {
        nodes.push(node)
    }
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
