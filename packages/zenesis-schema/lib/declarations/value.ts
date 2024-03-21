import { ZodTypeAny } from "zod"
import { ZsStructural } from "../core/misc-node"
import { ZsDeclKind } from "./kind"

export enum ZsValueKind {
    const = "const",
    let = "let",
    var = "var",
    function = "function"
}
export interface ZsValueDef<Annotation extends ZodTypeAny> {
    declName: ZsDeclKind.ZsValue
    name: string
    style: ZsValueKind
    annotation: Annotation
    describe?: string
}

export class ZsValue<
    Annotation extends ZodTypeAny = ZodTypeAny
> extends ZsStructural<ZsValueDef<Annotation>> {
    readonly annotation = this._def.annotation

    readonly name = this._def.name

    static create<Annotation extends ZodTypeAny = ZodTypeAny>(
        name: string,
        kind: ZsValueKind,
        annotation: Annotation
    ) {
        return new ZsValue({
            declName: ZsDeclKind.ZsValue,
            name,
            style: kind,
            annotation
        })
    }
}
