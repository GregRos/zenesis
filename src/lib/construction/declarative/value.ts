import { ZodTypeAny } from "zod";
import { ZsValueRef } from "../refs";

export interface ZsValueDef<
    Name extends string,
    Annotation extends ZodTypeAny
> {
    name: Name;
    style: "const" | "let" | "var" | "function";
    annotation: Annotation;
    describe: string;
}

export class ZsValue<
    Name extends string,
    Annotation extends ZodTypeAny = ZodTypeAny
> implements ZsValueRef<Name, Annotation>
{
    readonly name = this._def.name;
    readonly declaration = "value";
    readonly annotation = this._def.annotation;
    constructor(readonly _def: ZsValueDef<Name, Annotation>) {}
}
