import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { Access, RecursiveConjunction } from "../utils";
import { ZsMember, ZsMemberAny } from "../declarative/member";
import { ZsTypeKind } from "../kinds";

export interface ZsOverloadsDef<
    Overloads extends readonly [ZodTypeAny, ...ZodTypeAny[]]
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsOverloads;
    overloads: Overloads;
}

export class ZsOverloads<
    Overloads extends readonly [ZodTypeAny, ...ZodTypeAny[]]
> extends ZsMonoType<
    RecursiveConjunction<Overloads>,
    ZsOverloadsDef<Overloads>
> {
    readonly actsLike: ZsMonoLike<RecursiveConjunction<Overloads>>;

    constructor(readonly _def: ZsOverloadsDef<Overloads>) {
        super(_def);
        this.actsLike = _def.overloads.reduce((a, b) => a.and(b)) as any;
    }

    add<NewOverload extends ZodTypeAny>(overload: NewOverload) {
        return new ZsOverloads<[...Overloads, NewOverload]>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads: [...this._def.overloads, overload]
        });
    }

    static create<Overloads extends [ZodTypeAny, ...ZodTypeAny[]]>(
        overloads: Overloads
    ) {
        return new ZsOverloads<Overloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads
        });
    }
}

export type ZsShape<A extends Access = any> = {
    [key: string]: ZodTypeAny | ZsMemberAny<A>;
};

export type UnpackMemberSchemas<Shape extends ZsShape> = {
    [Key in keyof Shape]: Shape[Key] extends ZodTypeAny
        ? Shape[Key]
        : Shape[Key] extends ZsMemberAny
        ? Shape[Key]["actsLike"]
        : never;
};

export function unpackMemberSchemas<Shape extends ZsShape>(
    shape: Shape
): UnpackMemberSchemas<Shape> {
    const newShape = {} as any;
    for (const [key, value] of Object.entries(shape)) {
        if (value instanceof ZsMember) {
            newShape[key] = value.actsLike;
        } else {
            newShape[key] = value;
        }
    }
    return newShape;
}

export function arraysToOverloads<const Shape extends ZsShape>(
    shape: Shape
): UnpackMemberSchemas<Shape> {
    const newShape = {} as any;
    for (const [key, value] of Object.entries(shape)) {
        if (Array.isArray(value)) {
            const [first, ...rest] = value;
            if (!first) {
                throw new Error("Empty array in overload");
            }
            newShape[key] = ZsOverloads.create([first, ...rest]);
        } else {
            newShape[key] = value;
        }
    }
    return newShape;
}
