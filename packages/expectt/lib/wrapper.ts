import { Expectting } from "./expecting"

export function expectt<T>(x?: T): Expectting<T> {
    return {
        get not() {
            return this as any
        },
        toEqual<Exact>(): Expectting<T> {
            return this
        },
        toSubtype<Exact>(): Expectting<T> {
            return this
        },
        toSupertype<Target>(): Expectting<T> {
            return this
        }
    }
}
