import { objectOutputType, z, ZodRawShape, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsShapedRef, ZsInterfaceRef } from "../refs";
import { arraysToOverloads, ZsShape } from "../expressions/overloads";
import { combineClassShape, getCombinedType } from "../utils";
import { fun } from "../expressions/function";
import { Generic } from "./generic/generic-type";

export interface ZsInterfaceDef<
    OwnShape extends ZsShape,
    InheritedShape extends ZsShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZsInterface";
    ownShape: () => OwnShape;
    inheritedShape: () => InheritedShape;
    extends: ZsShapedRef[];
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

    readonly actsLike = z.object(arraysToOverloads(this.shape)) as ZsMonoLike<
        getCombinedType<OwnShape, InheritedShape>
    >;
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
            fun(z.string()).returns(z.string()),
            Generic.create("A").function(vars =>
                fun(vars.A, z.string()).returns(z.number())
            )
        ]
    })
    .parse(null!);
