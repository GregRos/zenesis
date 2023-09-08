import { ZsMonoLike } from "./mono-type";
import { ZsShape } from "./expressions/overloads";
import { getTypeFromShape } from "./utils";

export type ZsDeclaredType<Monotype> =
    | ZsTypedClassRef<Monotype>
    | ZsInterfaceRef<Monotype>
    | ZsTypeAliasRef<Monotype>;

export interface ZsTypedClassRef<Type> extends ZsMonoLike<Type> {
    readonly declaration: "class";
}

export type ZsShapedRef<
    Shape extends ZsShape = ZsShape,
    Kind extends "class" | "interface" = "class" | "interface"
> = {
    readonly shape: Shape;
    readonly declaration: Kind;
};

export interface ZsShapedClassRef<Shape extends ZsShape>
    extends ZsMonoLike<getTypeFromShape<Shape>> {
    readonly shape: Shape;
    readonly declaration: "class";
}

export interface ZsShapedInterfaceRef<Shape extends ZsShape>
    extends ZsMonoLike<getTypeFromShape<Shape>> {
    readonly declaration: "interface";
    readonly shape: Shape;
}

export interface ZsTypeAliasRef<Type> extends ZsMonoLike<Type> {
    readonly declaration: "typeAlias";
}

export interface ZsInterfaceRef<Monotype> extends ZsMonoLike<Monotype> {
    readonly declaration: "interface";
}

export interface ZsTypedValueRef<Type> {
    readonly declaration: "value";
    readonly annotation: ZsMonoLike<Type>;
}
