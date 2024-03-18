import { z, ZodAny, ZodTypeAny } from "zod"
import { ZsMiscNode } from "../misc-node"
import { ZsDeclKind } from "./kind"

export interface ZsValueDef<Annotation extends ZodTypeAny> {
    declName: ZsDeclKind.ZsValue
    name: string
    style: "const" | "let" | "var" | "function"
    annotation: Annotation
    describe?: string
}

export class ZsValue<
    Annotation extends ZodTypeAny = ZodTypeAny
> extends ZsMiscNode<ZsValueDef<Annotation>> {
    readonly declaration = "value"
    readonly annotation = this._def.annotation

    readonly name = this._def.name

    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "const",
            annotation
        })
    }

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "function",
            annotation
        })
    }

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "let",
            annotation
        })
    }

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation> {
        return new ZsValue<Annotation>({
            ...this._def,
            style: "var",
            annotation
        })
    }

    static create<Name extends string>(name: Name): ZsValueBuilder<Name> {
        return new ZsValue<ZodAny>({
            declName: ZsDeclKind.ZsValue,
            name,
            style: "const",
            annotation: z.any(),
            describe: `Value ${name}`
        })
    }
}

export interface ZsValueBuilder<Name extends string> {
    const<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>

    let<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>

    var<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>

    function<Annotation extends ZodTypeAny>(
        annotation: Annotation
    ): ZsValue<Annotation>
}
