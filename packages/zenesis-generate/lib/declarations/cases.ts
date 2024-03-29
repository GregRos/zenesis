import { ZsDeclarationsTable, ZsModuleDeclKind, ZsTypeTable } from "@zenesis/schema"
import { ZsToTsDeclTable } from "./table"
import { Modifier, SyntaxKind } from "typescript"
import { tf } from "../utils/tf"
import { TypeDeclContext } from "./type-decl-context"

export const cases: {
    [Kind in keyof ZsToTsDeclTable]: (
        this: TypeDeclContext,
        modifiers: Modifier[],
        node: ZsDeclarationsTable[Kind]
    ) => ZsToTsDeclTable[Kind]
} = {
    constructor()
    [ZsModuleDeclKind.ZsClass](modifiers, node) {
        
    },
    [ZsModuleDeclKind.ZsInterface](modifiers, node) {
        
    },
    [ZsModuleDeclKind.ZsEnum](modifiers, node) {
        
    },
    [ZsModuleDeclKind.ZsTypeAlias](modifiers, node) {
        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))
        const ctx = this.createExpressionContext()
        const type = ctx.recurse(node.))
        return tf.createTypeAliasDeclaration(
            modifiers,
            alias.name,
            typeVars,
            type
        )
    },
    [ZsModuleDeclKind.ZsValue](node) {
        
    },
}
