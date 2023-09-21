import {
    ZodAny,
    ZodArray,
    ZodBigInt,
    ZodBoolean,
    ZodBranded,
    ZodCatch,
    ZodDate,
    ZodDefault,
    ZodDiscriminatedUnion,
    ZodEnum,
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
    ZodPromise,
    ZodRecord,
    ZodSet,
    ZodString,
    ZodSymbol,
    ZodTuple,
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid,
    ZodEffects,
    ZodTransformer,
    ZodFunction,
    ZodReadonly,
    ZodPipeline,
    ZodTypeDef,
    ZodType,
    ZodTypeAny
} from "zod";

export type ZodTypeSome =
    | ZodString
    | ZodLiteral<any>
    | ZodNaN
    | ZodAny
    | ZodArray<any>
    | ZodBigInt
    | ZodBranded<any, any>
    | ZodBoolean
    | ZodNull
    | ZodNumber
    | ZodDate
    | ZodCatch<any>
    | ZodDefault<any>
    | ZodIntersection<any, any>
    | ZodMap
    | ZodSet
    | ZodLazy<any>
    | ZodVoid
    | ZodUnion<any>
    | ZodUnknown
    | ZodTuple
    | ZodRecord
    | ZodSymbol
    | ZodPromise<any>
    | ZodOptional<any>
    | ZodObject<any>
    | ZodNever
    | ZodNullable<any>
    | ZodUndefined
    | ZodDiscriminatedUnion<any, any>
    | ZodEnum<any>
    | ZodNativeEnum<any>
    | ZodFunction<any, any>
    | ZodTransformer<any, any>
    | ZodReadonly<any>
    | ZodPipeline<any, any>
    | ZodEffects<any, any>;

export type ZodNamedTypeDef<K extends string = string> = ZodTypeDef & {
    typeName: K;
};
export type ZodNamedTypeAny<K extends string = string> = ZodTypeAny & {
    readonly _def: ZodNamedTypeDef<K>;
};
export type ZodDefOf<Z extends ZodNamedTypeAny> = Z["_def"];
export type ZodNameOf<Z extends ZodNamedTypeAny> = ZodDefOf<Z>["typeName"];
