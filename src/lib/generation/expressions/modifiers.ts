import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";
import { isMappedTypeNode, SyntaxKind } from "typescript";
import { expect } from "@assertive-ts/core";
import { ExtractModifier, extractModifiers } from "../extract-modifiers";

export default createHandlers({
    [AnyKind.ZodOptional](node, ctx) {
        // convert to T | undefined
        const innerType = ctx.recurse(node.innerType);
        return tf.createUnionTypeNode([
            innerType,
            tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ]);
    },
    [AnyKind.ZodReadonly](node, ctx) {
        // take care of nested readonlies
        const innerType = ctx.recurse(node.innerType);
        // Instantiate Readonly
        return tf.createTypeReferenceNode(tf.createIdentifier("Readonly"), [
            innerType
        ]);
    }
});
