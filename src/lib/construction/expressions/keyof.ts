import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";
import { ZodNamedTypeAny } from "../../zod-walker/types";

export interface ZsKeyofDef<Of extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsKeyof;
    of: Of;
}

export const PropertyKey = z.union([z.string(), z.number(), z.symbol()]);

export class ZsKeyof<
    Of extends ZodTypeAny = ZodNamedTypeAny
> extends ZsMonoType<keyof TypeOf<Of>, ZsKeyofDef<Of>> {
    readonly actsLike = PropertyKey as ZsMonoLike<keyof Of>;

    get of() {
        return this._def.of;
    }

    static create<Container extends ZodTypeAny>(what: Container) {
        return new ZsKeyof<Container>({
            typeName: ZsTypeKind.ZsKeyof,
            of: what
        });
    }
}
