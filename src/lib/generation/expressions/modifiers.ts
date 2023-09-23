import { createHandlers, tf } from "../tf"
import { AnyTypeKind } from "../../construction/kinds"
import { SyntaxKind } from "typescript"

export default createHandlers({
    [AnyTypeKind.ZodOptional](node, ctx) {
        // convert to T | undefined
        const innerType = ctx.recurse(node.innerType)
        return tf.createUnionTypeNode([
            innerType,
            tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
    },
    [AnyTypeKind.ZodReadonly](node, ctx) {
        // take care of nested readonlies
        const innerType = ctx.recurse(node.innerType)
        // Instantiate Readonly
        return tf.createTypeReferenceNode(tf.createIdentifier("Readonly"), [
            innerType
        ])
    }
})
