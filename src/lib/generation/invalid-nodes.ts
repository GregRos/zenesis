import { isMappedTypeNode, SyntaxKind } from "typescript";
import { createHandlers, tf } from "./tf";
import { AnyKind } from "../construction/kinds";

export default createHandlers({
    [AnyKind.ZodPipeline](node, ctx) {
        throw new Error("Pipelines are not supported");
    },
    [AnyKind.ZodEffects](node, ctx) {
        throw new Error("Effects are not supported");
    }
});
