import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";
import {
    NamedTupleMember,
    SyntaxKind,
    TypeNode,
    TypeReferenceNode
} from "typescript";
import { z } from "zod";
import { ExtractModifier, extractModifiers } from "../extract-modifiers";

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

export default createHandlers({
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
    },
    [AnyKind.ZodArray](node, ctx) {
        return tf.createArrayTypeNode(ctx.recurse(node.type));
    },
    [AnyKind.ZodMap](node, ctx) {
        return tf.createTypeReferenceNode("Map", [
            ctx.recurse(node.keyType),
            ctx.recurse(node.valueType)
        ]);
    },
    [AnyKind.ZodSet](node, ctx) {
        return tf.createTypeReferenceNode("Set", [ctx.recurse(node.valueType)]);
    },
    [AnyKind.ZodRecord](node, ctx) {
        return tf.createTypeReferenceNode("Record", [
            ctx.recurse(node.keyType),
            ctx.recurse(node.valueType)
        ]);
    },
    [AnyKind.ZodTuple](node, ctx) {
        const members = node.items.map(item => {
            const { innerType, optional } = extractModifiers(
                item,
                ExtractModifier.Optional
            );
            const recursed = ctx.recurse(innerType);
            return optional ? tf.createOptionalTypeNode(recursed) : recursed;
        });
        if (node.rest) {
            members.push(tf.createRestTypeNode(ctx.recurse(node.rest)));
        }
        return tf.createTupleTypeNode(members);
    },
    [AnyKind.ZodUnion](node, ctx) {
        return tf.createUnionTypeNode(
            node.options.map(option => ctx.recurse(option))
        );
    },
    [AnyKind.ZodIntersection](node, ctx) {
        return tf.createIntersectionTypeNode([
            ctx.recurse(node.left),
            ctx.recurse(node.right)
        ]);
    },
    [AnyKind.ZodNullable](node, ctx) {
        return tf.createUnionTypeNode([
            ctx.recurse(node.innerType),
            tf.createLiteralTypeNode(tf.createNull())
        ]);
    },
    [AnyKind.ZodDefault](node, ctx) {
        return ctx.recurse(node.innerType);
    },
    [AnyKind.ZodPromise](node, ctx) {
        return tf.createTypeReferenceNode("Promise", [ctx.recurse(node.type)]);
    },
    [AnyKind.ZodCatch](node, ctx) {
        return ctx.recurse(node.innerType);
    },

    [AnyKind.ZsClass](node, ctx) {
        return ctx.scope.get(node);
    },
    [AnyKind.ZsInterface](node, ctx) {
        return ctx.scope.get(node);
    },
    [AnyKind.ZsTypeAlias](node, ctx) {
        return ctx.scope.get(node);
    },
    [AnyKind.ZsTypeVar](node, ctx) {
        return ctx.scope.get(node);
    },
    [AnyKind.ZsMapVar](node, ctx) {
        return ctx.scope.get(node);
    },
    [AnyKind.ZsKeyof](node, ctx) {
        return tf.createTypeOperatorNode(
            SyntaxKind.KeyOfKeyword,
            ctx.recurse(node.of)
        );
    },

    [AnyKind.ZodDiscriminatedUnion](node, ctx) {
        return tf.createUnionTypeNode(node.options.map(x => ctx.recurse(x)));
    },
    [AnyKind.ZodBranded](node, ctx) {
        return ctx.recurse(node.type);
    },

    [AnyKind.ZodLazy](node, ctx) {
        return ctx.recurse(node.getter());
    },
    [AnyKind.ZsInstantiation](node, ctx) {
        // An instantiation will always be of a declared type that must be in scope
        const genericType = ctx.scope.get(node.instance) as TypeReferenceNode;
        const typeArgs = node.typeArgs.map(arg => ctx.recurse(arg));
        return tf.createTypeReferenceNode(genericType.typeName, typeArgs);
    },
    [AnyKind.ZsLookup](node, ctx) {
        const targetType = ctx.recurse(node.target);
        const indexType = ctx.recurse(node.index);
        return tf.createIndexedAccessTypeNode(targetType, indexType);
    }
});
