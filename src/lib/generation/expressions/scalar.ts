import { createHandlers, tf } from "../tf";
import { ZodFirstPartyTypeKind, ZodLiteral, ZodNull, ZodString } from "zod";
import { SyntaxKind } from "typescript";
import { AnyKind } from "../../construction/kinds";

function getLiteralNode(value: any) {
    switch (typeof value) {
        case "string":
            return tf.createStringLiteral(value);
        case "number":
            return tf.createNumericLiteral(value);
        case "boolean":
            return value ? tf.createTrue() : tf.createFalse();
        default:
            throw new Error(`Unsupported literal type: ${typeof value}`);
    }
}

export const scalarWalker = createHandlers({
    [AnyKind.ZodLiteral](node, ctx) {
        const literalNode = getLiteralNode(node.value);
        return tf.createLiteralTypeNode(literalNode);
    },
    [AnyKind.ZodNull](node, ctx) {
        return tf.createLiteralTypeNode(tf.createNull());
    },
    [AnyKind.ZodUndefined](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword);
    },
    [AnyKind.ZodBoolean](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
    },
    [AnyKind.ZodString](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.StringKeyword);
    },
    [AnyKind.ZodNumber](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.NumberKeyword);
    },
    [AnyKind.ZodBigInt](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.BigIntKeyword);
    },
    [AnyKind.ZodDate](node, ctx) {
        return tf.createTypeReferenceNode("Date", undefined);
    },
    [AnyKind.ZodAny](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.AnyKeyword);
    },
    [AnyKind.ZodUnknown](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.UnknownKeyword);
    },
    [AnyKind.ZodVoid](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.VoidKeyword);
    },
    [AnyKind.ZodNever](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.NeverKeyword);
    },
    [AnyKind.ZodSymbol](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.SymbolKeyword);
    }
});
