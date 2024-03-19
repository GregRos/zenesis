import { seq } from "lazies"
import { ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../../../core/mono-type"
import { RecursiveConjunction } from "../../../core/operators"
import { ZsTypeKind } from "../../../kinds"
import { ZsFunctionLike } from "../../unions"

export interface ZsOverloadsDef<
    Overloads extends readonly [ZsFunctionLike, ...ZsFunctionLike[]]
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsOverloads
    overloads: Overloads
}

export class ZsOverloads<
    ZOverloads extends readonly [
        ZsFunctionLike,
        ...ZsFunctionLike[]
    ] = readonly [ZsFunctionLike, ...ZsFunctionLike[]]
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

    static create<Overloads extends [ZsFunctionLike, ...ZsFunctionLike[]]>(
        ...overloads: Overloads
    ) {
        return new ZsOverloads<Overloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads
        })
    }
}
