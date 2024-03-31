import { the_type } from "@lib"

the_type<string>().equals<string>(true)
// @ts-expect-error
the_type<string>().equals<number>(true)
the_type<any>().equals<any>(true)
// @ts-expect-error
the_type<any>().equals<string>(true)
the_type<unknown>().equals<unknown>(true)
// @ts-expect-error
the_type<unknown>().equals<string>(true)
// @ts-expect-error
the_type<any>().equals<unknown>(true)
the_type<never>().equals<never>(true)
// @ts-expect-error
the_type<never>().equals<string>(true)

// @ts-expect-error
the_type<any>().equals<never>(true)
// @ts-expect-error
the_type<unknown>().equals<never>(true)

the_type<() => void>().equals<() => void>(true)
// @ts-expect-error
the_type<() => void>().equals<() => string>(true)
// @ts-expect-error
the_type<() => void>().equals<() => string>(true)
