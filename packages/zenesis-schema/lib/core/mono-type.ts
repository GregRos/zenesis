import { ParseInput, ParseReturnType, ZodType, ZodTypeDef } from "zod"

export type ZsMonoLike<Type> = ZodType<Type, any, Type>

export abstract class ZsMonoType<
    Monotype = any,
    Def extends ZodTypeDef = ZodTypeDef
> extends ZodType<Monotype, Def> {
    constructor(def: Def) {
        super(def)
    }

    abstract readonly actsLike: ZsMonoLike<Monotype>

    _parse(input: ParseInput): ParseReturnType<Monotype> {
        return this.actsLike._parse(input)
    }
}
