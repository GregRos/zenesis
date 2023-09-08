import {
    objectOutputType,
    objectUtil,
    z,
    ZodRawShape,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsDeclaredShape, ZsShaped } from "./general";
import { $typeVar } from "../declarative/type-var";
import { ZsMonoLike, ZsMonoType } from "../mono-type";

export type combineClassShape<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> = InheritedShape & RequiresShape & OwnShape;

export interface ZsClassDef<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZodTypeDef {
    name: string;
    typeName: "ZsClass";
    inheritedShape: () => InheritedShape;
    requiredShape: () => RequiresShape;
    ownShape: () => OwnShape;
    parent: ZsDeclaredShape<ZodRawShape, "class"> | null;
    implements: ZsDeclaredShape[];
    abstract: boolean;
}

export class ZsClass<
    InheritedShape extends ZodRawShape,
    RequiresShape extends ZodRawShape,
    OwnShape extends ZodRawShape
> extends ZsMonoType<
    objectOutputType<
        combineClassShape<InheritedShape, RequiresShape, OwnShape>,
        ZodTypeAny
    >,
    ZsClassDef<InheritedShape, RequiresShape, OwnShape>
> {
    readonly declaration = "class";
    readonly actsLike = z.lazy(() => z.object(this.shape)) as ZsMonoLike<
        objectOutputType<
            combineClassShape<InheritedShape, RequiresShape, OwnShape>,
            ZodTypeAny
        >
    >;
    get shape() {
        return {
            ...this._def.inheritedShape(),
            ...this._def.requiredShape(),
            ...this._def.ownShape()
        };
    }

    implements<InterfaceShape extends ZodRawShape>(
        iface: ZsDeclaredShape<InterfaceShape>
    ): ZsClass<InheritedShape, InterfaceShape & RequiresShape, OwnShape> {
        return new ZsClass<
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
        parent: ZsDeclaredShape<ParentShape2, "class">
    ) {
        return new ZsClass<ParentShape2, RequiresShape, OwnShape>({
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

    merge<Shape2 extends ZodRawShape>(other: ZsShaped<Shape2>) {
        return new ZsClass({
            ...this._def,
            ownShape: () => ({
                ...this._def.ownShape(),
                ...other.shape
            })
        });
    }

    abstract(yes = true) {
        return new ZsClass<InheritedShape, RequiresShape, OwnShape>({
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

export const $class = ZsClass.create;

const b = $class("Example1")
    .extend({
        a: z.string(),
        b: z.number()
    })
    .typeVars($typeVar("X"))
    .instantiate(z.string());
const a = $class("Hello").setParent(b);
