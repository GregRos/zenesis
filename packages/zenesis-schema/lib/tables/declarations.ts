import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsEnum } from "../declarations/enum"
import { ZsValue } from "../declarations/value"
import { ZsGeneric } from "../generics/generic"

export abstract class ZsDeclarationsTable {
    [ZsModuleDeclKind.ZsClass]!: ZsClass;
    [ZsModuleDeclKind.ZsInterface]!: ZsInterface;
    [ZsModuleDeclKind.ZsEnum]!: ZsEnum;
    [ZsModuleDeclKind.ZsTypeAlias]!: ZsTypeAlias;
    [ZsModuleDeclKind.ZsValue]!: ZsValue;
    [ZsModuleDeclKind.ZsGeneric]!: ZsGeneric
}
