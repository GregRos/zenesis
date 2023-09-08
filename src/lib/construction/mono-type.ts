import {
    ParseInput,
    ParseReturnType,
    undefined,
    ZodType,
    ZodTypeDef
} from "zod";

export type ZsMonoLike<Type> = ZodType<Type, any, Type>;

export abstract class ZsMonoType<
    Monotype,
    Def extends ZodTypeDef
> extends ZodType<Monotype, Def> {
    abstract readonly actsLike: ZsMonoLike<Monotype>;

    _parse(input: ParseInput): ParseReturnType<Monotype> {
        return this.actsLike._parse(input);
    }
}
