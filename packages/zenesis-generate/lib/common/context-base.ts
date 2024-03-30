import { ZsTypeVar } from "@zenesis/schema"
import { NodeMap } from "../utils/node-map"
import { tf } from "../utils/tf"

export abstract class BaseContext {
    constructor(protected readonly _refs: NodeMap) {}

    abstract create(refs: NodeMap): this

    withTypeVars(typeVars: ZsTypeVar[]) {
        let refs = this._refs
        for (const typeVar of typeVars) {
            refs = refs.set(
                typeVar.arg,
                tf.createTypeReferenceNode(typeVar.name)
            )
        }
        return this.create(refs)
    }
}
