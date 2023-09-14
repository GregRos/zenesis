import { objectOutputType, z, ZodRawShape, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsShapedRef, ZsTypedInterfaceRef } from "../refs";
import {
    arraysToOverloads,
    unpackMemberSchemas,
    ZsShape
} from "../expressions/overloads";
import { combineClassShape, getCombinedType } from "../utils";
import { fun } from "../expressions/function";
import { ZsGenericType } from "../generic/generic-type";
import { ZsMember } from "./member";

export interface ZsInterfaceDef<
    Name extends string,
    OwnShape extends ZsShape<"public">,
    InheritedShape extends ZsShape<"public">
> extends ZodTypeDef {
    name: Name;
    typeName: "ZsInterface";
    ownShape: () => OwnShape;
    inheritedShape: () => InheritedShape;
    extends: ZsShapedRef[];
}

export class ZsInterface<
        Name extends string,
        OwnShape extends ZsShape<"public">,
        InheritedShape extends ZsShape<"public">
    >
    extends ZsMonoType<
        getCombinedType<OwnShape, InheritedShape>,
        ZsInterfaceDef<Name, OwnShape, InheritedShape>
    >
    implements
        ZsTypedInterfaceRef<Name, getCombinedType<OwnShape, InheritedShape>>
{
    readonly declaration = "interface";
    readonly name = this._def.name;

    readonly actsLike = z.lazy(() =>
        z.object(unpackMemberSchemas(this.shape))
    ) as ZsMonoLike<getCombinedType<OwnShape, InheritedShape>>;

    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.ownShape()
        };
    }

    parent<const Shape1 extends ZsShape>(other: ZsShapedRef<Shape1>) {
        return new ZsInterface({
            ...this._def,
            inheritedShape: () => ({
                ...this._def.inheritedShape(),
                ...other.shape
            }),
            extends: [...this._def.extends, other]
        });
    }

    body<const Shape2 extends ZsShape<"public">>(other: Shape2) {
        return new ZsInterface({
            ...this._def,
            ownShape: () =>
                ({
                    ...this._def.ownShape(),
                    ...other
                }) as Shape2 & OwnShape
        });
    }

    static create<Name extends string>(name: Name): ZsEmptyInterface<Name> {
        return new ZsInterface({
            name,
            typeName: "ZsInterface",
            ownShape: () => ({}),
            inheritedShape: () => ({}),
            extends: []
        });
    }
}

export type ZsEmptyInterface<Name extends string> = ZsInterface<Name, {}, {}>;
