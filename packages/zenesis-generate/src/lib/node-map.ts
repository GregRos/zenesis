import { ZsReferable, isReferable } from "@zenesis/schema"
import { Map } from "immutable"
import { Lazy, isLazyLike } from "lazies"
import { Declaration, TypeReferenceNode } from "typescript"

export interface TypeDeclRef {
    declaration: Declaration
    reference: TypeReferenceNode
}
export class NodeMap {
    constructor(
        private readonly _map: Map<
            ZsReferable,
            TypeReferenceNode | Lazy<TypeReferenceNode>
        >,
        private readonly _missingNode: (node: ZsReferable) => TypeReferenceNode
    ) {}
    static create(missingNode: (node: ZsReferable) => TypeReferenceNode) {
        return new NodeMap(Map<ZsReferable, TypeReferenceNode>(), missingNode)
    }

    get(node: ZsReferable): TypeReferenceNode {
        const ref = this._map.get(node)
        if (ref) {
            if (isLazyLike(ref)) {
                return ref.pull()
            }
            return ref
        }
        if (!isReferable(node)) {
            throw new Error("Node isff not declarable")
        }
        const newNode = this._missingNode(node)
        this._map.set(node, newNode)
        return newNode
    }

    set(node: ZsReferable, ref: TypeReferenceNode | Lazy<TypeReferenceNode>) {
        return new NodeMap(this._map.set(node, ref), this._missingNode)
    }
}
