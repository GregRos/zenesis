import {
    ZsDeclarationNodeTable,
    ZsImplements,
    ZsModuleDeclKind,
    zenesisError
} from "@zenesis/schema"
import {
    Modifier,
    SyntaxKind,
    TypeParameterDeclaration,
    isHeritageClause
} from "typescript"
import { tf } from "../utils/tf"
import { ZsToTsDeclTable } from "./table"
import { TypeDeclContext } from "./type-decl-context"

export const cases: {
    [Kind in keyof ZsToTsDeclTable]: (
        this: TypeDeclContext,
        modifiers: Modifier[],
        node: ZsDeclarationNodeTable[Kind],
        typeVars?: TypeParameterDeclaration[] | undefined
    ) => ZsToTsDeclTable[Kind]
} = {
    [ZsModuleDeclKind.ZsGeneric](modifiers, generic) {
        const scoped = this.withTypeVars(generic._def.vars)
        const typeVars = scoped
            .createMemberContext()
            .convertTypeVarsToDeclarations(generic._def.vars)
        return scoped.convert(modifiers, generic._def.innerType, typeVars)
    },
    [ZsModuleDeclKind.ZsClass](modifiers, clss, typeVars) {
        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))

        if (clss._def.abstract) {
            modifiers.push(tf.createModifier(SyntaxKind.AbstractKeyword))
        }
        let body = clss._def.body
        if (clss._def.parent) {
            body = body.add(ZsImplements.create(clss._def.parent, "extend"))
        }
        let all = this.convertClassBody(clss._def.body)
        const heritages = all.filterAs(isHeritageClause).toArray().pull()

        const others = all.excludeAs(isHeritageClause).toArray().pull()
        return tf.createClassDeclaration(
            modifiers,
            clss.name,
            typeVars,
            heritages,
            others
        )
    },
    [ZsModuleDeclKind.ZsInterface](modifiers, iface, typeVars) {
        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))
        const parts = this.convertClassBody(iface._def.body)
        const heritages = parts.filterAs(isHeritageClause).toArray().pull()

        const others = parts.excludeAs(isHeritageClause).toArray().pull()
        return tf.createInterfaceDeclaration(
            modifiers,
            iface.name,
            typeVars,
            heritages,
            others as any
        )
    },
    [ZsModuleDeclKind.ZsEnum](modifiers, node) {
        throw zenesisError({
            code: "NotImplemented",
            message: "Enums not implemented"
        })
    },
    [ZsModuleDeclKind.ZsTypeAlias](modifiers, alias, typeVars) {
        modifiers.push(tf.createModifier(SyntaxKind.DeclareKeyword))
        const ctx = this.createExpressionContext()
        const type = ctx.recurse(alias._def.definition())
        return tf.createTypeAliasDeclaration(
            modifiers,
            alias.name,
            typeVars,
            type
        )
    },
    [ZsModuleDeclKind.ZsValue](node) {
        throw zenesisError({
            code: "NotImplemented",
            message: "Values not implemented"
        })
    }
}
