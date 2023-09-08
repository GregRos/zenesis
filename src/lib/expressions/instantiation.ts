import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsShapedRef, ZsDeclaredType } from "../refs";

export interface ZsInstantiationDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: "ZsInstantiation";
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | [];
    instance: Instance;
}

export class ZsInstantiation<
    Instance extends ZsDeclaredType<any>
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
        return this._def.instance;
    }
}
