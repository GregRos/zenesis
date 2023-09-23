import { createHandlers } from "./tf"
import { AnyTypeKind } from "../construction/kinds"

export default createHandlers({
    [AnyTypeKind.ZodPipeline](node, ctx) {
        throw new Error("Pipelines are not supported")
    },
    [AnyTypeKind.ZodEffects](node, ctx) {
        throw new Error("Effects are not supported")
    }
})
