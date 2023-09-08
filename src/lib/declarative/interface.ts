import { objectOutputType, z, ZodRawShape, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsDeclaredShape, ZsShaped } from "./general";
import { ZsMonoLike, ZsMonoType } from "../mono-type";

export interface ZsInterfaceDef<
    InheritedShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZsInterface";
    ownShape: () => OwnShape;
    inheritedShape: () => InheritedShape;
    extends: ZsDeclaredShape[];
}

export class ZsInterface<
    InheritedShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZsMonoType<
    objectOutputType<OwnShape & InheritedShape, ZodTypeAny>,
    ZsInterfaceDef<InheritedShape, OwnShape>
> {
    readonly declaration = "interface";

    readonly actsLike = z.lazy(() => z.object(this.shape)) as ZsMonoLike<
        objectOutputType<OwnShape & InheritedShape, ZodTypeAny>
    >;
    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.ownShape()
        };
    }

    parent<Shape1 extends ZodRawShape>(
        other: ZsDeclaredShape<Shape1>
    ): ZsInterface<Shape1 & InheritedShape, OwnShape> {
        return new ZsInterface({
            ...this._def,
            inheritedShape: () => ({
                ...this._def.inheritedShape(),
                ...other.shape
            }),
            extends: [...this._def.extends, other]
        });
    }

    extend<Shape2 extends ZodRawShape>(other: Shape2) {
        return new ZsInterface({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other
            })
        });
    }

    merge<Shape2 extends ZodRawShape>(other: ZsShaped<Shape2>) {
        return new ZsInterface({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other.shape
            })
        });
    }

    static create(name: string): ZsInterface<{}, {}> {
        return new ZsInterface({
            name,
            typeName: "ZsInterface",
            ownShape: () => ({}),
            inheritedShape: () => ({}),
            extends: []
        });
    }
}

export const $interface = ZsInterface.create;
