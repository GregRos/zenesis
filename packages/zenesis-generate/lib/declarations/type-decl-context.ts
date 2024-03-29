import { TypeExprContext } from "../expressions/type-expr-context"
import { NodeMap } from "../utils/node-map"

export class TypeDeclContext {
    constructor(private readonly _refs: NodeMap) {}

    createExpressionContext() {
        return new TypeExprContext(this._refs)
    }
}
