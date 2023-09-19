import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsValueRef } from "../refs";
import { ZsTypeKind } from "../kind";

export interface ZsTypeofDef<Type extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.Typeof;
    reference: ZsValueRef<string, Type>;
}

export class ZsTypeof<Type extends ZodTypeAny> extends ZsMonoType<
    TypeOf<Type>,
    ZsTypeofDef<Type>
> {
    readonly actsLike = this._def.reference.annotation;

    static create<Type extends ZodTypeAny>(
        reference: ZsValueRef<string, Type>
    ) {
        return new ZsTypeof<Type>({
            typeName: ZsTypeKind.Typeof,
            reference
        });
    }
}
