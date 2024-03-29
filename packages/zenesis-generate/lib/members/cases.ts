import {
    ZsMemberKind,
    ZsMemberTable,
    ZsOverloads,
    ZsTypeTable,
    zenesisError
} from "@zenesis/schema"
import { CallSignatureDeclaration, Modifier, SyntaxKind } from "typescript"
import { ZodTuple } from "zod"
import { extractModifiers } from "../utils/extract-modifiers"
import { tf } from "../utils/tf"
import { getAccess } from "../utils/tokens"
import { MemberContext } from "./member-context"
import { ZsToTsMemberTable } from "./table"

export const cases: {
    [Kind in keyof ZsToTsMemberTable]: (
        this: MemberContext,
        node: ZsMemberTable[Kind]
    ) => ZsToTsMemberTable[Kind]
} = {
    [ZsMemberKind.ZsCallSignature](node) {
        const ctx = this.createExpressionContext()
        return this.convertOverloadsToSomethings(
            node._def.overloads,
            (typeVars, args, returns) => {
                return tf.createCallSignature(typeVars, args, returns)
            }
        )
    },
    [ZsMemberKind.ZsProperty](member) {
        const modifiers = [] as Modifier[]
        const ctx = this.createExpressionContext()
        if (member._def.access !== "public") {
            modifiers.push(getAccess(member._def.access ?? "public"))
        }

        const name = member.name
        const memberType = member._def
            .innerType as ZsTypeTable[keyof ZsTypeTable]
        const { optional, readonly, innerType } = extractModifiers(memberType)
        if (readonly) {
            modifiers.push(readonly)
        }
        if (memberType instanceof ZsOverloads) {
            const callSignatures = ctx
                .recurse(memberType)
                .members.map(x => x as CallSignatureDeclaration)
                .map(sig => {
                    return tf.createMethodSignature(
                        modifiers,
                        name,
                        optional,
                        sig.typeParameters,
                        sig.parameters,
                        sig.type
                    )
                })
            return callSignatures
        }

        return [
            tf.createPropertySignature(
                modifiers,
                name,
                optional,
                ctx.recurse(innerType)
            )
        ]
    },
    [ZsMemberKind.ZsIndexer](indexer) {
        const ctx = this.createExpressionContext()
        const keyParams = this.convertParamsToDeclarations(
            ZodTuple.create([indexer._def.keyType])
        )
        const valueType = ctx.recurse(indexer._def.valueType)
        return tf.createIndexSignature(undefined, keyParams, valueType)
    },
    [ZsMemberKind.ZsConstructor](node) {
        const params = this.convertParamsToDeclarations(node._def.args)
        return tf.createConstructorDeclaration(undefined, params, undefined)
    },
    [ZsMemberKind.ZsConstruct](node) {
        const expr = this.createExpressionContext()
        const types = expr.recurse(node._def.overloads).members.map(member => {
            const sig = member as CallSignatureDeclaration
            return tf.createConstructSignature(
                sig.typeParameters,
                sig.parameters,
                sig.type
            )
        })
        return types
    },
    [ZsMemberKind.ZsImplements](node) {
        const typeExpr = this.getTypeExprForHeritageClause(node)
        if (node._def.kind === "extend") {
            return tf.createHeritageClause(SyntaxKind.ExtendsKeyword, [
                typeExpr
            ])
        } else if (node._def.kind === "auto implement") {
            return tf.createHeritageClause(SyntaxKind.ImplementsKeyword, [
                typeExpr
            ])
        }
        throw zenesisError({
            code: "UnknownHeritageType",
            message: "Unknown heritage type"
        })
    }
}
