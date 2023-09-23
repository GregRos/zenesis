import {
    AnyZodTuple,
    ZodAny,
    ZodArray,
    ZodBigInt,
    ZodBoolean,
    ZodBranded,
    ZodCatch,
    ZodDate,
    ZodDefault,
    ZodDiscriminatedUnion,
    ZodEffects,
    ZodEnum,
    ZodFunction,
    ZodIntersection,
    ZodLazy,
    ZodLiteral,
    ZodMap,
    ZodNaN,
    ZodNativeEnum,
    ZodNever,
    ZodNull,
    ZodNullable,
    ZodNumber,
    ZodObject,
    ZodOptional,
    ZodPipeline,
    ZodPromise,
    ZodRawShape,
    ZodReadonly,
    ZodRecord,
    ZodSet,
    ZodString,
    ZodSymbol,
    ZodTuple,
    ZodTypeAny,
    ZodTypeDef,
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid
} from "zod"
import { ZsClass } from "../construction"
import { ZsInterface } from "../construction"
import { ZsTypeAlias } from "../construction"
import { ZsConditional } from "../construction"
import { ZsFunction } from "../construction"
import { ZsTypeVar } from "../construction"
import { ZsMapVar } from "../construction"
import { ZsKeyof } from "../construction"
import { ZsMapped } from "../construction"
import { ZsImport } from "../construction"
import { ZsInstantiation } from "../construction"
import { EnumLike, ZodDiscriminatedUnionOption } from "zod/lib/types"
import { ZsLookup } from "../construction"
import { ZsOverloads } from "../construction"
import { ZsAccess } from "../construction"

export type ZodNamedTypeDef<K extends string = string> = ZodTypeDef & {
    typeName: K
}
export type ZodNamedTypeAny<K extends string = string> = ZodTypeAny & {
    readonly _def: ZodNamedTypeDef<K>
}
export type ZodDefOf<Z extends ZodNamedTypeAny> = Z["_def"]
export type ZodNameOf<Z extends ZodNamedTypeAny> = ZodDefOf<Z>["typeName"]
export type ZsTypeSchema =
    | ZsClass
    | ZsInterface
    | ZsTypeAlias
    | ZsConditional
    | ZsFunction
    | ZsTypeVar
    | ZsMapVar
    | ZsKeyof
    | ZsMapped
    | ZsImport
    | ZsLookup
    | ZsInstantiation
    | ZsOverloads
    | ZsAccess
export type ZodTypeSchema =
    | ZodString
    | ZodLiteral<unknown>
    | ZodNaN
    | ZodAny
    | ZodArray<ZodNamedTypeAny>
    | ZodBigInt
    | ZodBranded<ZodNamedTypeAny, any>
    | ZodBoolean
    | ZodNull
    | ZodNumber
    | ZodDate
    | ZodCatch<ZodNamedTypeAny>
    | ZodDefault<ZodNamedTypeAny>
    | ZodIntersection<ZodNamedTypeAny, ZodNamedTypeAny>
    | ZodMap<ZodNamedTypeAny, ZodNamedTypeAny>
    | ZodSet<ZodNamedTypeAny>
    | ZodLazy<ZodNamedTypeAny>
    | ZodVoid
    | ZodUnion<readonly [ZodNamedTypeAny, ...ZodNamedTypeAny[]]>
    | ZodUnknown
    | ZodTuple<[] | [ZodNamedTypeAny, ...ZodNamedTypeAny[]], ZodNamedTypeAny>
    | ZodRecord<ZodNamedTypeAny, ZodNamedTypeAny>
    | ZodSymbol
    | ZodPromise<ZodNamedTypeAny>
    | ZodOptional<ZodNamedTypeAny>
    | ZodObject<ZodRawShape>
    | ZodReadonly<ZodNamedTypeAny>
    | ZodNever
    | ZodNullable<ZodNamedTypeAny>
    | ZodUndefined
    | ZodDiscriminatedUnion<string, ZodDiscriminatedUnionOption<string>[]>
    | ZodEnum<[string, ...string[]]>
    | ZodNativeEnum<EnumLike>
    | ZodFunction<AnyZodTuple, ZodNamedTypeAny>
    | ZodEffects<ZodNamedTypeAny>
    | ZodPipeline<ZodNamedTypeAny, ZodNamedTypeAny>

export type AnyTypeSchema = ZsTypeSchema | ZodTypeSchema
