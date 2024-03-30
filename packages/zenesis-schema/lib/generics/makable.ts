import { ZsFunction } from "../expressions/function"
import { ZsGenericFunction } from "../expressions/generic-function"
import { ZsGeneralizable, ZsGeneralizableType } from "../utils/unions"
import { ZsGeneric } from "./generic"
import { ZsTypeVars } from "./type-var"

/**
 * Given a concrete, non-generic type, and a set of variables will return a generic type
 * with those variables.
 *
 * Works for functions and any generalizable type.
 */

export type Generalize<
    Vars extends ZsTypeVars,
    Schema extends ZsGeneralizable
> = Schema extends ZsGeneralizableType
    ? ZsGeneric<Schema, Vars>
    : Schema extends ZsFunction
      ? ZsGenericFunction<Vars, Schema>
      : never
