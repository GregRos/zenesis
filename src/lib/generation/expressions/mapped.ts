import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";
import { extractModifiers } from "./extract-modifiers";

export default createHandlers({
    [AnyKind.ZsMapped](node, ctx) {
        const typeParameter = tf.createTypeParameterDeclaration(undefined);
        return tf.createLiteralTypeNode(tf.createStringLiteral("TODO"));
    }
});
