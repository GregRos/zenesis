import { ZodString } from "zod";
import { tf } from "../factory";
import ts from "typescript";

export function tsString(node: ZodString) {
    return tf.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
}
