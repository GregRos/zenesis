import { ZodRawShape, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { getTypeFromShape, RecursiveConjunction } from "../utils";

export interface ZsOverloadsDef<
    Overloads extends readonly [ZodTypeAny, ...ZodTypeAny[]]
> extends ZodTypeDef {
    typeName: "ZsOverloads";
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
            typeName: "ZsOverloads",
            overloads: [...this._def.overloads, overload]
        });
    }

    static create<Overloads extends [ZodTypeAny, ...ZodTypeAny[]]>(
        overloads: Overloads
    ) {
        return new ZsOverloads<Overloads>({
            typeName: "ZsOverloads",
            overloads
        });
    }
}

export type ZsShape = {
    [key: string]: ZodTypeAny | readonly ZodTypeAny[];
};

export type Overloaded<Input> = Input extends readonly [
    ZodTypeAny,
    ...ZodTypeAny[]
]
    ? ZsOverloads<Input>
    : Input extends ZodTypeAny
    ? Input
    : never;

export type ArrayMembersToOverloads<Shape extends ZsShape> = {
    [Key in keyof Shape]: Overloaded<Shape[Key]>;
};

export function arraysToOverloads<const Shape extends ZsShape>(
    shape: Shape
): ArrayMembersToOverloads<Shape> {
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
