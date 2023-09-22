import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";
import { ZsValue } from "../module-declarations/value";
import { ZodNamedTypeAny } from "../../zod-walker/types";

export interface ZsTypeofDef<Type extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsTypeof;
    reference: ZsValue<Type>;
}

export class ZsTypeof<
    Type extends ZodTypeAny = ZodNamedTypeAny
> extends ZsMonoType<TypeOf<Type>, ZsTypeofDef<Type>> {
    readonly actsLike = this._def.reference.annotation;

    static create<Type extends ZodTypeAny>(reference: ZsValue<Type>) {
        return new ZsTypeof<Type>({
            typeName: ZsTypeKind.ZsTypeof,
            reference
        });
    }
}
