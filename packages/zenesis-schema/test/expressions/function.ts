import { ZsFunction, ZsTypeKind } from "@lib"
import { ZsRestBuilder } from "@lib/expressions/function"
import { ZodTuple, z } from "zod"
import { expectt } from "../expect-type"

it("constructs", () => {
    const f = ZsFunction.create()
    expect(f).toBeInstanceOf(ZsFunction)
    const identical = new ZsFunction({
        typeName: ZsTypeKind.ZsFunction,
        args: z.tuple([]),
        returns: z.unknown()
    })
    expect(f).toEqual(identical)
    expectt(f as unknown).toEqual<unknown>(false)
    expectt(f as any).toEqual<unknown>(false)
    expectt("a" as "a").toEqual<string>(true)
    expectt(f)
        .exact<ZsRestBuilder<ZodTuple<[], null>>>()
        .from<string>(false)
        .exact<ZsFunction>(false)
        .to<ZsFunction>(false)
})

it("args", () => {
    const f = ZsFunction.create()
    const f2 = f.args(z.string())
    expect(f2).toBeInstanceOf(ZsFunction)
    expectt(f2)
        .from<ZsRestBuilder<ZodTuple<[z.ZodString]>>>(true)
        .from<ZsFunction>(true)
        .to<ZsFunction>(false)
})

it("returns", () => {
    const f = ZsFunction.create()
    const f2 = f.returns(z.string())
    expect(f2).toBeInstanceOf(ZsFunction)
    expectt(f2).to
}
