import { ZsIf, ZsMonoLike } from "@lib/index"
import { declare, type, type_of } from "declare-it"
import z, { ZodBoolean, ZodNull, ZodNumber, ZodString } from "zod"
// Copilot: In this file, the declare-it type check works like this:
// expect(type_of(value)).to_equal(type<ExpectedType>)
// THERE IS NO PARENTHESES TO CALL THE type FUNCTION
declare.it("construct", expect => {
    const zsIf = ZsIf.create(z.string())
    const result = zsIf.extends(() => z.null())
    expect(type_of(result)).to_subtype(
        type<{
            then: any
        }>
    )
    const result2 = result.then(() => z.boolean())
    const result3 = result2.else(z.number())
    expect(type_of(result3)).to_equal(
        type<ZsIf<ZodString, ZodNull, ZodBoolean, ZodNumber>>
    )

    expect(type_of(result3)).to_subtype(type<ZsMonoLike<boolean | number>>)
    // STOP CALLING THE type FUNCTION
    // it's not callable
})

declare.it("modify", check => {
    const zsIf = ZsIf.create(z.string())
        .extends(() => z.null())
        .then(() => z.boolean())
        .else(z.number())

    check = expect_type_of(zsIf.else(z.string())).to_equal<
        ZsIf<ZodString, ZodNull, ZodBoolean, ZodString>
    >()
    check = expect_type_of(zsIf.else(z.number())).to_equal<
        ZsIf<ZodString, ZodNull, ZodBoolean, ZodNumber>
    >()
    check = expect_type_of(zsIf.then(() => z.number())).to_equal<
        ZsIf<ZodString, ZodNull, ZodNumber, ZodNumber>
    >()

    // Converting to the new syntax:
    expect(
        type_of(zsIf.else(z.string())).to_equal(
            type<ZsIf<ZodString, ZodNull, ZodBoolean, ZodString>>
        )
    )
    expect(
        type_of(zsIf.else(z.number())).to_equal(
            type<ZsIf<ZodString, ZodNull, ZodBoolean, ZodNumber>>
        )
    )
})
