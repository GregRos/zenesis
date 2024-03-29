import { ZsDeclKind } from "@zenesis/schema/lib/core/declaration-kind"
import {
    ClassDeclaration,
    EnumDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    VariableStatement
} from "typescript"

export abstract class ZsToTsDeclTable {
    [ZsDeclKind.ZsClass]!: ClassDeclaration;
    [ZsDeclKind.ZsInterface]!: InterfaceDeclaration;
    [ZsDeclKind.ZsEnum]!: EnumDeclaration;
    [ZsDeclKind.ZsTypeAlias]!: TypeAliasDeclaration;
    [ZsDeclKind.ZsValue]!: FunctionDeclaration | VariableStatement;
    [ZsDeclKind.ZsGeneric]!: this[
        | ZsDeclKind.ZsClass
        | ZsDeclKind.ZsInterface
        | ZsDeclKind.ZsTypeAlias]
}
