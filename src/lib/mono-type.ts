import { ZodType, ZodTypeDef } from "zod";

export type ZodiMonoType<Monotype, Def extends ZodTypeDef> = ZodType<
    Monotype,
    Def
>;

export const ZodiMonoType = function ZodiMonoType<
    Monotype,
    Def extends ZodTypeDef
>(this: ZodiMonoType<Monotype, Def>, def: Def): ZodiMonoType<Monotype, Def> {
    return this;
} as any as {
    new <Monotype, Def extends ZodTypeDef>(
        def: Def
    ): ZodiMonoType<Monotype, Def>;
};

ZodiMonoType.prototype = ZodType.prototype;
