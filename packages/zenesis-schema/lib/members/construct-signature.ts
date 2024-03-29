import { ZsMemberKind } from "../core/member-kind"
import { ZsStructural } from "../core/misc-node"
import { ZsOverloads } from "../expressions/overloads"

export interface ZsConstructSignatureDef<Overloads extends ZsOverloads> {
    memberName: ZsMemberKind.ZsConstruct
    overloads: Overloads
}

export class ZsConstruct<
    Overloads extends ZsOverloads = ZsOverloads
> extends ZsStructural<ZsConstructSignatureDef<Overloads>> {
    static create<ZOverloads extends ZsOverloads>(params: ZOverloads) {
        return new ZsConstruct({
            overloads: params,
            memberName: ZsMemberKind.ZsConstruct
        })
    }
}
