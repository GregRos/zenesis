import { ZsMonoLike } from "./mono-type";
import { ZsShape } from "./expressions/overloads";
import { getTypeFromShape } from "./utils";
import { ZodTypeAny } from "zod";

export type getDeclarationType<Ref> = Ref extends {
    declaration: infer Type;
}
    ? Type
    : undefined;

export type ZsDeclaredType<Name extends string = string, Monotype = any> =
    | ZsTypedClassRef<Name, Monotype>
    | ZsTypedInterfaceRef<Name, Monotype>
    | ZsTypeAliasRef<Name, Monotype>;

export interface ZsTypedClassRef<Name extends string, Type>
    extends ZsMonoLike<Type> {
    readonly name: Name;
    readonly declaration: "class";
}

export type ZsShapedRef<
    Shape extends ZsShape = ZsShape,
    Kind extends "class" | "interface" = "class" | "interface"
> = {
    readonly shape: Shape;
    readonly declaration: Kind;
};

export interface ZsTypeAliasRef<Name extends string, Type>
    extends ZsMonoLike<Type> {
    readonly declaration: "alias";
    readonly name: Name;
}

export interface ZsTypedInterfaceRef<Name extends string, Monotype>
    extends ZsMonoLike<Monotype> {
    readonly declaration: "interface";
    readonly name: Name;
}
