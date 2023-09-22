import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";

export default createHandlers({
    [AnyKind.ZsConditional](node, ctx) {
        return tf.createConditionalTypeNode(
            ctx.recurse(node.what),
            ctx.recurse(node.extends),
            ctx.recurse(node.then),
            ctx.recurse(node.otherwise)
        );
    }
});
