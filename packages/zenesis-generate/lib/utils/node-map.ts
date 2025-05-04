import {
    ZsReferableTypeLike,
    describeZenesisNode,
    isDeclarableType,
    isImport
} from "@zenesis/schema"
import { Lazy, isLazyLike } from "doddle"
import { Map } from "immutable"
import { Declaration, TypeReferenceNode } from "typescript"

export interface TypeDeclRef {
    declaration: Declaration
    reference: TypeReferenceNode
}
export class NodeMap {
    constructor(
        private readonly _map: Map<
            ZsReferableTypeLike,
            TypeReferenceNode | Lazy<TypeReferenceNode>
        >,
        private readonly _missingNode: (
            node: ZsReferableTypeLike
        ) => TypeReferenceNode
    ) {}
    static create(
        missingNode: (node: ZsReferableTypeLike) => TypeReferenceNode
    ) {
        return new NodeMap(
            Map<ZsReferableTypeLike, TypeReferenceNode>(),
            missingNode
        )
    }

    get(node: ZsReferableTypeLike): TypeReferenceNode {
        const ref = this._map.get(node)
        if (ref) {
            if (isLazyLike(ref)) {
                return ref.pull()
            }
            return ref
        }
        if (!isImport(node) && !isDeclarableType(node)) {
            throw new Error(
                `Node ${describeZenesisNode(node)} is not declarable`
            )
        }
        const newNode = this._missingNode(node)
        this._map.set(node, newNode)
        return newNode
    }

    set(
        node: ZsReferableTypeLike,
        ref: TypeReferenceNode | Lazy<TypeReferenceNode>
    ) {
        return new NodeMap(this._map.set(node, ref), this._missingNode)
    }
}
