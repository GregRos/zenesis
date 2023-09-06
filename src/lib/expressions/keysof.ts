import {
    ParseInput,
    ParseReturnType,
    ZodType,
    ZodTypeAny,
    ZodTypeDef
} from "zod";
import { ZsMonoType } from "../mono-type";

export interface ZsKeyOfDef<Container extends ZodTypeAny> extends ZodTypeDef {
    typeName: "ZsKeyOf";
    what: Container;
}

export class ZsKeyOf<Container extends ZodTypeAny> extends ZsMonoType<
    keyof Container["_type"],
    ZsKeyOfDef<Container>
> {
    _parse(input: ParseInput): ParseReturnType<keyof Container["_type"]> {
        return this._def.what._parse(input);
    }

    get of() {
        return this._def.what;
    }

    readonly declaration = "keyof";
}
