import { TypeOf, ZodTypeAny, baseObjectOutputType } from "zod"
import { ZsShape } from "./types"

export type SchemaSubtypeOf<Sub extends ZodTypeAny> = ZodTypeAny & {
    readonly _input: Sub["_input"]
}
export type RecursiveConjunction<
    Types extends readonly [ZodTypeAny, ...ZodTypeAny[]]
> = Types extends readonly [infer Head, ...infer Tail]
    ? Head extends ZodTypeAny
        ? Tail extends readonly [ZodTypeAny, ...ZodTypeAny[]]
            ? TypeOf<Head> & RecursiveConjunction<Tail>
            : TypeOf<Head>
        : never
    : never
export type combineClassShape<
    OwnShape extends ZsShape,
    InheritedShape extends ZsShape,
    RequiredShape extends ZsShape
> = InheritedShape & RequiredShape & OwnShape
export type getCombinedType<
    OwnShape extends ZsShape = ZsShape,
    InheritedShape extends ZsShape = ZsShape,
    RequiredShape extends ZsShape = ZsShape
> = baseObjectOutputType<
    combineClassShape<OwnShape, InheritedShape, RequiredShape>
>
