import { z, ZodType, ZodTypeDef } from "zod";
import { ZsTypeKind } from "../kind";
import { ZsMonoType } from "../mono-type";

export interface ZsCommonTypeRefDef extends ZodTypeDef {
    readonly typeName: ZsTypeKind.TypeRef;
    readonly name: string;
}

export class ZsCommonTypeRef<Type>
    extends ZsMonoType<Type, ZsCommonTypeRefDef>
    implements ZsCommonTypeRefDef
{
    readonly actsLike = z.any();
    static create(name: string) {
        return new ZsCommonTypeRef(name);
    }
}
