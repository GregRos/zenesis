import { ZodLiteral, ZodNull, ZodUndefined } from "zod";
import { tf } from "../factory";
import { serializes } from "../node-serializer";
import { AnyKind } from "../../construction/kinds";
import { SyntaxKind } from "typescript";

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

export default serializes({
    [AnyKind.ZodLiteral](ctx, node: ZodLiteral<any>) {
        const literalNode = getLiteralNode(node.value);
        return tf.createLiteralTypeNode(literalNode);
    },
    [AnyKind.ZodNull](ctx, node: ZodNull) {
        return tf.createLiteralTypeNode(tf.createNull());
    },
    [AnyKind.ZodUndefined](ctx, node: ZodUndefined) {
        return tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword);
    },
    [AnyKind.ZodBoolean](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.BooleanKeyword);
    },
    [AnyKind.ZodString](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.StringKeyword);
    },
    [AnyKind.ZodNumber](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.NumberKeyword);
    },
    [AnyKind.ZodBigInt](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.BigIntKeyword);
    },
    [AnyKind.ZodDate](ctx, node) {
        return tf.createTypeReferenceNode("Date", undefined);
    },
    [AnyKind.ZodAny](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.AnyKeyword);
    },
    [AnyKind.ZodUnknown](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.UnknownKeyword);
    },
    [AnyKind.ZodVoid](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.VoidKeyword);
    },
    [AnyKind.ZodNever](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.NeverKeyword);
    },
    [AnyKind.ZodSymbol](ctx, node) {
        return tf.createKeywordTypeNode(SyntaxKind.SymbolKeyword);
    }
});
