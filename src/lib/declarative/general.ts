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
import { ZodiMonoType } from "../mono-type";
import { ZodiTypeVars } from "./type-var";
import { ZodiGenericType } from "./generic-type";

export type DeclaredTypeKind = "class" | "interface" | "typeAlias" | "typeVar";
export type DeclaredObjectKind = Exclude<DeclaredTypeKind, "typeAlias">;
export type ZodiDeclaredDef = ZodTypeDef & { name: string };

export abstract class ZodiDeclaredMonoType<
    Monotype,
    Def extends ZodiDeclaredDef
> extends ZodiMonoType<Monotype, Def> {
    get name() {
        return this._def.name;
    }

    abstract readonly declaration: DeclaredTypeKind;

    typeVars<TypeVars extends ZodiTypeVars>(
        ...typeVars: TypeVars
    ): ZodiGenericType<TypeVars, this> {
        return new ZodiGenericType({
            typeVars,
            instance: this
        });
    }
}

export abstract class ZodiDeclaredObjectLike<
    Shape extends ZodRawShape,
    Def extends ZodiDeclaredDef = ZodiDeclaredDef
> extends ZodiDeclaredMonoType<objectOutputType<Shape, ZodTypeAny>, Def> {
    private _object: ZodLazy<ZodObject<Shape, "strip">>;

    abstract get shape(): Shape;

    constructor(def: Def) {
        super(def);
        this._object = z.lazy(() => z.object(this.shape));
    }

    _parse(
        input: ParseInput
    ): ParseReturnType<objectOutputType<Shape, ZodTypeAny>> {
        return this._object._parse(input);
    }
}

export type ZodiShaped<Shape extends ZodRawShape> = {
    readonly shape: Shape;
};

export type ZodiDeclaredShaped<
    Shape extends ZodRawShape = ZodRawShape,
    Kind extends DeclaredObjectKind = DeclaredObjectKind
> = { readonly declaration: Kind; readonly shape: Shape };
