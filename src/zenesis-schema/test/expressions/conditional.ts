import { ZsConditional, zs } from "@lib"
import { TypeOf, z } from "zod"
it("should create", () => {
    const cond = zs
        .conditional(z.string())
        .extends(z.number())
        .then(z.string(), z.number())

    expect(cond).toBeInstanceOf(ZsConditional)
    let x: TypeOf<typeof cond> = "a"
})
