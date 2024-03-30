import {
    ForallClause,
    ZsAstExpr,
    ZsFunction,
    ZsIf,
    ZsKeyof,
    ZsLookup,
    ZsMapped
} from "@zenesis/schema"
import { z } from "zod"
import { ZsWorld } from "./modules/world"

export * from "@zenesis/schema"
export { ZsWorld, zs }
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const result: any = {}
    for (const key of keys) {
        result[key] = obj[key]
    }
    return result
}

const zs = {
    ...pick(
        z,
        "literal",
        "void",
        "tuple",
        "unknown",
        "string",
        "number",
        "boolean",
        "null",
        "undefined",
        "object",
        "array",
        "record",
        "map",
        "set",
        "function",
        "promise",
        "date",
        "bigint",
        "symbol"
    ),
    forall: ForallClause.create,
    lookup: ZsLookup.create,
    if: ZsIf.create,
    function: ZsFunction.create,
    fun: ZsFunction.create,
    keyof: ZsKeyof.create,
    map: ZsMapped.create,
    ast: ZsAstExpr.create,
    World: ZsWorld.create
}
