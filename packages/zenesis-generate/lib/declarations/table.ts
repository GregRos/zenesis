import { ZsModuleDeclKind } from "@zenesis/schema"
import {
    ClassDeclaration,
    EnumDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    VariableStatement
} from "typescript"

export abstract class ZsToTsDeclTable {
    [ZsModuleDeclKind.ZsClass]!: ClassDeclaration;
    [ZsModuleDeclKind.ZsInterface]!: InterfaceDeclaration;
    [ZsModuleDeclKind.ZsEnum]!: EnumDeclaration;
    [ZsModuleDeclKind.ZsTypeAlias]!: TypeAliasDeclaration;
    [ZsModuleDeclKind.ZsValue]!: FunctionDeclaration | VariableStatement;
    [ZsModuleDeclKind.ZsGeneric]!: this[
        | ZsModuleDeclKind.ZsClass
        | ZsModuleDeclKind.ZsInterface
        | ZsModuleDeclKind.ZsTypeAlias]
}
