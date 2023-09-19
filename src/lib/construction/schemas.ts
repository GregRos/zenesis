import { ZsTypeAlias } from "./module-declarations/alias";
import { ZsClass } from "./module-declarations/class";
import { ZsInterface } from "./module-declarations/interface";
import { ZsConditional } from "./expressions/conditional";
import { ZsFunction } from "./expressions/function";
import { ZsGenericFunction } from "./expressions/generic-function";
import { ZsObjectExpr } from "./expressions/object";
import { ZsTypeVar } from "./generic/type-var";
import { ZsMapVar } from "./expressions/map-var";
import { ZsMapped } from "./expressions/mapped";
import { ZsImportedType } from "./external/import";
import { ZsInstantiation } from "./expressions/instantiation";
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
    ZodVoid
} from "zod";
import { ZsKeyof } from "./expressions/keyof";
import { ZsTypeof } from "./expressions/typeof";

export type ZsSchemas =
    | ZsClass<any, any>
    | ZsInterface<any, any>
    | ZsTypeAlias<any, any>
    | ZsConditional<any, any, any, any>
    | ZsFunction<any, any>
    | ZsGenericFunction<any, any>
    | ZsObjectExpr<any>
    | ZsTypeVar<any>
    | ZsMapVar<any>
    | ZsKeyof<any>
    | ZsMapped<any, any, any>
    | ZsTypeof<any>
    | ZsImportedType<any>
    | ZsInstantiation<any>;

export type ZodSchemas =
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
    | ZodNativeEnum<any>;

export type TypeSchema = ZsSchemas | ZodSchemas;
