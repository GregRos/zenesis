import { ZenesisBuildError } from "../errors"
import * as checks from "./checks"
import { describeZenesisNode } from "./describe"

export type GetIsType<F> = F extends (input: any) => input is infer X
    ? X
    : never

export type Assertions = {
    [K in keyof typeof checks]: (
        input: Parameters<(typeof checks)[K]>[0],
        name: string,
        message?: string
    ) => asserts input is GetIsType<(typeof checks)[K]>
}

export const asserts: Assertions = Object.fromEntries(
    Object.entries(checks).map(([key, value]) => [
        key,
        (input: any, name: string) => {
            if (!value(input)) {
                throw new ZenesisBuildError(
                    `zenesis/build/${key}`,
                    `Expected input ${name} to fulfill ${key}, but it was ${describeZenesisNode(input)}`
                )
            }
        }
    ])
) as any
