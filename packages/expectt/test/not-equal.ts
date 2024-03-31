import { expectt } from "@lib"

// tests expectt<Type>().not.toEqual<Type>()
expectt<string>().not.toEqual<number>()
// @ts-expect-error
expectt<string>().not.toEqual<string>()
expectt<any>().not.toEqual<string>()
// @ts-expect-error
expectt<any>().not.toEqual<any>()
expectt<unknown>().not.toEqual<string>()
expectt<unknown>().not.toEqual<unknown>()
expectt<unknown>().not.toEqual<any>()
expectt<never>().not.toEqual<string>()
// @ts-expect-error
expectt<never>().not.toEqual<never>()
expectt<never>().not.toEqual<any>()
expectt<any>().not.toEqual<never>()
expectt<() => void>().not.toEqual<() => string>()
// @ts-expect-error
expectt<() => void>().not.toEqual<() => void>()
