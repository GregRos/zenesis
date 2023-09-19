import { unpackMemberSchemas, ZsShape } from "./overloads";
import { z, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { getTypeFromShape } from "../utils";
import { ZsTypeKind } from "../kinds";

export interface ZsObjectExprDef<Shape extends ZsShape> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsObjectExpr;
    shape: Shape;
}

export class ZsObjectExpr<Shape extends ZsShape> extends ZsMonoType<
    getTypeFromShape<Shape>,
    ZsObjectExprDef<Shape>
> {
    get shape() {
        return this._def.shape;
    }

    readonly actsLike = z.object(unpackMemberSchemas(this.shape));

    static create<Shape extends ZsShape>(shape: Shape) {
        return new ZsObjectExpr<Shape>({
            typeName: ZsTypeKind.ZsObjectExpr,
            shape
        });
    }
}
