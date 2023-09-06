import { ZodTypeAny } from "zod";

export type SchemaSubtypeOf<Sub extends ZodTypeAny> = ZodTypeAny & {
    readonly _input: Sub["_input"];
};

export type SchemaSupertypeOf<Sup extends ZodTypeAny> = ZodTypeAny & {
    readonly _output: Sup["_output"];
};
