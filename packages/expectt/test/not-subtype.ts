import { expectt } from "@lib"

expectt<string>().toSubtype<string>()
// @ts-expect-error
expectt<string>().toSubtype<number>()
expectt<any>().toSubtype<any>()
// @ts-expect-error
expectt<any>().toSubtype<string>()
expectt<unknown>().toSubtype<unknown>()
// @ts-expect-error
expectt<unknown>().toSubtype<string>()
// @ts-expect-error
expectt<any>().toSubtype<unknown>()
expectt<never>().toSubtype<never>()
// @ts-expect-error
expectt<never>().toSubtype<string>()
expectt<any>().toSubtype<never>()
