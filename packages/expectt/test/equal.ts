import { expectt } from "@lib"

expectt<string>().toEqual<string>()
// @ts-expect-error
expectt<string>().toEqual<number>()
expectt<any>().toEqual<any>()
// @ts-expect-error
expectt<any>().toEqual<string>()
expectt<unknown>().toEqual<unknown>()
expectt<unknown>().toEqual<string>()
// @ts-expect-error
expectt<any>().toEqual<unknown>()
expectt<never>().toEqual<never>()
// @ts-expect-error
expectt<never>().toEqual<string>()

// @ts-expect-error
expectt<any>().toEqual<never>()
// @ts-expect-error
expectt<unknown>().toEqual<never>()

expectt<() => void>().toEqual<() => void>()
expectt<() => void>().not.toEqual<() => string>()
// @ts-expect-error
expectt<() => void>().toEqual<() => string>()
