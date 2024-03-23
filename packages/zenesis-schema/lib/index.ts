import { z } from "zod"
import { ZsWorld } from "./containers/world"
import { ZsAstExpr } from "./expressions/ast-expr"
import { ZsFunction } from "./expressions/function"
import { ZsIf } from "./expressions/if"
import { ZsKeyof } from "./expressions/keyof"
import { ZsLookup } from "./expressions/lookup"
import { ZsMapped } from "./expressions/mapped"
import { Forall } from "./generics/forall-builder"
import { ZsTypeVar } from "./generics/type-var"

export { ZsClassBody } from "./declarations/classlike/body"
export {
    ZsConstructor,
    ZsConstructorDef
} from "./declarations/classlike/members/constructor"

export { AnyTypeKind, ZsTypeKind } from "./core/kinds"
export { ZsMonoLike, ZsMonoType } from "./core/mono-type"
export {
    KindedAny,
    ZodDefOf,
    ZodKindOf,
    ZodKindedAny,
    ZodKindedTypeDef,
    ZsShapedRef
} from "./core/types"
export { ZsTypeAlias, ZsTypeAliasDef } from "./declarations/alias"
export { ZsClass, ZsClassDef } from "./declarations/classlike/class"
export { ZsInterface, ZsInterfaceDef } from "./declarations/classlike/interface"
export {
    ZsImplements,
    ZsImplementsDef
} from "./declarations/classlike/members/implements"
export {
    ZsIndexer,
    ZsIndexerDef
} from "./declarations/classlike/members/indexer"
export {
    ZsClassMemberDef,
    ZsProperty
} from "./declarations/classlike/members/member"
export {
    ZsOverloads,
    ZsOverloadsDef
} from "./declarations/classlike/members/overloads"
export { ZsEnum, ZsEnumDef } from "./declarations/enum"
export { ZsValue, ZsValueDef } from "./declarations/value"
export { ZsAstExpr, ZsAstExprDef } from "./expressions/ast-expr"
export {
    ZsGenericFunction,
    ZsGenericFunctionDef
} from "./expressions/forall-function"
export { ZsFunction, ZsFunctionDef } from "./expressions/function"
export { ZsIf, ZsIfDef } from "./expressions/if"
export { ZsKeyof, ZsKeyofDef } from "./expressions/keyof"
export { ZsLookup, ZsLookupDef } from "./expressions/lookup"
export { ZsMapVarDef, ZsMappingKeyRef } from "./expressions/map-arg"
export { ZsMapped, ZsMappedDef } from "./expressions/mapped"
export { ZsForallTypeDef, ZsGeneric } from "./generics/forall-type"
export { ZsInstantiationDef, ZsMade } from "./generics/instantiation"
export {
    ZsTypeArgTuple,
    ZsTypeVarRef,
    ZsTypeVarRefDef
} from "./generics/type-arg"
export {
    ZsTypeVar,
    ZsTypeVarDef,
    ZsTypeVarTuple,
    ZsTypeVarVariance
} from "./generics/type-var"
export { ZodSchemaTable, ZsSchemaTable } from "./table"
export { zs }

function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const result: any = {}
    for (const key of keys) {
        result[key] = obj[key]
    }
    return result
}

const zs = {
    ...pick(
        z,
        "literal",
        "void",
        "tuple",
        "unknown",
        "string",
        "number",
        "boolean",
        "null",
        "undefined",
        "object",
        "array",
        "record",
        "map",
        "set",
        "function",
        "promise",
        "date",
        "bigint",
        "symbol"
    ),
    World: ZsWorld.create,
    forall: Forall.create,
    lookup: ZsLookup.create,
    typeVar: ZsTypeVar.create,
    if: ZsIf.create,
    function: ZsFunction.create,
    fun: ZsFunction.create,
    keyof: ZsKeyof.create,
    map: ZsMapped.create,
    ast: ZsAstExpr.create
}
export { ZsForeignDef, ZsForeignImport } from "./containers/foreign-import"
export {
    ZsForeignModule,
    ZsForeignModuleDef
} from "./containers/foreign-module"
export { ZsModuleBody } from "./containers/module-body"
export { ZsWorld, ZsWorldDef } from "./containers/world"
export {
    ZsSmartZenesisImport,
    ZsZenesisAnyImport,
    ZsZenesisGenericImport,
    ZsZenesisImport,
    ZsZenesisImportDef,
    ZsZenesisShapedImport,
    ZsZenesisTypeImport
} from "./containers/zenesis-import"
export { ZsZenesisModule } from "./containers/zenesis-module"
export { Access } from "./declarations/classlike/members/member"
export { ZsThis, ZsThisDef } from "./declarations/classlike/this"
export {
    ZsGenericSelfref,
    ZsGenericSelfrefDef,
    ZsSelfrefDef,
    ZsTypeSelfref
} from "./declarations/zenesis-self"
export { ZsModifierState } from "./expressions/mapped"
export * from "./utils/describe"
export * from "./utils/unions"
export * from "./utils/validate/is-member"
export * from "./utils/validate/is-type"
