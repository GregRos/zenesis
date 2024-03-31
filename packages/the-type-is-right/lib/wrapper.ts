import { TheType } from "./expecting"

export function the_type<T>(x?: T): TheType<T> {
    return {
        equals<Exact>(): TheType<T> {
            return this
        },
        assigns_to<Exact>(): TheType<T> {
            return this
        },
        assigns_from<Target>(): TheType<T> {
            return this
        }
    }
}
