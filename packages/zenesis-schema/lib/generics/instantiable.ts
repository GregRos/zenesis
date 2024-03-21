import { SchemaSubtypeOf } from "../core/operators"
import { ZsMakeResultType } from "../utils/unions"
import { ZsMade } from "./instantiation"
import { ZsTypeVarTuple } from "./type-var"

export interface Instantiable<
    Vars extends ZsTypeVarTuple,
    Instance extends ZsMakeResultType
> {
    readonly name: string
    make(
        ...args: {
            [I in keyof Vars]: SchemaSubtypeOf<Vars[I]["_def"]["extends"]>
        }
    ): ZsMade<Instance>
}
