import { ZsMemberKind } from "../core/member-kind"
import { ZsStructural } from "../core/misc-node"
import { ZsShape, ZsShapedRef } from "../core/types"

export type ImplementsKind = "auto implement" | "extend"

export interface ZsImplementsDef<Shape extends ZsShape> {
    memberName: ZsMemberKind.ZsImplements
    kind: ImplementsKind
    implemented: ZsShapedRef<Shape>
}

/**
 * Says that a classlike Type node implements the given interface.
 */
export class ZsImplements<Shape extends ZsShape = ZsShape> extends ZsStructural<
    ZsImplementsDef<Shape>
> {
    get shape(): Shape {
        return this._def.implemented.shape as any
    }

    static create<Shape extends ZsShape>(
        shaped: ZsShapedRef<Shape>,
        kind: ImplementsKind = "auto implement"
    ) {
        return new ZsImplements({
            memberName: ZsMemberKind.ZsImplements,
            implemented: shaped,
            kind
        })
    }
}
