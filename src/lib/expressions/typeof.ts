import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsValueRef } from "../declarative/value";
import { ZsMonoType } from "../mono-type";

export interface ZsTypeofDef<Type extends ZodTypeAny> extends ZodTypeDef {
    typeName: "ZsTypeof";
    reference: ZsValueRef<Type>;
}

export class ZsTypeof<Type extends ZodTypeAny> extends ZsMonoType<
    TypeOf<Type>,
    ZsTypeofDef<Type>
> {
    readonly actsLike = this._def.reference.annotation;
}
