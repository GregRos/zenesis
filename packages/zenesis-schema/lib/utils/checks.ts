import { ZodFunction } from "zod"
import { ZsForeignImport } from "../containers/foreign-import"
import { ZsZenesisAnyImport } from "../containers/zenesis-import"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsOverloads } from "../declarations/classlike/members/overloads"
import { ZsEnum } from "../declarations/enum"
import { ZsValue } from "../declarations/value"
import { ZsTypeSelf } from "../declarations/zenesis-self"
import { ZsGenericFunction } from "../expressions/forall-function"
import { ZsFunction } from "../expressions/function"
import { ZsKeyTypeArg } from "../expressions/map-arg"
import { ZsGeneric } from "../generics/forall-type"
import { ZsTypeArg } from "../generics/type-arg"
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
    ZsImportedType,
    ZsMakable,
    ZsMakeResultType,
    ZsModuleDeclarableType,
    ZsModuleDeclarableTypeLike,
    ZsOrZodFunction,
    ZsReferableType,
    ZsReferableTypeLike
} from "./unions"

export function isZsOrZodFunction(obj: any): obj is ZsOrZodFunction {
    return obj instanceof ZsFunction || obj instanceof ZodFunction
}

export function isZsFunctionLike(obj: any): obj is ZsFunctionLike {
    return isZsOrZodFunction(obj) || obj instanceof ZsGenericFunction
}

export function isTypeImport(obj: any): obj is ZsImportedType {
    return obj instanceof ZsZenesisAnyImport || obj instanceof ZsForeignImport
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
        obj instanceof ZsTypeArg ||
        obj instanceof ZsKeyTypeArg
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

function isExportableType(obj: any): obj is ZsExportableType {
    return isDeclarableType(obj) || isTypeImport(obj)
}

export function isExportableTypeLike(obj: any): obj is ZsExportableTypeLike {
    return (
        isExportableType(obj) || isTypeImport(obj) || obj instanceof ZsGeneric
    )
}

export function isExportable(obj: any): obj is ZsExportable {
    return isExportableTypeLike(obj) || obj instanceof ZsValue
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
        obj instanceof ZsTypeSelf
    )
}

export function isReferableTypeLike(obj: any): obj is ZsReferableTypeLike {
    return isReferableType(obj) || obj instanceof ZsGeneric
}

export function isOverload(obj: any): obj is ZsOverloads {
    return obj instanceof ZsOverloads
}
