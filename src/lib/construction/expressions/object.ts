import { unpackMemberSchemas, ZsShape } from "./overloads";
import { z, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { getTypeFromShape } from "../utils";

export interface ZsObjectDef<Shape extends ZsShape> extends ZodTypeDef {
    typeName: "ZsObject";
    shape: Shape;
}

export class ZsObject<Shape extends ZsShape<"public">> extends ZsMonoType<
    getTypeFromShape<Shape>,
    ZsObjectDef<Shape>
> {
    get shape() {
        return this._def.shape;
    }

    readonly actsLike = z.object(unpackMemberSchemas(this.shape));

    static create<Shape extends ZsShape<"public">>(shape: Shape) {
        return new ZsObject<Shape>({
            typeName: "ZsObject",
            shape
        });
    }
}
