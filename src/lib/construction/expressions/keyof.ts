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

export interface ZsKeyOfDef<Of extends ZodTypeAny> extends ZodTypeDef {
    typeName: "ZsKeyOf";
    of: Of;
}

export const PropertyKey = z.union([z.string(), z.number(), z.symbol()]);

export class ZsKeyof<Of extends ZodTypeAny> extends ZsMonoType<
    PropertyKey,
    ZsKeyOfDef<Of>
> {
    readonly actsLike = PropertyKey;

    get of() {
        return this._def.of;
    }

    static create<Container extends ZodTypeAny>(what: Container) {
        return new ZsKeyof<Container>({
            typeName: "ZsKeyOf",
            of: what
        });
    }
}
