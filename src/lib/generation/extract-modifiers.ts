import { ZodNamedTypeAny } from "../zod-walker/types";
import { QuestionToken, ReadonlyKeyword, SyntaxKind } from "typescript";
import { matchType } from "../zod-walker/patterns";
import { AnyKind } from "../construction/kinds";
import { tf } from "./tf";
import { getOptional, getReadonly } from "./modifier-tokens";

export interface ExtractedType {
    innerType: ZodNamedTypeAny;
    readonly?: ReadonlyKeyword;
    optional?: QuestionToken;
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
    let question: QuestionToken | undefined;
    let readonly: ReadonlyKeyword | undefined;
    let innerType = typeWithModifiers;
    for (;;) {
        if (
            matchType(innerType, AnyKind.ZodOptional) &&
            modifiers & ExtractModifier.Optional
        ) {
            innerType = innerType._def.innerType;
            question = getOptional("normal");
        } else if (
            matchType(innerType, AnyKind.ZodReadonly) &&
            modifiers & ExtractModifier.Readonly
        ) {
            readonly = getReadonly("normal");
            innerType = innerType._def.innerType;
        } else {
            break;
        }
    }
    return {
        innerType,
        optional: question,
        readonly
    };
}
