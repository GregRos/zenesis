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
    ZodTransformer,
    ZodTuple,
    ZodTypeAny,
    ZodTypeDef,
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid
} from "zod";
import { ZsClass } from "../construction/module-declarations/class";
import { ZsInterface } from "../construction/module-declarations/interface";
import { ZsTypeAlias } from "../construction/module-declarations/alias";
import { ZsConditional } from "../construction/expressions/conditional";
import { ZsFunction } from "../construction/expressions/function";
import { ZsGenericFunction } from "../construction/expressions/generic-function";
import { ZsTypeVar } from "../construction/generic/type-var";
import { ZsMapVar } from "../construction/expressions/map-var";
import { ZsKeyof } from "../construction/expressions/keyof";
import { ZsMapped } from "../construction/expressions/mapped";
import { ZsTypeof } from "../construction/expressions/typeof";
import { ZsImport } from "../construction/external/import";
import {
    ZsInstantiation,
    ZsTypeCtors
} from "../construction/expressions/instantiation";
import { EnumLike, ZodDiscriminatedUnionOption } from "zod/lib/types";
import { ZsGenericType } from "../construction/generic/generic-type";
import { ZsImportedGeneric } from "../construction/external/imported-generic";

export type ZodNamedTypeDef<K extends string = string> = ZodTypeDef & {
    typeName: K;
};
export type ZodNamedTypeAny<K extends string = string> = ZodTypeAny & {
    readonly _def: ZodNamedTypeDef<K>;
};
export type ZodDefOf<Z extends ZodNamedTypeAny> = Z["_def"];
export type ZodNameOf<Z extends ZodNamedTypeAny> = ZodDefOf<Z>["typeName"];
export type ZsTypeSchema =
    | ZsClass
    | ZsInterface
    | ZsTypeAlias
    | ZsConditional<any, any, any, any>
    | ZsFunction
    | ZsGenericFunction
    | ZsTypeVar
    | ZsMapVar
    | ZsKeyof
    | ZsMapped
    | ZsTypeof
    | ZsImport
    | ZsInstantiation<ZsTypeCtors>;
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
    | ZodEffects<ZodNamedTypeAny>
    | ZodPipeline<ZodNamedTypeAny, ZodNamedTypeAny>;

export type GenericZsNode = ZsGenericType | ZsImportedGeneric;
export type AnyTypeSchema = ZsTypeSchema | ZodTypeSchema;
export type AnyTypeNode = AnyTypeSchema | GenericZsNode;
