import { ZsStructural } from "../core/misc-node"
import { ZsOverloads } from "../expressions/overloads"

export interface ZsCallSignatureDef<Overloads extends ZsOverloads> {
    overloads: Overloads
}

export class ZsCallSignature<
    Overloads extends ZsOverloads = ZsOverloads
> extends ZsStructural<ZsCallSignatureDef<Overloads>> {
    static create<ZOverloads extends ZsOverloads>(params: ZOverloads) {
        return new ZsCallSignature({
            overloads: params
        })
    }
}
