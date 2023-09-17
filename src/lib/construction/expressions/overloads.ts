import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { RecursiveConjunction } from "../utils";
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
        ...overloads: Overloads
    ) {
        return new ZsOverloads<Overloads>({
            typeName: ZsTypeKind.ZsOverloads,
            overloads
        });
    }
}

export type ZsShape = {
    [key: string]: ZodTypeAny;
};

export type UnpackMemberSchemas<Shape extends ZsShape> = {
    [Key in keyof Shape]: Shape[Key];
};

export function unpackMemberSchemas<Shape extends ZsShape>(
    shape: Shape
): UnpackMemberSchemas<Shape> {
    const newShape = {} as any;
    for (const [key, value] of Object.entries(shape)) {
        newShape[key] = value;
    }
    return newShape;
}
