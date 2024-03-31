import { expect_type } from "@lib"

expect_type<string>().toSubtype<string>(true)
// @ts-expect-error
expect_type<string>().toSubtype<number>(true)
expect_type<any>().toSubtype<any>(true)
// @ts-expect-error
expect_type<any>().toSubtype<string>(true)
expect_type<unknown>().toSubtype<unknown>(true)
// @ts-expect-error
expect_type<unknown>().toSubtype<string>(true)
// @ts-expect-error
expect_type<any>().toSubtype<unknown>(true)
expect_type<never>().toSubtype<never>(true)
// @ts-expect-error
expect_type<never>().toSubtype<string>(true)
expect_type<any>().toSubtype<never>(true)
