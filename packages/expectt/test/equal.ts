import { expect_type } from "@lib"

expect_type<string>().toEqual<string>(true)
// @ts-expect-error
expect_type<string>().toEqual<number>(true)
expect_type<any>().toEqual<any>(true)
// @ts-expect-error
expect_type<any>().toEqual<string>()
expect_type<unknown>().toEqual<unknown>(true)
expect_type<unknown>().toEqual<string>(false)
// @ts-expect-error
expect_type<any>().toEqual<unknown>()
expect_type<never>().toEqual<never>(true)
// @ts-expect-error
expect_type<never>().toEqual<string>()

// @ts-expect-error
expect_type<any>().toEqual<never>()
// @ts-expect-error
expect_type<unknown>().toEqual<never>()

expect_type<() => void>().toEqual<() => void>()
expect_type<() => void>().not.toEqual<() => string>()
// @ts-expect-error
expect_type<() => void>().toEqual<() => string>()
