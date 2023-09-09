import { objectOutputType, TypeOf, ZodRawShape, ZodTypeAny } from "zod";
import { UnpackMemberSchemas, ZsShape } from "./expressions/overloads";
import { baseObjectOutputType } from "zod/lib/types";

export type SchemaSubtypeOf<Sub extends ZodTypeAny> = ZodTypeAny & {
    readonly _input: Sub["_input"];
};

export type ZsFunctionTypeAny = ZodTypeAny & {
    readonly _type: (...args: any[]) => any;
};

export type SchemaSupertypeOf<Sup extends ZodTypeAny> = ZodTypeAny & {
    readonly _output: Sup["_output"];
};
export type RecursiveConjunction<
    Types extends readonly [ZodTypeAny, ...ZodTypeAny[]]
> = Types extends readonly [infer Head, ...infer Tail]
    ? Head extends ZodTypeAny
        ? Tail extends readonly [ZodTypeAny, ...ZodTypeAny[]]
            ? TypeOf<Head> & RecursiveConjunction<Tail>
            : TypeOf<Head>
        : never
    : never;
export type combineClassShape<
    OwnShape extends ZsShape,
    InheritedShape extends ZsShape,
    RequiredShape extends ZsShape
> = InheritedShape & RequiredShape & OwnShape;

export type getTypeFromShape<Shape extends ZsShape> = baseObjectOutputType<
    UnpackMemberSchemas<Shape>
>;

export type getCombinedType<
    OwnShape extends ZsShape = {},
    InheritedShape extends ZsShape = {},
    RequiredShape extends ZsShape = {}
> = getTypeFromShape<
    combineClassShape<OwnShape, InheritedShape, RequiredShape>
>;

export type Access = "public" | "protected" | "private";
