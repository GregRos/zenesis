import { SchemaSubtypeOf } from "../core/operators"
import { ZsInstantiable } from "../declarations/unions"
import { ZsInstantiation } from "./instantiation"
import { ZsTypeVarTuple } from "./type-var"

export interface Instantiable<
    Vars extends ZsTypeVarTuple,
    Instance extends ZsInstantiable
> {
    readonly name: string
    instantiate(
        ...args: {
            [I in keyof Vars]: SchemaSubtypeOf<Vars[I]["_def"]["extends"]>
        }
    ): ZsInstantiation<Instance>
}

type Item<Optional extends boolean = boolean, Type = unknown> = {
    optional: Optional
    element: Type
}

type OptionalReduced<Boxes extends [Item, ...Item[]]> = Boxes

type ExampleInput = [Item<false, string>, Item<true, number>]

// BoxExampleReduced ≡ [string, number?]
type BoxExampleReduced = OptionalReduced<ExampleInput>
