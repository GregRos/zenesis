import { ZodTypeAny } from "zod";
import { ZsValueRef } from "../refs";
import { ZsFunction } from "../expressions/function";

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

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue({
            ...this._def,
            style: "let",
            annotation
        });
    }

    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue({
            ...this._def,
            style: "const",
            annotation
        });
    }

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue({
            ...this._def,
            style: "var",
            annotation
        });
    }

    function<Annotation extends ZsFunction<any, any>>(
        annotation: Annotation
    ): ZsValue<Name, Annotation> {
        return new ZsValue({
            ...this._def,
            style: "function",
            annotation
        });
    }

    static create<Name extends string>(name: Name) {
        return new ZsValue({
            name,
            style: "const",
            annotation: undefined as any,
            describe: ""
        }) as ZsValueBuilder<Name>;
    }
}

export interface ZsValueBuilder<Name extends string> {
    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;

    function<Annotation extends ZsFunction<any, any>>(
        annotation: Annotation
    ): ZsValue<Name, Annotation>;
}
