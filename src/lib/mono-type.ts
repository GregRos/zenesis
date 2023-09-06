import { ZodType, ZodTypeDef } from "zod";

export type ZsMonoType<Monotype, Def extends ZodTypeDef> = ZodType<
    Monotype,
    Def
>;

export const ZsMonoType = function ZsMonoType<Monotype, Def extends ZodTypeDef>(
    this: ZsMonoType<Monotype, Def>,
    def: Def
): ZsMonoType<Monotype, Def> {
    return this;
} as any as {
    new <Monotype, Def extends ZodTypeDef>(def: Def): ZsMonoType<Monotype, Def>;
};

ZsMonoType.prototype = ZodType.prototype;
