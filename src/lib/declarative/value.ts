import { TypeOf, ZodTypeAny } from "zod";
import { ZsMonoLike } from "../mono-type";

export interface ZsValueDef<Annotation extends ZodTypeAny> {
    name: string;
    kind: "const" | "let" | "var" | "function";
    annotation: Annotation;
    describe: string;
}

export interface ZsValueRef<Annotation extends ZodTypeAny> {
    readonly declaration: "value";
    readonly annotation: Annotation;
}

export class ZsValue<Annotation extends ZodTypeAny>
    implements ZsValueRef<Annotation>
{
    readonly declaration = "value";
    readonly annotation = this._def.annotation;
    constructor(readonly _def: ZsValueDef<Annotation>) {}
}
