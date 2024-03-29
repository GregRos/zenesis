import { ZodFunction, ZodType } from "zod"
import { ZsForeignImport } from "../../containers/foreign-import"

import { ZodKindedAny } from "../../core/types"
import { ZsTypeAlias } from "../../declarations/alias"
import { ZsClass } from "../../declarations/classlike/class"
import { ZsInterface } from "../../declarations/classlike/interface"
import { ZsOverloads } from "../../declarations/classlike/members/overloads"
import { ZsThis } from "../../declarations/classlike/this"
import { ZsEnum } from "../../declarations/enum"
import { ZsValue } from "../../declarations/value"
import { ZsFunction } from "../../expressions/function"
import { ZsMappedKeyRef } from "../../expressions/map-arg"
import { ZsGeneric } from "../../generics/generic"
import { ZsGenericFunction } from "../../generics/generic-function"
import { ZsTypeVarRef } from "../../generics/type-var"
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
    ZsMakable,
    ZsMakeResultType,
    ZsModuleDeclarableType,
    ZsModuleDeclarableTypeLike,
    ZsOrZodFunction,
    ZsReferableType,
    ZsReferableTypeLike
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

export function isImplementable(obj: any): obj is ZsImplementable {
    return isClassLike(obj) || isForeignImport(obj)
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
        obj instanceof ZsMappedKeyRef
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
    return isDeclarableType(obj)
}

export function isExportableTypeLike(obj: any): obj is ZsExportableTypeLike {
    return isExportableType(obj) || obj instanceof ZsGeneric
}

export function isExportable(obj: any): obj is ZsExportable {
    return isExportableTypeLike(obj) || (obj as any) instanceof ZsValue
}

export function isMakable(obj: any): obj is ZsMakable {
    return obj instanceof ZsGeneric || obj instanceof ZsForeignImport
}

export function isReferableType(obj: any): obj is ZsReferableType {
    return (
        isDeclarableType(obj) ||
        obj instanceof ZsForeignImport ||
        obj instanceof ZsThis
    )
}

export function isReferableTypeLike(obj: any): obj is ZsReferableTypeLike {
    return isReferableType(obj) || obj instanceof ZsGeneric
}

export function isOverloads(obj: any): obj is ZsOverloads {
    return obj instanceof ZsOverloads
}
