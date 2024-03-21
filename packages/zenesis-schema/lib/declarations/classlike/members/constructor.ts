import { AnyZodTuple, ZodTuple } from "zod"
import { ZsStructural } from "../../../core/misc-node"
import { ZsMemberKind } from "./kind"

export interface ZsConstructorDef<ZArgs extends AnyZodTuple> {
    memberName: ZsMemberKind.ZsConstructor
    args: ZArgs
}

export class ZsConstructor<
    ZArgs extends AnyZodTuple = ZodTuple<any, any>
> extends ZsStructural<ZsConstructorDef<ZArgs>> {
    static create<ZTuple extends AnyZodTuple>(params: ZTuple) {
        return new ZsConstructor({
            memberName: ZsMemberKind.ZsConstructor,
            args: params
        })
    }
}
