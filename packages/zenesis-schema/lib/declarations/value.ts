import { ZodTypeAny } from "zod"
import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsStructural } from "../core/misc-node"

export enum ZsValueKind {
    const = "const",
    let = "let",
    var = "var",
    function = "function"
}
export interface ZsValueDef<Annotation extends ZodTypeAny> {
    declName: ZsModuleDeclKind.ZsValue
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
            declName: ZsModuleDeclKind.ZsValue,
            name,
            style: kind,
            annotation
        })
    }
}
