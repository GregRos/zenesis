import { the_type } from "@lib"

// tests expectt<Type>().not.toEqual<Type>()
the_type<string>().equals<number>(false)
// @ts-expect-error
the_type<string>().equals<string>(false)
the_type<any>().equals<string>(false)
// @ts-expect-error
the_type<any>().equals<any>(false)
the_type<unknown>().equals<string>(false)
the_type<unknown>().equals<any>(false)
the_type<never>().equals<string>(false)
// @ts-expect-error
the_type<never>().equals<never>(false)
the_type<never>().equals<any>(false)
the_type<any>().equals<never>(false)
the_type<() => void>().equals<() => string>(false)
// @ts-expect-error
the_type<() => void>().equals<() => void>(false)
