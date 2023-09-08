import {
    objectOutputType,
    objectUtil,
    z,
    ZodRawShape,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsShapedRef, ZsShapedClassRef } from "../refs";
import { combineClassShape, getCombinedType } from "../utils";
import { arraysToOverloads, ZsShape } from "../expressions/overloads";

export interface ZsClassDef<
    InheritedShape extends ZsShape,
    RequiresShape extends ZsShape,
    OwnShape extends ZsShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZsClass";
    inheritedShape: () => InheritedShape;
    requiredShape: () => RequiresShape;
    ownShape: () => OwnShape;
    parent: ZsShapedRef<ZodRawShape, "class"> | null;
    implements: ZsShapedRef[];
    abstract: boolean;
}

export class ZsClass<
        OwnShape extends ZsShape,
        InheritedShape extends ZsShape,
        RequiresShape extends ZsShape
    >
    extends ZsMonoType<
        getCombinedType<OwnShape, InheritedShape, RequiresShape>,
        ZsClassDef<InheritedShape, RequiresShape, OwnShape>
    >
    implements
        ZsShapedClassRef<
            combineClassShape<OwnShape, InheritedShape, RequiresShape>
        >
{
    readonly declaration = "class";
    readonly actsLike = z.lazy(() =>
        z.object(arraysToOverloads(this.shape))
    ) as any;
    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.requiredShape(),
            ...this._def.ownShape()
        };
    }

    implements<InterfaceShape extends ZodRawShape>(
        iface: ZsShapedRef<InterfaceShape>
    ): ZsClass<OwnShape, InheritedShape, InterfaceShape & RequiresShape> {
        return new ZsClass<
            OwnShape,
            InheritedShape,
            InterfaceShape & RequiresShape
        >({
            ...this._def,
            requiredShape: () =>
                objectUtil.mergeShapes(this._def.requiredShape(), iface.shape),
            implements: [...this._def.implements, iface]
        });
    }

    setParent<ParentShape2 extends ZodRawShape>(
        parent: ZsShapedRef<ParentShape2, "class">
    ) {
        return new ZsClass<OwnShape, ParentShape2, RequiresShape>({
            ...this._def,
            inheritedShape: () => parent.shape as ParentShape2,
            parent
        });
    }

    extend<Shape2 extends ZodRawShape>(other: Shape2) {
        return new ZsClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other
            })
        });
    }

    merge<Shape2 extends ZodRawShape>(other: ZsShapedRef<Shape2>) {
        return new ZsClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other.shape
            })
        });
    }

    abstract(yes = true) {
        return new ZsClass<OwnShape, InheritedShape, RequiresShape>({
            ...this._def,
            abstract: yes
        });
    }

    static create(name: string) {
        return new ZsClass({
            name,
            typeName: "ZsClass",
            inheritedShape: () => ({}),
            requiredShape: () => ({}),
            ownShape: () => ({}),
            parent: null,
            implements: [],
            abstract: false
        });
    }
}
