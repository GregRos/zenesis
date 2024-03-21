import { ZodType } from "zod"
import { ZsStructural } from "../core/misc-node"

export const desc = Symbol("describe")

export function describeZenesisNode(node: any) {
    if (node instanceof ZodType) {
        return node._def.typeName
    }
    if (node instanceof ZsStructural) {
    }
}
