import { z, ZodAny, ZodTypeAny } from "zod";
import { ZsNodeKind } from "../kinds";

export interface ZsValueDef<Annotation extends ZodTypeAny> {
    nodeName: ZsNodeKind.ZsValue;
    name: string;
    style: "const" | "let" | "var" | "function";
    annotation: Annotation;
    describe?: string;
}

export class ZsValue<Annotation extends ZodTypeAny = ZodTypeAny> {
    readonly declaration = "value";
    readonly annotation = this._def.annotation;

    constructor(readonly _def: ZsValueDef<Annotation>) {}

    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "const",
            annotation
        });
    }

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "function",
            annotation
        });
    }

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "let",
            annotation
        });
    }

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "var",
            annotation
        });
    }

    static create<Name extends string>(name: Name): ZsValueBuilder<Name> {
        return new ZsValue<ZodAny>({
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
    ): ZsValue<Annotation>;

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>;

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>;

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>;
}
