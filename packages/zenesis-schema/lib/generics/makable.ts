import { SchemaSubtypeOf } from "../core/operators"
import { ZsFunction } from "../expressions/function"
import { ZsMakeResultType } from "../utils/unions"
import { ZsGeneric } from "./generic"
import { ZsGenericFunction } from "./generic-function"
import { Instantiated } from "./made"
import { ZsTypeVarRefs } from "./type-var"

export interface Makable<
    Vars extends ZsTypeVarRefs = ZsTypeVarRefs,
    Instance extends ZsMakeResultType = ZsMakeResultType
> {
    readonly name: string
    make(
        ...args: {
            [I in keyof Vars]: SchemaSubtypeOf<Vars[I]["_def"]["extends"]>
        }
    ): Instantiated<Instance>
}

/**
 * Given a concrete, non-generic type, and a set of variables will return a generic type
 * with those variables.
 *
 * Works for functions and any generalizable type.
 */

export type Generalize<
    Vars extends ZsTypeVarRefs,
    Schema extends ZsMakeResultType | ZsFunction
> = Schema extends ZsMakeResultType
    ? ZsGeneric<Schema, Vars>
    : Schema extends ZsFunction
      ? ZsGenericFunction<Vars, Schema>
      : never
