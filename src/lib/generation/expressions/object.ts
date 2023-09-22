import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";
import { extractModifiers } from "../extract-modifiers";

export default createHandlers({
    [AnyKind.ZodObject](node, ctx) {
        const members = node.shape();
        const properties = Object.entries(members).map(([name, type]) => {
            const { optional, readonly, innerType } = extractModifiers(type);
            return tf.createPropertySignature(
                readonly ? [readonly] : [],
                name,
                optional,
                ctx.recurse(innerType)
            );
        });
        return tf.createTypeLiteralNode(properties);
    }
});
