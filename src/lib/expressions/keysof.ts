import {
    ParseInput,
    ParseReturnType,
    z,
    ZodType,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoType } from "../mono-type";

export interface ZsKeyOfDef<Container extends ZodTypeAny> extends ZodTypeDef {
    typeName: "ZsKeyOf";
    what: Container;
}

export const PropertyKey = z.string().or(z.number()).or(z.symbol());

export class ZsKeyOf<Container extends ZodTypeAny> extends ZsMonoType<
    keyof Container["_type"],
    ZsKeyOfDef<Container>
> {
    readonly actsLike = PropertyKey;

    get of() {
        return this._def.what;
    }

    static create<Container extends ZodTypeAny>(what: Container) {
        return new ZsKeyOf<Container>({
            typeName: "ZsKeyOf",
            what
        });
    }
}
