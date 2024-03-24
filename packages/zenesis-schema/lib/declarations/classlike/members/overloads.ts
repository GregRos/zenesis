import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../../../core/mono-type"
import { ZsTypeKind } from "../../../core/type-kind"
import { ZsFunction } from "../../../expressions/function"

export interface ZsOverloadsDef<ZOverloads extends ZsFunction>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsOverloads
    overloads: ZOverloads[]
}
export type UnionToIntersection<U> = (
    U extends any ? (x: U) => void : never
) extends (x: infer I) => void
    ? I
    : never
export class ZsOverloads<
    ZOverloads extends ZsFunction = ZsFunction
> extends ZsMonoType<
    UnionToIntersection<TypeOf<ZOverloads>>,
    ZsOverloadsDef<ZOverloads>
> {
    readonly actsLike: ZsMonoLike<UnionToIntersection<TypeOf<ZOverloads>>>

    constructor(readonly _def: ZsOverloadsDef<ZOverloads>) {
        super(_def)
        const arr = _def.overloads
        this.actsLike =
            arr.length === 1
                ? arr[0]
                : (arr.reduce((a, b) => a.and(b) as any) as any)
    }

    static create<ZOverloads extends ZsFunction>(
        overloads: () => Iterable<ZOverloads>
    ) {
        return new ZsOverloads<ZOverloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads: [...overloads()]
        })
    }
}
