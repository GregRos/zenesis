import { ZodNamedTypeAny } from "../zod-walker/types"
import { QuestionToken, ReadonlyKeyword } from "typescript"
import { matchType } from "../zod-walker/patterns"
import { AnyTypeKind } from "../construction/kinds"
import { getOptional, getReadonly } from "./modifier-tokens"

export interface ExtractedType {
    innerType: ZodNamedTypeAny
    readonly?: ReadonlyKeyword
    optional?: QuestionToken
}

export enum ExtractModifier {
    None = 0,
    Optional = 1,
    Readonly = 2,
    All = Optional | Readonly
}

export function extractModifiers(
    typeWithModifiers: ZodNamedTypeAny,
    modifiers: ExtractModifier = ExtractModifier.All
) {
    let question: QuestionToken | undefined
    let readonly: ReadonlyKeyword | undefined
    let innerType = typeWithModifiers
    for (;;) {
        if (
            matchType(innerType, AnyTypeKind.ZodOptional) &&
            modifiers & ExtractModifier.Optional
        ) {
            innerType = innerType._def.innerType
            question = getOptional("normal")
        } else if (
            matchType(innerType, AnyTypeKind.ZodReadonly) &&
            modifiers & ExtractModifier.Readonly
        ) {
            readonly = getReadonly("normal")
            innerType = innerType._def.innerType
        } else {
            break
        }
    }
    return {
        innerType,
        optional: question,
        readonly
    }
}
