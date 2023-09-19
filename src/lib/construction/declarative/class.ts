import {
    objectOutputType,
    objectUtil,
    z,
    ZodRawShape,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsShapedRef, ZsShapedClassRef, ZsTypedClassRef } from "../refs";
import { combineClassShape, getCombinedType } from "../utils";
import { unpackMemberSchemas, ZsShape } from "../expressions/overloads";
import { ZsTypeKind } from "../kind";

export interface ZsClassDef<
    Name extends string,
    InheritedShape extends ZsShape,
    RequiresShape extends ZsShape,
    OwnShape extends ZsShape,
    StaticShape extends ZsShape
> extends ZodTypeDef {
    name: Name;
    typeName: ZsTypeKind.Class;
    inheritedShape: () => InheritedShape;
    requiredShape: () => RequiresShape;
    ownShape: () => OwnShape;
    staticShape: () => StaticShape;
    parent: ZsShapedRef<ZsShape, "class"> | null;
    implements: ZsShapedRef[];
    abstract: boolean;
}

export class ZsClass<
        Name extends string,
        OwnShape extends ZsShape,
        InheritedShape extends ZsShape,
        RequiresShape extends ZsShape,
        StaticShape extends ZsShape
    >
    extends ZsMonoType<
        getCombinedType<OwnShape, InheritedShape, RequiresShape>,
        ZsClassDef<Name, InheritedShape, RequiresShape, OwnShape, StaticShape>
    >
    implements
        ZsShapedClassRef<
            combineClassShape<OwnShape, InheritedShape, RequiresShape>
        >,
        ZsTypedClassRef<
            Name,
            getCombinedType<OwnShape, InheritedShape, RequiresShape>
        >
{
    readonly name = this._def.name;
    readonly declaration = "class";
    readonly actsLike = z.lazy(() => z.object(unpackMemberSchemas(this.shape)));

    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.requiredShape(),
            ...this._def.ownShape()
        };
    }

    implements<InterfaceShape extends ZodRawShape>(
        iface: ZsShapedRef<InterfaceShape>
    ) {
        return new ZsClass({
            ...this._def,
            requiredShape: () => ({
                ...this._def.requiredShape(),
                ...iface.shape
            }),
            implements: [...this._def.implements, iface]
        });
    }

    setParent<ParentShape2 extends ZsShape>(
        parent: ZsShapedRef<ParentShape2, "class">
    ) {
        return new ZsClass({
            ...this._def,
            inheritedShape: () => parent.shape as ParentShape2,
            parent
        });
    }

    instance<Shape2 extends ZodRawShape>(other: Shape2) {
        return new ZsClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other
            })
        });
    }

    static<Shape2 extends ZsShape>(other: Shape2) {
        return new ZsClass({
            ...this._def,
            staticShape: () => ({
                ...this._def.staticShape(),
                ...other
            })
        });
    }

    abstract(yes = true) {
        return new ZsClass({
            ...this._def,
            abstract: yes
        });
    }

    static create<Name extends string>(name: Name): ZsEmptyClass<Name> {
        return new ZsClass({
            name,
            typeName: ZsTypeKind.Class,
            inheritedShape: () => ({}),
            requiredShape: () => ({}),
            ownShape: () => ({}),
            staticShape: () => ({}),
            parent: null,
            implements: [],
            abstract: false
        });
    }
}

export type ZsEmptyClass<Name extends string> = ZsClass<Name, {}, {}, {}, {}>;
