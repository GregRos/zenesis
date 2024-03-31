import { the_type } from "@lib"
// @ts-expect-error
the_type<string>().assigns_to<string>(false)
the_type<string>().assigns_to<number>(false)
the_type<any>().assigns_to<string>(false)

the_type<unknown>().assigns_to<string>(false)
the_type<unknown>().assigns_to<any>(false)
the_type<any>().assigns_to<unknown>(false)
the_type<{ a: 1 }>().assigns_to<{ a: 2 }>(false)
the_type<{ a: 1 }>().assigns_to<{ b: 1 }>(false)
the_type<{ a: 1 }>().assigns_to<{ a: 1; b: 2 }>(false)

the_type<{ a: 100 }>().assigns_to<{ a: 100; b: 200 }>(false)

the_type<string>().assigns_to<string>(true)
// @ts-expect-error
the_type<string>().assigns_to<number>(true)
the_type<any>().assigns_to<any>(true)
// @ts-expect-error
the_type<any>().assigns_to<string>(true)
the_type<unknown>().assigns_to<unknown>(true)
// @ts-expect-error
the_type<unknown>().assigns_to<string>(true)
// @ts-expect-error
the_type<any>().assigns_to<unknown>(true)
the_type<never>().assigns_to<never>(true)
the_type<never>().assigns_to<string>(true)
the_type<any>().assigns_to<any>(true)
the_type<"A">().assigns_to<"A" | "B">(true)
// @ts-expect-error
the_type<"A">().assigns_to<"B" | "C">(true)
the_type<"A" | "B">().assigns_to<"A" | "B" | "C">(true)
// @ts-expect-error
the_type<"A" | "B">().assigns_to<"B" | "C" | "D">(true)
the_type<{}>().assigns_to<{ a?: 1 }>(true)
the_type<{ a?: 1 }>().assigns_to<{}>(true)
the_type<{ a: 1 }>().assigns_to<{ a: 1 }>(true)
the_type<{ a: 1 }>().assigns_to<{ a: 1; b?: 2 }>(true)
the_type<[1]>().assigns_to<[1]>(true)
the_type<[1]>().assigns_to<[1, 2]>(false)
the_type<[1, 2]>().assigns_to<[1]>(false)
the_type<[1, 2]>().assigns_to<[1, 2]>(true)
// @ts-expect-error weird
the_type<[1, 2?]>().assigns_to<[1]>(true)
// this works though
the_type<[1]>().assigns_to<[1, 2?]>(true)

the_type<() => void>().assigns_to<() => void>(true)
// @ts-expect-error
the_type<() => void>().assigns_to<() => string>(true)
the_type<() => void>().assigns_to<() => void>(true)

// generics
function foo<T, U extends T>(t: T, u: U) {
    the_type<T>().assigns_to<U>(false)
    the_type<U>().assigns_to<T>(false)
    the_type<U>().assigns_to<U>(true)
    the_type<T>().assigns_to<T>(true)
}
