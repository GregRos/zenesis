import { ZsForeignImport } from "./containers/foreign-import"
import { ZsZenesisImport } from "./containers/zenesis-import"
import { ZsMonoType } from "./core/mono-type"
import { ZsTypeAlias } from "./declarations/alias"
import { ZsMemberable } from "./declarations/classlike/body"
import { ZsClass } from "./declarations/classlike/class"
import { ZsInterface } from "./declarations/classlike/interface"
import { ZsConstructor } from "./declarations/classlike/members/constructor"
import { ZsImplements } from "./declarations/classlike/members/implements"
import { ZsIndexer } from "./declarations/classlike/members/indexer"
import { ZsMember } from "./declarations/classlike/members/member"
import { ZsEnum } from "./declarations/enum"
import {
    ZsDeclarable,
    ZsExportable,
    ZsReferable,
    ZsTypeLikeExportable
} from "./declarations/unions"
import { ZsValue } from "./declarations/value"
import { ZsAstExpr } from "./expressions/ast-expr"
import { ZsForallFunction } from "./expressions/forall-function"
import { ZsMapArg } from "./expressions/map-arg"
import { ZsForallType } from "./generics/forall-type"
import { ZsTypeVar } from "./generics/type-var"

export function isExportable(node: object): node is ZsExportable {
    return [ZsClass, ZsInterface, ZsEnum, ZsValue, ZsForallType].some(
        c => node instanceof c
    )
}

export function isDeclarable(node: object): node is ZsDeclarable {
    return (
        isExportable(node) ||
        node instanceof ZsTypeVar ||
        node instanceof ZsMapArg
    )
}

export function isReferable(node: object): node is ZsReferable {
    return isDeclarable(node) || isForeignImport(node) || isZenesisImport(node)
}

export function isMemberable(node: object): node is ZsMemberable {
    return [ZsMember, ZsImplements, ZsConstructor, ZsIndexer].some(
        c => node instanceof c
    )
}

export function isValue(node: object): node is ZsValue {
    return node instanceof ZsValue
}

export function isType(node: object): node is ZsForallType | ZsMonoType {
    return node instanceof ZsForallType || node instanceof ZsMonoType
}

export function isTypeVar(node: object): node is ZsTypeVar {
    return node instanceof ZsForallType
}

export function isAstExpr(node: object): node is ZsAstExpr {
    return node instanceof ZsAstExpr
}

export function isMapVar(node: object): node is ZsTypeVar {
    return node instanceof ZsTypeVar
}

export function isForeignImport(node: object): node is ZsForeignImport {
    return node instanceof ZsForeignImport
}

export function isZenesisImport(node: object): node is ZsZenesisImport {
    return node instanceof ZsZenesisImport
}

export function isForallFunction(node: object): node is ZsForallFunction {
    return node instanceof ZsForallFunction
}

export function isTypeLikeExportable(
    node: object
): node is ZsTypeLikeExportable {
    return [ZsClass, ZsInterface, ZsEnum, ZsTypeAlias, ZsEnum].some(
        c => node instanceof c
    )
}
