import { Type } from "./expecting"

export function the_type<T>(x?: T): Type<T> {
    return {
        equals<Exact>(): Type<T> {
            return this
        },
        assigns_to<Exact>(): Type<T> {
            return this
        },
        assigns_from<Target>(): Type<T> {
            return this
        }
    }
}
