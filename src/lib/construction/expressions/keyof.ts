import {
    CatchallInput,
    ParseInput,
    ParseReturnType,
    z,
    ZodType,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";

export interface ZsKeyofDef<Of extends ZodTypeAny> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsKeyof;
    of: Of;
}

export const PropertyKey = z.union([z.string(), z.number(), z.symbol()]);

export class ZsKeyof<Of extends ZodTypeAny> extends ZsMonoType<
    PropertyKey,
    ZsKeyofDef<Of>
> {
    readonly actsLike = PropertyKey;

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
