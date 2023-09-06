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
import { ZsMonoType } from "../mono-type";
import { ZsTypeVars } from "./type-var";
import { ZsGeneric } from "./generic-type";

export type DeclaredTypeKind = "class" | "interface" | "typeAlias" | "typeVar";
export type DeclaredObjectKind = Exclude<DeclaredTypeKind, "typeAlias">;
export type ZsDeclaredDef = ZodTypeDef & { name: string };

export abstract class ZsDeclaredType<
    Monotype,
    Def extends ZsDeclaredDef
> extends ZsMonoType<Monotype, Def> {
    get name() {
        return this._def.name;
    }

    abstract readonly declaration: DeclaredTypeKind;

    typeVars<TypeVars extends ZsTypeVars>(
        ...typeVars: TypeVars
    ): ZsGeneric<TypeVars, this> {
        return new ZsGeneric({
            typeVars,
            instance: this
        });
    }
}

export abstract class ZsObjectLike<
    Shape extends ZodRawShape,
    Def extends ZsDeclaredDef = ZsDeclaredDef
> extends ZsDeclaredType<objectOutputType<Shape, ZodTypeAny>, Def> {
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

export type ZsShaped<Shape extends ZodRawShape> = {
    readonly shape: Shape;
};

export type ZsDeclaredShape<
    Shape extends ZodRawShape = ZodRawShape,
    Kind extends DeclaredObjectKind = DeclaredObjectKind
> = { readonly declaration: Kind; readonly shape: Shape };
