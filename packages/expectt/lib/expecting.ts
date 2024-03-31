import { NotExpecting } from "./not-expecting"
import { IsEqual } from "./type-relations"

export interface Expectting<Expected> {
    toEqual<Target>(
        this: IsEqual<Expected, Target, Expectting<Expected>>
    ): Expectting<Expected>
    toSubtype<Target>(
        this: IsEqual<Expected, Target, Expectting<Expected>>
    ): Expectting<Expected>
    toSupertype<Target>(
        this: IsEqual<Expected, Target, Expectting<Expected>>
    ): Expectting<Expected>
    readonly not: NotExpecting<Expected>
}
