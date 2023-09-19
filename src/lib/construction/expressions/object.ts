import { unpackMemberSchemas, ZsShape } from "./overloads";
import { z, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { getTypeFromShape } from "../utils";
import { ZsTypeKind } from "../kind";

export interface ZsObjDef<Shape extends ZsShape> extends ZodTypeDef {
    typeName: ZsTypeKind.ObjectExpr;
    shape: Shape;
}

export class ZsObjectExpr<Shape extends ZsShape<"public">> extends ZsMonoType<
    getTypeFromShape<Shape>,
    ZsObjDef<Shape>
> {
    get shape() {
        return this._def.shape;
    }

    readonly actsLike = z.object(unpackMemberSchemas(this.shape));

    static create<Shape extends ZsShape<"public">>(shape: Shape) {
        return new ZsObjectExpr<Shape>({
            typeName: ZsTypeKind.ObjectExpr,
            shape
        });
    }
}
