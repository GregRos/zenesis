import {
    ZsClass,
    ZsEnum,
    ZsGenericType,
    ZsInstantiation,
    ZsInterface,
    ZsTypeAlias,
    ZsTypeKind
} from "../../construction"
import {
    ClassDeclaration,
    EnumDeclaration,
    ExpressionWithTypeArguments,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    TypeReferenceNode
} from "typescript"
import { ZsValue } from "../../construction/module-declarations/value"

export class DeclarationSchemaTable {
    [ZsTypeKind.ZsClass]!: ZsClass;
    [ZsTypeKind.ZsInterface]!: ZsInterface;
    [ZsTypeKind.ZsTypeAlias]!: ZsTypeAlias;
    [ZsTypeKind.ZsEnum]!: ZsEnum;
    [ZsTypeKind.ZsGenericType]!: ZsGenericType;
    [ZsTypeKind.ZsValue]!: ZsValue
}

export class DeclarationOutTable {
    [ZsTypeKind.ZsClass]!: ClassDeclaration;
    [ZsTypeKind.ZsInterface]!: InterfaceDeclaration;
    [ZsTypeKind.ZsTypeAlias]!: TypeAliasDeclaration;
    [ZsTypeKind.ZsEnum]!: EnumDeclaration;
    [ZsTypeKind.ZsGenericType]!:
        | ClassDeclaration
        | InterfaceDeclaration
        | TypeAliasDeclaration
}
