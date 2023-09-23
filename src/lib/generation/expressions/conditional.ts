import { createHandlers, tf } from "../tf"
import { AnyTypeKind } from "../../construction/kinds"

export default createHandlers({
    [AnyTypeKind.ZsConditional](node, ctx) {
        return tf.createConditionalTypeNode(
            ctx.recurse(node.what),
            ctx.recurse(node.extends),
            ctx.recurse(node.then),
            ctx.recurse(node.otherwise)
        )
    }
})
