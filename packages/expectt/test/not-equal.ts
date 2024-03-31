import { expect_type } from "@lib"

// tests expectt<Type>().not.toEqual<Type>()
expect_type<string>().not.toEqual<number>()
// @ts-expect-error
expect_type<string>().not.toEqual<string>()
expect_type<any>().not.toEqual<string>()
// @ts-expect-error
expect_type<any>().not.toEqual<any>()
expect_type<unknown>().toEqual<string>(1)
expect_type<unknown>().not.toEqual<unknown>(true)
expect_type<unknown>().not.toEqual<any>()
expect_type<never>().not.toEqual<string>()
// @ts-expect-error
expect_type<never>().not.toEqual<never>()
expect_type<never>().not.toEqual<any>()
expect_type<any>().not.toEqual<never>()
expect_type<() => void>().not.toEqual<() => string>()
// @ts-expect-error
expect_type<() => void>().not.toEqual<() => void>()
