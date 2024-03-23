import { ZodFunction, ZodTypeAny } from "zod"
import { ZsForeignImport } from "../containers/foreign-import"
import {
    ZsZenesisGenericImport,
    ZsZenesisShapedImport,
    ZsZenesisTypeImport
} from "../containers/zenesis-import"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsConstructor } from "../declarations/classlike/members/constructor"
import { ZsImplements } from "../declarations/classlike/members/implements"
import { ZsIndexer } from "../declarations/classlike/members/indexer"
import { ZsProperty } from "../declarations/classlike/members/member"
import { ZsEnum } from "../declarations/enum"
import { ZsValue } from "../declarations/value"
import { ZsGenericSelfref, ZsTypeSelfref } from "../declarations/zenesis-self"
import { ZsGenericFunction } from "../expressions/forall-function"
import { ZsFunction } from "../expressions/function"
import { ZsMappingKeyRef } from "../expressions/map-arg"
import { ZsGeneric } from "../generics/forall-type"
import { ZsMade } from "../generics/instantiation"
import { ZsTypeVarRef } from "../generics/type-arg"

/**
 * A non-generic function expression, represented using a `zod` or `zenesis` function node.
 */
export type ZsOrZodFunction = ZsFunction | ZodFunction<any, any>

export type NormalizeFunctions<F extends ZsOrZodFunction> =
    F extends ZodFunction<infer Args, infer Return>
        ? ZsFunction<Args, Return>
        : F
/**
 * A `zod` or `zenesis` function node, or a `zenesis` generic function node.
 */
export type ZsFunctionLike = ZsOrZodFunction | ZsGenericFunction

/**
 * Any reference to a type imported from a zenesis or external module.
 */
export type ZsImportedType = ZsZenesisTypeImport | ZsForeignImport

/**
 * Any reference to an imported type or generic.
 */
export type ZsImport = ZsImportedType | ZsZenesisGenericImport

/**
 * Any declaration or reference to a class-like object-oriented type. That is, a class or interface.
 */
export type ZsClassLike = ZsClass | ZsInterface

/**
 * A type or function that can be declared generic.
 */
export type ZsGeneralizable = ZsGeneralizableType | ZsFunction

/**
 * A type that can be declared generic. That is, a class, interface, or type alias.
 */
export type ZsGeneralizableType = ZsClassLike | ZsTypeAlias
/**
 * Any declaration or reference to a type that can be the result of `make`
 * to instantiate a generic. That is, a class, interface, type alias, or foreign import.
 */
export type ZsMakeResultType = ZsGeneralizableType | ZsForeignImport
/**
 * Any declaration or reference to a type that can be declared by a module. That is,
 * a class, interface, type alias, or enum.
 */
export type ZsModuleDeclarableType = ZsMakeResultType | ZsEnum
/**
 * Any type node that needs to be declared in one place and referenced somewhere else. Includes
 * {@link ZsModuleDeclarableType}, as well as type variables.
 */
export type ZsDeclarableType =
    | ZsModuleDeclarableType
    | ZsTypeVarRef
    | ZsMappingKeyRef

/**
 * Any type or generic that can be declared in a module.
 */
export type ZsModuleDeclarableTypeLike = ZsModuleDeclarableType | ZsGeneric

/**
 * A type or generic that must be declared in one place and referenced somewhere else.
 * Either {@see ZsDeclarableType} or any generic type.
 */
export type ZsDeclarableTypeLike = ZsDeclarableType | ZsGeneric

/**
 * Either a {@see ZsDeclarableTypeLike} or a value declaration.
 */
export type ZsDeclarable = ZsDeclarableTypeLike | ZsValue

/**
 * Any reference to a type that can be exported by a module, including {@link ZsDeclarableType},
 * as well as all imported types.
 */
export type ZsExportableType = ZsDeclarableType | ZsImportedType

/**
 * Any reference to a type or type constructor that can be exported by a module, including
 * {@link ZsExportableType}, a generic type, or a generic imported type.
 */
export type ZsExportableTypeLike =
    | ZsExportableType
    | ZsGeneric
    | ZsZenesisGenericImport

/**
 * Any reference that can be exported by a module.
 */
export type ZsExportable = ZsExportableTypeLike | ZsValue

/**
 * Any reference to a generic. That is, a schema node that can be instantiated using `make` to produce a complete type.
 */
export type ZsMakable = ZsGeneric | ZsZenesisGenericImport | ZsForeignImport

/**
 * Any node that can be used as a reference to a type.
 */
export type ZsReferableType =
    | ZsDeclarableType
    | ZsZenesisTypeImport
    | ZsForeignImport
    | ZsTypeSelfref

export type ZsImplementable =
    | ZsClassLike
    | ZsMade<ZsClassLike>
    | ZsForeignImport
    | ZsZenesisShapedImport

export type ZsReferableTypeLike =
    | ZsReferableType
    | ZsGeneric
    | ZsZenesisGenericImport
    | ZsGenericSelfref

export type InterfaceMember = ZsProperty | ZsImplements | ZsIndexer

export type ClassMember = InterfaceMember | ZsConstructor

export type Ctor<Schema extends ZodTypeAny> = {
    new (...args: any[]): Schema
}

export type ZsSelfref = ZsTypeSelfref | ZsGenericSelfref
