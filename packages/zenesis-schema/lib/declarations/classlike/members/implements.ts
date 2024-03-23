import { ZsStructural } from "../../../core/misc-node"
import { ZsShape, ZsShapedRef } from "../../../core/types"
import { ZsMemberKind } from "./kind"

export interface ZsImplementsDef<Shape extends ZsShape> {
    memberName: ZsMemberKind.ZsImplements
    implemented: ZsShapedRef<Shape>
    auto: boolean
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

    /**
     * Changes if properties auto-generated to fulfill the interface as needed.
     * @param newFulfill Whether members will be generated to fulfill the interface.
     */
    auto(newFulfill: boolean) {
        return new ZsImplements({
            ...this._def,
            auto: newFulfill
        })
    }

    static create<Shape extends ZsShape>(
        shaped: ZsShapedRef<Shape>,
        auto: boolean
    ) {
        return new ZsImplements({
            memberName: ZsMemberKind.ZsImplements,
            implemented: shaped,
            auto
        })
    }
}
