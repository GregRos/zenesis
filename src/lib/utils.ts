import { objectOutputType, ZodRawShape, ZodTypeAny } from "zod";
import { ArrayMembersToOverloads } from "./expressions/overloads";

export type SchemaSubtypeOf<Sub extends ZodTypeAny> = ZodTypeAny & {
    readonly _input: Sub["_input"];
};

export type SchemaSupertypeOf<Sup extends ZodTypeAny> = ZodTypeAny & {
    readonly _output: Sup["_output"];
};
export type RecursiveConjunction<Types extends ZodTypeAny[]> = Types extends [
    infer Head,
    ...infer Tail
]
    ? Head extends ZodTypeAny
        ? Tail extends ZodTypeAny[]
            ? Head & RecursiveConjunction<Tail>
            : never
        : never
    : never;
export type combineClassShape<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> = InheritedShape & RequiresShape & OwnShape;

export type getCombinedType<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> = objectOutputType<
    combineClassShape<InheritedShape, RequiresShape, OwnShape>,
    ZodTypeAny
>;
