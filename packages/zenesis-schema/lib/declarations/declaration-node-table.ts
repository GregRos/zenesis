import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsGeneric } from "../generics/generic"
import { ZsTypeAlias } from "./alias"
import { ZsClass } from "./classlike/class"
import { ZsInterface } from "./classlike/interface"
import { ZsEnum } from "./enum"
import { ZsValue } from "./value"

export abstract class ZsDeclarationNodeTable {
    [ZsModuleDeclKind.ZsClass]!: ZsClass;
    [ZsModuleDeclKind.ZsInterface]!: ZsInterface;
    [ZsModuleDeclKind.ZsEnum]!: ZsEnum;
    [ZsModuleDeclKind.ZsTypeAlias]!: ZsTypeAlias;
    [ZsModuleDeclKind.ZsValue]!: ZsValue;
    [ZsModuleDeclKind.ZsGeneric]!: ZsGeneric
}
