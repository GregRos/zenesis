import { z, ZodAny, ZodTypeAny } from "zod";
import { ZsValueRef } from "../refs";
import { ZsFunction } from "../expressions/function";
import { ZsNodeKind } from "../kinds";

export interface ZsValueDef<
    Name extends string,
    Annotation extends ZodTypeAny
> {
    nodeName: ZsNodeKind.ZsValue;
    name: Name;
    style: "const" | "let" | "var" | "function";
    annotation: Annotation;
    describe?: string;
}

export class ZsValue<
        Name extends string,
        Annotation extends ZodTypeAny = ZodTypeAny
    >
    implements ZsValueRef<Name, Annotation>, ZsValueBuilder<Name>
{
    readonly name = this._def.name;
    readonly declaration = "value";
    readonly annotation = this._def.annotation;

    constructor(readonly _def: ZsValueDef<Name, Annotation>) {}

    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue<Name, Annotation>({
            ...this._def,
            style: "const",
            annotation
        });
    }

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue<Name, Annotation>({
            ...this._def,
            style: "function",
            annotation
        });
    }

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue<Name, Annotation>({
            ...this._def,
            style: "let",
            annotation
        });
    }

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue<Name, Annotation>({
            ...this._def,
            style: "var",
            annotation
        });
    }

    static create<Name extends string>(name: Name): ZsValueBuilder<Name> {
        return new ZsValue<Name, ZodAny>({
            nodeName: ZsNodeKind.ZsValue,
            name,
            style: "const",
            annotation: z.any(),
            describe: `Value ${name}`
        });
    }
}

export interface ZsValueBuilder<Name extends string> {
    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;
}
