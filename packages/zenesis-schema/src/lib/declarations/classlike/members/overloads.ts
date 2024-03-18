import { seq } from "lazies"
import { ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../../../core/mono-type"
import { RecursiveConjunction } from "../../../core/operators"
import { ZsFunction } from "../../../expressions/function"
import { ZsTypeKind } from "../../../kinds"

export interface ZsOverloadsDef<
    Overloads extends readonly [ZsFunction, ...ZsFunction[]]
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsOverloads
    overloads: Overloads
}

export class ZsOverloads<
    ZOverloads extends readonly [ZsFunction, ...ZsFunction[]] = readonly [
        ZsFunction,
        ...ZsFunction[]
    ]
> extends ZsMonoType<
    RecursiveConjunction<ZOverloads>,
    ZsOverloadsDef<ZOverloads>
> {
    readonly actsLike: ZsMonoLike<RecursiveConjunction<ZOverloads>>

    constructor(readonly _def: ZsOverloadsDef<ZOverloads>) {
        super(_def)
        this.actsLike = seq(_def.overloads)
            .as<ZodTypeAny>()
            .reduce((a: ZodTypeAny, b: ZodTypeAny) => a.and(b)) as any
    }

    add<NewOverload extends ZsFunction>(overload: NewOverload) {
        return new ZsOverloads<[...ZOverloads, NewOverload]>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads: [...this._def.overloads, overload]
        })
    }

    static create<Overloads extends [ZsFunction, ...ZsFunction[]]>(
        ...overloads: Overloads
    ) {
        return new ZsOverloads<Overloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads
        })
    }
}
