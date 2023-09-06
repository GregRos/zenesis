import { objectUtil, z, ZodRawShape, ZodTypeDef } from "zod";
import {
    ZodiDeclaredObjectLike,
    ZodiDeclaredShaped,
    ZodiShaped
} from "./general";
import { $typeVar } from "../declarative/type-var";

export type combineClassShape<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> = InheritedShape & RequiresShape & OwnShape;

export interface ZodiClassDef<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZodiClass";
    inheritedShape: () => InheritedShape;
    requiredShape: () => RequiresShape;
    ownShape: () => OwnShape;
    parent: ZodiDeclaredShaped<ZodRawShape, "class"> | null;
    implements: ZodiDeclaredShaped[];
    abstract: boolean;
}

export const zodiObjectType = z.object({});

export class ZodiClass<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodiDeclaredObjectLike<
    combineClassShape<InheritedShape, RequiresShape, OwnShape>,
    ZodiClassDef<InheritedShape, RequiresShape, OwnShape>
> {
    readonly declaration = "class";

    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.requiredShape(),
            ...this._def.ownShape()
        };
    }

    implements<InterfaceShape extends ZodRawShape>(
        iface: ZodiDeclaredShaped<InterfaceShape>
    ): ZodiClass<InheritedShape, InterfaceShape & RequiresShape, OwnShape> {
        return new ZodiClass<
            InheritedShape,
            InterfaceShape & RequiresShape,
            OwnShape
        >({
            ...this._def,
            requiredShape: () =>
                objectUtil.mergeShapes(this._def.requiredShape(), iface.shape),
            implements: [...this._def.implements, iface]
        });
    }

    setParent<ParentShape2 extends ZodRawShape>(
        parent: ZodiDeclaredShaped<ParentShape2, "class">
    ) {
        return new ZodiClass<ParentShape2, RequiresShape, OwnShape>({
            ...this._def,
            inheritedShape: () => parent.shape as ParentShape2,
            parent
        });
    }

    extend<Shape2 extends ZodRawShape>(other: Shape2) {
        return new ZodiClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other
            })
        });
    }

    merge<Shape2 extends ZodRawShape>(other: ZodiShaped<Shape2>) {
        return new ZodiClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other.shape
            })
        });
    }

    abstract(yes = true) {
        return new ZodiClass<InheritedShape, RequiresShape, OwnShape>({
            ...this._def,
            abstract: yes
        });
    }

    constructor(def: ZodiClassDef<InheritedShape, RequiresShape, OwnShape>) {
        super(def);
    }

    static create(name: string) {
        return new ZodiClass({
            name,
            typeName: "ZodiClass",
            inheritedShape: () => ({}),
            requiredShape: () => ({}),
            ownShape: () => ({}),
            parent: null,
            implements: [],
            abstract: false
        });
    }
}

export const $class = ZodiClass.create;

const b = $class("Example1")
    .extend({
        a: z.string(),
        b: z.number()
    })
    .typeVars($typeVar("X"))
    .instantiate(z.string());
const a = $class("Hello").setParent(b);
