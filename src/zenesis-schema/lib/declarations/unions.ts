import { ZsForeignImport } from "../containers/foreign-import"
import {
    ZsZenesisGenericImport,
    ZsZenesisImport,
    ZsZenesisTypeImport
} from "../containers/zenesis-import"
import { ZsAstExpr } from "../expressions/ast-expr"
import { ZsMapVar } from "../expressions/map-var"
import { ZsTypeAlias } from "./alias"
import { ZsClass } from "./classlike/class"
import { ZsInterface } from "./classlike/interface"
import { ZsEnum } from "./enum"
import { ZsGeneric } from "./generics/generic"
import { ZsTypeVar } from "./generics/type-var"

export type ZsGenericDeclarable = ZsClass | ZsInterface | ZsTypeAlias

export type ZsTypeExportable = ZsClass | ZsInterface | ZsTypeAlias | ZsEnum

export type ZsTypeLikeExportable = ZsTypeExportable | ZsGeneric

export type ZsInstantiable =
    | ZsClass
    | ZsInterface
    | ZsTypeAlias
    | ZsAstExpr
    | ZsForeignImport

export type ZsExportable = ZsTypeLikeExportable | ZsGeneric
export type ZsDeclarable = ZsExportable | ZsTypeVar | ZsMapVar

export type ZsReferable =
    | ZsDeclarable
    | ZsZenesisImport
    | ZsForeignImport
    | ZsZenesisTypeImport
    | ZsZenesisGenericImport
