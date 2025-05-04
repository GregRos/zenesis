import { lazy } from "doddle"
import { zenesisError } from "../errors"
import { ZsRefKind } from "./ref-kind"

export const symVia = Symbol("via")

export interface ZsReferenceDef<Referenced> {
    readonly via: ZsRefKind
    readonly name: string
    readonly text: string
    readonly isResolved: boolean
    deref(): Referenced
}

export type ZsReferenceInput<Ref extends ZsReferenceDef<unknown>> = Omit<
    Ref,
    "via" | "isResolved"
>

export type ZsBaseReference<T> = T & ZsReferenceDef<T>
export function createReference<Ref extends ZsReferenceDef<{}>>(
    kind: ZsRefKind,
    referenceInput: ZsReferenceInput<Ref>
): Ref & ReturnType<Ref["deref"]> {
    const refTarget = lazy(referenceInput.deref)
    const reference = {
        ...referenceInput,
        [symVia]: kind,
        deref: refTarget.pull,
        via: kind,
        equals: undefined,
        get isResolved() {
            return refTarget.stage === "ready"
        }
    }
    function raiseIllegal(action: string): () => never {
        return () => {
            throw zenesisError({
                code: "reference/illegal-operation",
                message: `Cannot ${action} on ${reference.via} "${reference.name}".`
            })
        }
    }
    return new Proxy(
        {
            ...reference,
            [symVia]: reference.via
        },
        {
            get(target, prop) {
                if (prop === symVia) {
                    return reference.via
                }
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
        }
    ) as any
}
