import { ZodType, ZodTypeAny, ZodTypeDef } from "zod"

/**
 * Gets the `ZodDef` type of a schema instance.
 */
export type ZodKindedTypeDef<Kind extends string = string> = ZodTypeDef & {
    typeName: Kind
}

export type KindedAny<Kind extends string = string> = {
    _def: ZodKindedTypeDef<Kind>
}

/**
 * Works like `ZodTypeAny`, but with a `_def.typeName` that doesn't evaluate to `any`.
 * @template TypeName The name of the schema node.
 */
export type ZodKindedAny<Kind extends string = string> = ZodType<
    any,
    ZodKindedTypeDef<Kind>,
    any
>

/**
 * The `_def` type of a schema instance.
 * @template Z The type of a Zod schema.
 */
export type ZodDefOf<ZSchema extends KindedAny> = ZSchema["_def"]

/**
 * Gets the type of a schema instance's `_def.typeName`.
 */
export type ZodKindOf<ZSchema extends KindedAny> = ZSchema["_def"]["typeName"]
export type ZsShapedRef<
    Shape extends ZsShape = ZsShape,
    Kind extends "class" | "interface" = "class" | "interface"
> = ZodKindedAny & {
    readonly shape: Shape
    readonly declaration: Kind
}
export type ZsShape = {
    [key: string]: ZodTypeAny
}
