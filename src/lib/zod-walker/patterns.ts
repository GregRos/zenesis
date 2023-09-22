import { AnyTypeSchema, ZodNamedTypeAny, ZodNameOf } from "./types";
import { ZodFirstPartyTypeKind, ZodOptional } from "zod";
export function getTypeName<Z extends AnyTypeSchema>(node: Z): ZodNameOf<Z> {
    return node._def.typeName;
}

export function matchType<N extends ZodNameOf<AnyTypeSchema>>(
    node: ZodNamedTypeAny,
    name: N
): node is Extract<AnyTypeSchema, ZodNamedTypeAny<N>> {
    return getTypeName(node) === name;
}

export function optional<Z extends AnyTypeSchema>(
    node: Z
): Z extends ZodOptional<infer InnerZ> ? InnerZ : undefined {
    if (matchType(node, ZodFirstPartyTypeKind.ZodOptional)) {
        return node._def.innerType as any;
    }
    return undefined as any;
}
