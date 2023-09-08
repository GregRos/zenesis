import {
    objectOutputType,
    ParseInput,
    ParseReturnType,
    z,
    ZodLazy,
    ZodObject,
    ZodRawShape,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeAlias } from "./alias";
import { ZsClass } from "./class";

export type DeclaredTypeKind =
    | "class"
    | "interface"
    | "typeAlias"
    | "typeVar"
    | "mapVar";
export type DeclaredObjectKind = Exclude<DeclaredTypeKind, "typeAlias">;
export type ZsDeclaredDef = ZodTypeDef & { name: string };

export type ZsDeclaration<Monotype> = ZsMonoLike<Monotype> & {
    readonly declaration: DeclaredTypeKind;
};

export type ZsShaped<Shape extends ZodRawShape> = {
    readonly shape: Shape;
};

export type ZsDeclaredShape<
    Shape extends ZodRawShape = ZodRawShape,
    Kind extends DeclaredObjectKind = DeclaredObjectKind
> = { readonly declaration: Kind; readonly shape: Shape };
