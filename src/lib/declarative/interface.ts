import { objectOutputType, z, ZodRawShape, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsDeclaredShape, ZsShaped } from "./general";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsInterfaceRef, ZsShapedRef } from "../refs";
import { arraysToOverloads, ZsShape } from "../expressions/overloads";
import { combineClassShape, getCombinedType } from "../utils";

export interface ZsInterfaceDef<
    OwnShape extends ZsShape,
    InheritedShape extends ZsShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZsInterface";
    ownShape: () => OwnShape;
    inheritedShape: () => InheritedShape;
    extends: ZsDeclaredShape[];
}

export class ZsInterface<
        const OwnShape extends ZsShape,
        const InheritedShape extends ZsShape
    >
    extends ZsMonoType<
        getCombinedType<OwnShape, InheritedShape>,
        ZsInterfaceDef<OwnShape, InheritedShape>
    >
    implements ZsInterfaceRef<getCombinedType<OwnShape, InheritedShape>>
{
    readonly declaration = "interface";

    readonly actsLike = z.object(arraysToOverloads(this.shape));
    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.ownShape()
        };
    }

    parent<const Shape1 extends ZsShape>(
        other: ZsShapedRef<Shape1>
    ): ZsInterface<OwnShape, Shape1 & InheritedShape> {
        return new ZsInterface({
            ...this._def,
            inheritedShape: () => ({
                ...this._def.inheritedShape(),
                ...other.shape
            }),
            extends: [...this._def.extends, other]
        });
    }

    extend<const Shape2 extends ZsShape>(other: Shape2) {
        return new ZsInterface({
            ...this._def,
            ownShape: () =>
                ({
                    ...this._def.ownShape(),
                    ...other
                }) as Shape2 & OwnShape
        });
    }

    merge<const Shape2 extends ZsShape>(other: ZsShapedRef<Shape2>) {
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

const otest = ZsInterface.create("test")
    .extend({
        b: z.string(),
        a: [
            z.function(z.tuple([z.string()]), z.string()),
            z.function(z.tuple([z.number()]), z.number())
        ]
    })
    .parse();
