import { zenesisError } from "../errors"
import { ZsRefKind } from "./ref-kind"

export interface ReferenceDef<Referenced extends {}> {
    readonly via: ZsRefKind
    readonly name: string
    readonly text: string
    deref(): Referenced
}

export function createReference<Ref extends ReferenceDef<{}>>(
    reference: Ref
): Ref & ReturnType<Ref["deref"]> {
    function raiseIllegal(action: string): () => never {
        return () => {
            throw zenesisError({
                code: "reference/illegal-operation",
                message: `Cannot ${action} on ${reference.via} "${reference.name}".`
            })
        }
    }
    return new Proxy(reference, {
        get(target, prop) {
            if (prop in target) {
                return (target as any)[prop]
            }
            const inner = reference.deref()

            if (!(prop in inner)) {
                throw zenesisError({
                    code: "reference/prop-not-found",
                    message: `Property "${String(prop)}" not found in ${reference.via} reference to "${reference.name}".`
                })
            }
            const result = (inner as any)[prop]
            if (typeof result === "function") {
                return result.bind(inner)
            }
            return result
        },
        getPrototypeOf(target) {
            return Object.getPrototypeOf(reference.deref())
        },
        set: raiseIllegal("set"),
        deleteProperty: raiseIllegal("delete"),
        defineProperty: raiseIllegal("define"),
        ownKeys: () =>
            Reflect.ownKeys([
                ...Object.keys(reference),
                ...Object.keys(reference.deref())
            ]),
        has(target, prop) {
            return prop in reference || prop in reference.deref()
        },
        getOwnPropertyDescriptor(target, prop) {
            const desc =
                Object.getOwnPropertyDescriptor(reference, prop) ||
                Object.getOwnPropertyDescriptor(reference.deref(), prop)
            if (desc) {
                desc.configurable = false
            }
            return desc
        }
    }) as any
}
