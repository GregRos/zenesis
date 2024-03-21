import { ZsStructural } from "../../../core/misc-node"
import { ZsShape, ZsShapedRef } from "../../../core/types"
import { ZsMade } from "../../../generics/instantiation"
import { ZsClass } from "../class"
import { ZsInterface } from "../interface"
import { ZsMemberKind } from "./kind"

export type ZsImplementable =
    | ZsInterface
    | ZsMade<ZsInterface>
    | ZsClass
    | ZsMade<ZsClass>

export function isImplementable(x: any): x is ZsImplementable {
    return (
        x instanceof ZsInterface ||
        x instanceof ZsClass ||
        (x instanceof ZsMade && x._def.instance instanceof ZsInterface) ||
        x._def.instance instanceof ZsClass
    )
}

export interface ZsImplementsDef<Shape extends ZsShape> {
    memberName: ZsMemberKind.ZsImplements
    implemented: ZsShapedRef<Shape>
}

export class ZsImplements<Shape extends ZsShape = ZsShape> extends ZsStructural<
    ZsImplementsDef<Shape>
> {
    get shape(): Shape {
        return this._def.implemented.shape
    }

    static create<Shape extends ZsShape>(shaped: ZsShapedRef<Shape>) {
        return new ZsImplements({
            memberName: ZsMemberKind.ZsImplements,
            implemented: shaped
        })
    }
}
