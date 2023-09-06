import { ZodRawShape, ZodTypeDef } from "zod";
import {
    ZodiDeclaredObjectLike,
    ZodiDeclaredShaped,
    ZodiShaped
} from "./general";

export interface ZodiInterfaceDef<
    InheritedShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZodiInterface";
    ownShape: () => OwnShape;
    inheritedShape: () => InheritedShape;
    extends: ZodiDeclaredShaped[];
}

export class ZodiInterface<
    InheritedShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodiDeclaredObjectLike<
    OwnShape & InheritedShape,
    ZodiInterfaceDef<InheritedShape, OwnShape>
> {
    readonly declaration = "interface";

    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.ownShape()
        };
    }

    constructor(def: ZodiInterfaceDef<InheritedShape, OwnShape>) {
        super(def);
    }

    parent<Shape1 extends ZodRawShape>(
        other: ZodiDeclaredShaped<Shape1>
    ): ZodiInterface<Shape1 & InheritedShape, OwnShape> {
        return new ZodiInterface({
            ...this._def,
            inheritedShape: () => ({
                ...this._def.inheritedShape(),
                ...other.shape
            }),
            extends: [...this._def.extends, other]
        });
    }

    extend<Shape2 extends ZodRawShape>(other: Shape2) {
        return new ZodiInterface({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other
            })
        });
    }

    merge<Shape2 extends ZodRawShape>(other: ZodiShaped<Shape2>) {
        return new ZodiInterface({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other.shape
            })
        });
    }

    static create(name: string): ZodiInterface<object, object> {
        return new ZodiInterface({
            name,
            typeName: "ZodiInterface",
            ownShape: () => ({}),
            inheritedShape: () => ({}),
            extends: []
        });
    }
}

export const $interface = ZodiInterface.create;
