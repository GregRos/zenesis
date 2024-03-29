export { zs }
import {
    ForallClause,
    TypeVar,
    ZsAstExpr,
    ZsFunction,
    ZsIf,
    ZsKeyof,
    ZsLookup,
    ZsMapped
} from "@zenesis/schema"
import { z } from "zod"
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
    typeVar: TypeVar.create,
    if: ZsIf.create,
    function: ZsFunction.create,
    fun: ZsFunction.create,
    keyof: ZsKeyof.create,
    map: ZsMapped.create,
    ast: ZsAstExpr.create,
    world: ZsWorld
}
