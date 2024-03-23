import { ZodFunction, ZodType } from "zod"
import { ZsForeignImport } from "../../containers/foreign-import"
import {
    ZsZenesisAnyImport,
    ZsZenesisImport,
    ZsZenesisShapedImport
} from "../../containers/zenesis-import"
import { ZodKindedAny } from "../../core/types"
import { ZsTypeAlias } from "../../declarations/alias"
import { ZsClass } from "../../declarations/classlike/class"
import { ZsInterface } from "../../declarations/classlike/interface"
import { ZsOverloads } from "../../declarations/classlike/members/overloads"
import { ZsThis } from "../../declarations/classlike/this"
import { ZsEnum } from "../../declarations/enum"
import { ZsValue } from "../../declarations/value"
import {
    ZsGenericSelfref,
    ZsTypeSelfref
} from "../../declarations/zenesis-self"
import { ZsGenericFunction } from "../../expressions/forall-function"
import { ZsFunction } from "../../expressions/function"
import { ZsMappingKeyRef } from "../../expressions/map-arg"
import { ZsGeneric } from "../../generics/forall-type"
import { ZsMade } from "../../generics/instantiation"
import { ZsTypeVarRef } from "../../generics/type-arg"
import {
    ZsClassLike,
    ZsDeclarable,
    ZsDeclarableType,
    ZsDeclarableTypeLike,
    ZsExportable,
    ZsExportableType,
    ZsExportableTypeLike,
    ZsFunctionLike,
    ZsGeneralizable,
    ZsGeneralizableType,
    ZsImplementable,
    ZsImport,
    ZsImportedType,
    ZsMakable,
    ZsMakeResultType,
    ZsModuleDeclarableType,
    ZsModuleDeclarableTypeLike,
    ZsOrZodFunction,
    ZsReferableType,
    ZsReferableTypeLike,
    ZsSelfref
} from "../unions"

export function isZodType(obj: any): obj is ZodKindedAny {
    return obj instanceof ZodType
}

export function isZsOrZodFunction(obj: any): obj is ZsOrZodFunction {
    return obj instanceof ZsFunction || obj instanceof ZodFunction
}

export function isZsFunctionLike(obj: any): obj is ZsFunctionLike {
    return isZsOrZodFunction(obj) || obj instanceof ZsGenericFunction
}

export function isTypeImport(obj: any): obj is ZsImportedType {
    return obj instanceof ZsZenesisAnyImport || obj instanceof ZsForeignImport
}

export function isMade<T extends ZsMakeResultType>(
    obj: any,
    checkInstanceType?: (x: ZsMakeResultType) => x is T
): obj is ZsMade<T> {
    return (
        obj instanceof ZsMade &&
        (!checkInstanceType || checkInstanceType(obj._def.instance))
    )
}

export function isZenesisShapedImport(obj: any): obj is ZsZenesisShapedImport {
    return obj instanceof ZsZenesisAnyImport && isClassLike(obj._def.inner)
}

export function isSelfref(obj: any): obj is ZsSelfref {
    return obj instanceof ZsTypeSelfref || obj instanceof ZsGenericSelfref
}

export function isZenesisImport(obj: any): obj is ZsZenesisImport {
    return obj instanceof ZsZenesisAnyImport
}

export function isImport(obj: any): obj is ZsImport {
    return isZenesisImport(obj) || isForeignImport(obj)
}

export function isImplementable(obj: any): obj is ZsImplementable {
    return (
        isClassLike(obj) ||
        isMade(obj, isClassLike) ||
        isZenesisShapedImport(obj) ||
        isForeignImport(obj)
    )
}

export function isClassLike(obj: any): obj is ZsClassLike {
    return obj instanceof ZsClass || obj instanceof ZsInterface
}

export function isGeneralizable(obj: any): obj is ZsGeneralizable {
    return (
        isClassLike(obj) || obj instanceof ZsTypeAlias || isZsOrZodFunction(obj)
    )
}

export function isGeneralizableType(obj: any): obj is ZsGeneralizableType {
    return isClassLike(obj) || obj instanceof ZsTypeAlias
}

export function isMakeResultType(obj: any): obj is ZsMakeResultType {
    return isGeneralizableType(obj) || obj instanceof ZsForeignImport
}

export function isModuleDeclarableType(
    obj: any
): obj is ZsModuleDeclarableType {
    return isGeneralizableType(obj) || obj instanceof ZsEnum
}

export function isDeclarableType(obj: any): obj is ZsDeclarableType {
    return (
        isModuleDeclarableType(obj) ||
        obj instanceof ZsTypeVarRef ||
        obj instanceof ZsMappingKeyRef
    )
}
export function isModuleDeclarableTypeLike(
    obj: any
): obj is ZsModuleDeclarableTypeLike {
    return isModuleDeclarableType(obj) || obj instanceof ZsGeneric
}

export function isDeclarableTypeLike(obj: any): obj is ZsDeclarableTypeLike {
    return isDeclarableType(obj) || obj instanceof ZsGeneric
}

export function isDeclarable(obj: any): obj is ZsDeclarable {
    return isDeclarableTypeLike(obj) || obj instanceof ZsValue
}

export function isForeignImport(obj: any): obj is ZsForeignImport {
    return obj instanceof ZsForeignImport
}

function isExportableType(obj: any): obj is ZsExportableType {
    return isDeclarableType(obj) || isTypeImport(obj)
}

export function isExportableTypeLike(obj: any): obj is ZsExportableTypeLike {
    return (
        isExportableType(obj) || isTypeImport(obj) || obj instanceof ZsGeneric
    )
}

export function isExportable(obj: any): obj is ZsExportable {
    return isExportableTypeLike(obj) || (obj as any) instanceof ZsValue
}

export function isMakable(obj: any): obj is ZsMakable {
    return (
        obj instanceof ZsGeneric ||
        obj instanceof ZsForeignImport ||
        (obj instanceof ZsZenesisAnyImport && !obj.isType)
    )
}

export function isReferableType(obj: any): obj is ZsReferableType {
    return (
        isDeclarableType(obj) ||
        obj instanceof ZsZenesisAnyImport ||
        obj instanceof ZsForeignImport ||
        obj instanceof ZsThis ||
        obj instanceof ZsTypeSelfref
    )
}

export function isReferableTypeLike(obj: any): obj is ZsReferableTypeLike {
    return isReferableType(obj) || obj instanceof ZsGeneric
}

export function isOverloads(obj: any): obj is ZsOverloads {
    return obj instanceof ZsOverloads
}
