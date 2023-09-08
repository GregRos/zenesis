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

export interface ZsKeyOfDef<Of> extends ZodTypeDef {
    typeName: "ZsKeyOf";
    of: ZsMonoLike<Of>;
}

export const PropertyKey = z.union([z.string(), z.number(), z.symbol()]);

export class ZsKeyOf<Container> extends ZsMonoType<
    PropertyKey,
    ZsKeyOfDef<Container>
> {
    readonly actsLike = PropertyKey;

    get of() {
        return this._def.of;
    }

    static create<Container extends ZodTypeAny>(what: Container) {
        return new ZsKeyOf<Container>({
            typeName: "ZsKeyOf",
            of: what
        });
    }
}
