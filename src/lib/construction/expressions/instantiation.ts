import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsDeclaredType, ZsShapedRef } from "../refs";
import { ZsTypeKind } from "../kinds";

export interface ZsInstantiationDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsInstantiation;
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | [];
    instance: () => Instance;
}

export class ZsInstantiation<
    Instance extends ZsDeclaredType
> extends ZsMonoType<Instance, ZsInstantiationDef<Instance>> {
    get declaration(): Instance extends ZsShapedRef
        ? Instance["declaration"]
        : undefined {
        if ("declaration" in this.actsLike) {
            return this.actsLike.declaration as any;
        }
        return undefined as any;
    }

    get shape(): Instance extends ZsShapedRef ? Instance["shape"] : undefined {
        if ("shape" in this.actsLike) {
            return this.actsLike.shape as any;
        }
        return undefined as any;
    }

    get actsLike() {
        return this._def.instance();
    }
}
