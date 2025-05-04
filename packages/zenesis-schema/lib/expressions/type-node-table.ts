import {
    AnyZodTuple,
    EnumLike,
    ZodAny,
    ZodArray,
    ZodBigInt,
    ZodBoolean,
    ZodBranded,
    ZodCatch,
    ZodDate,
    ZodDefault,
    ZodDiscriminatedUnion,
    ZodDiscriminatedUnionOption,
    ZodEffects,
    ZodEnum,
    ZodFirstPartyTypeKind,
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
    ZodUndefined,
    ZodUnion,
    ZodUnknown,
    ZodVoid
} from "zod"
import { ZsForeignImport } from "../containers/foreign-import"
import { ZsTypeKind } from "../core/type-kind"
import { ZodKindedAny } from "../core/types"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsEnum } from "../declarations/enum"
import { ZsTypeArg } from "../generics/type-arg"
import { ZsAstExpr } from "./ast-expr"
import { ZsFunction } from "./function"
import { ZsGenericFunction } from "./generic-function"
import { ZsIf } from "./if"
import { ZsKeyof } from "./keyof"
import { ZsLookup } from "./lookup"
import { ZsMappedKeyRef } from "./map-arg"
import { ZsMapped } from "./mapped"
import { ZsOverloads } from "./overloads"
import { ZsThis } from "./this"

/**
 * This is a table of all the first party schemas. It makes various types
 * aware of all schemas using their preferred types.
 *
 * You will never need to make instances of this class.
 */
export abstract class ZodTypeNodeTable {
    [ZodFirstPartyTypeKind.ZodEffects]!: ZodEffects<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodPipeline]!: ZodPipeline<
        ZodKindedAny,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodNativeEnum]!: ZodNativeEnum<EnumLike>;
    [ZodFirstPartyTypeKind.ZodEnum]!: ZodEnum<[string, ...string[]]>;
    [ZodFirstPartyTypeKind.ZodDate]!: ZodDate;
    [ZodFirstPartyTypeKind.ZodPromise]!: ZodPromise<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodReadonly]!: ZodReadonly<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodMap]!: ZodMap;
    [ZodFirstPartyTypeKind.ZodSet]!: ZodSet;
    [ZodFirstPartyTypeKind.ZodRecord]!: ZodRecord;
    [ZodFirstPartyTypeKind.ZodLiteral]!: ZodLiteral<any>;
    [ZodFirstPartyTypeKind.ZodNull]!: ZodNull;
    [ZodFirstPartyTypeKind.ZodNaN]!: ZodNaN;
    [ZodFirstPartyTypeKind.ZodUndefined]!: ZodUndefined;
    [ZodFirstPartyTypeKind.ZodBoolean]!: ZodBoolean;
    [ZodFirstPartyTypeKind.ZodString]!: ZodString;
    [ZodFirstPartyTypeKind.ZodNumber]!: ZodNumber;
    [ZodFirstPartyTypeKind.ZodBigInt]!: ZodBigInt;
    [ZodFirstPartyTypeKind.ZodAny]!: ZodAny;
    [ZodFirstPartyTypeKind.ZodUnknown]!: ZodUnknown;
    [ZodFirstPartyTypeKind.ZodNever]!: ZodNever;
    [ZodFirstPartyTypeKind.ZodVoid]!: ZodVoid;
    [ZodFirstPartyTypeKind.ZodSymbol]!: ZodSymbol;
    [ZodFirstPartyTypeKind.ZodLazy]!: ZodLazy<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodBranded]!: ZodBranded<ZodKindedAny, any>;
    [ZodFirstPartyTypeKind.ZodCatch]!: ZodCatch<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodDefault]!: ZodDefault<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodOptional]!: ZodOptional<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodUnion]!: ZodUnion<
        [ZodKindedAny, ...ZodKindedAny[]]
    >;
    [ZodFirstPartyTypeKind.ZodDiscriminatedUnion]!: ZodDiscriminatedUnion<
        string,
        ZodDiscriminatedUnionOption<string>[]
    >;
    [ZodFirstPartyTypeKind.ZodNullable]!: ZodNullable<ZodKindedAny>;
    [ZodFirstPartyTypeKind.ZodFunction]!: ZodFunction<
        AnyZodTuple,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodObject]!: ZodObject<ZodRawShape>;
    [ZodFirstPartyTypeKind.ZodTuple]!: AnyZodTuple;
    [ZodFirstPartyTypeKind.ZodIntersection]!: ZodIntersection<
        ZodKindedAny,
        ZodKindedAny
    >;
    [ZodFirstPartyTypeKind.ZodArray]!: ZodArray<ZodKindedAny>
}

export abstract class ZsTypeNodeTable extends ZodTypeNodeTable {
    [ZsTypeKind.ZsEnum]!: ZsEnum;
    [ZsTypeKind.ZsForeignImport]!: ZsForeignImport;
    [ZsTypeKind.ZsThis]!: ZsThis;

    [ZsTypeKind.ZsClass]!: ZsClass;
    [ZsTypeKind.ZsInterface]!: ZsInterface;
    [ZsTypeKind.ZsTypeAlias]!: ZsTypeAlias;
    [ZsTypeKind.ZsGenericFunction]!: ZsGenericFunction;
    [ZsTypeKind.ZsTypeArg]!: ZsTypeArg;
    [ZsTypeKind.ZsMappingKeyRef]!: ZsMappedKeyRef;
    [ZsTypeKind.ZsAstExpr]!: ZsAstExpr;

    [ZsTypeKind.ZsFunction]!: ZsFunction;
    [ZsTypeKind.ZsMapped]!: ZsMapped;
    [ZsTypeKind.ZsKeyof]!: ZsKeyof;
    [ZsTypeKind.ZsIf]!: ZsIf;
    [ZsTypeKind.ZsLookup]!: ZsLookup;
    [ZsTypeKind.ZsOverloads]!: ZsOverloads
}
