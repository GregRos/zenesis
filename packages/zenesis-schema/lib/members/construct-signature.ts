import { ZsStructural } from "../core/misc-node"
import { ZsOverloads } from "../expressions/overloads"

export interface ZsNewSignatureDef<Overloads extends ZsOverloads> {
    overloads: Overloads
}

export class ZsConstruct<
    Overloads extends ZsOverloads = ZsOverloads
> extends ZsStructural<ZsNewSignatureDef<Overloads>> {
    static create<ZOverloads extends ZsOverloads>(params: ZOverloads) {
        return new ZsConstruct({
            overloads: params
        })
    }
}
