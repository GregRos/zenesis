import { TypeOf, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../../../core/kinds"
import { ZsMonoLike, ZsMonoType } from "../../../core/mono-type"
import { ZsFunctionLike } from "../../../utils/unions"

export interface ZsOverloadsDef<ZOverloads extends ZsFunctionLike>
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
    ZOverloads extends ZsFunctionLike = ZsFunctionLike
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

    static create<ZOverloads extends ZsFunctionLike>(
        overloads: () => Iterable<ZOverloads>
    ) {
        return new ZsOverloads<ZOverloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads: [...overloads()]
        })
    }
}
