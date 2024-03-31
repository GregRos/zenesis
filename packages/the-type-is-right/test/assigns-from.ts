import { the_type } from "@lib"
// @ts-expect-error
the_type<string>().assigns_from<string>(false)
the_type<string>().assigns_from<number>(false)
// @ts-expect-error
the_type<unknown>().assigns_from<string>(false)

the_type<{ a: 1 }>().assigns_from<{ a: 2 }>(false)
the_type<{ a: 1 }>().assigns_from<{ b: 1 }>(false)
the_type<{ a: 1 }>().assigns_from<{ a: 1; b: 2 }>(true)

the_type<{ a: 100 }>().assigns_from<{ a: 100; b: 200 }>(true)

the_type<string>().assigns_from<string>(true)
// @ts-expect-error
the_type<string>().assigns_from<number>(true)
the_type<any>().assigns_from<any>(true)
// @ts-expect-error
the_type<any>().assigns_from<string>(true)
the_type<unknown>().assigns_from<unknown>(true)
the_type<unknown>().assigns_from<string>(true)
// @ts-expect-error
the_type<any>().assigns_from<unknown>(true)
the_type<never>().assigns_from<never>(true)
the_type<never>().assigns_from<string>(false)
the_type<any>().assigns_from<any>(true)
the_type<"A">().assigns_from<"A" | "B">(false)
// @ts-expect-error
the_type<"A">().assigns_from<"B" | "C">(true)
the_type<"A" | "B">().assigns_from<"A" | "B" | "C">(false)
// @ts-expect-error
the_type<"A" | "B">().assigns_from<"B" | "C" | "D">(true)
/*...*/
/*...*/
the_type<{}>().assigns_from<{ a?: 1 }>(true)
the_type<{ a?: 1 }>().assigns_from<{}>(true)
the_type<{ a: 1 }>().assigns_from<{ a: 1 }>(true)
the_type<{ a: 1 }>().assigns_from<{ a: 1; b?: 2 }>(true)
the_type<[1]>().assigns_from<[1]>(true)
the_type<[1]>().assigns_from<[1, 2]>(false)
the_type<[1, 2]>().assigns_from<[1]>(false)
the_type<[1, 2]>().assigns_from<[1, 2]>(true)
the_type<[1, 2?]>().assigns_from<[1]>(true)
the_type<[1]>().assigns_from<[1, 2?]>(false)

the_type<() => void>().assigns_from<() => void>(true)
the_type<() => void>().assigns_from<() => string>(true)
the_type<() => void>().assigns_from<() => void>(true)
