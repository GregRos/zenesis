import { ZsForeignImport } from "../containers/foreign-import"
import {
    ZsZenesisGenericImport,
    ZsZenesisImport,
    ZsZenesisTypeImport
} from "../containers/zenesis-import"
import { ZsAstExpr } from "../expressions/ast-expr"
import { ZsForallFunction } from "../expressions/forall-function"
import { ZsFunction } from "../expressions/function"
import { ZsMapArg } from "../expressions/map-arg"
import { ZsForallType } from "../generics/forall-type"
import { ZsTypeArg } from "../generics/type-arg"
import { ZsTypeAlias } from "./alias"
import { ZsClass } from "./classlike/class"
import { ZsInterface } from "./classlike/interface"
import { ZsEnum } from "./enum"

export type ZsForallable = ZsGenericDeclarable | ZsFunction

export type ZsGenericDeclarable = ZsClass | ZsInterface | ZsTypeAlias

export type ZsTypeExportable = ZsClass | ZsInterface | ZsTypeAlias | ZsEnum

export type ZsTypeLikeExportable = ZsTypeExportable | ZsForallType

export type ZsInstantiable =
    | ZsClass
    | ZsInterface
    | ZsTypeAlias
    | ZsAstExpr
    | ZsForeignImport

export type ZsExportable = ZsTypeLikeExportable | ZsForallType
export type ZsDeclarable = ZsExportable | ZsTypeArg | ZsMapArg

export type ZsFunctionLike = ZsFunction | ZsForallFunction

export type ZsReferable =
    | ZsDeclarable
    | ZsZenesisImport
    | ZsForeignImport
    | ZsZenesisTypeImport
    | ZsZenesisGenericImport
