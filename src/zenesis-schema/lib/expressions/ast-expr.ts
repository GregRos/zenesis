import { TypeNode } from "typescript"
import { ZodAny, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../kinds"
export interface ZsAstExprDef<As> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsAstExpr
    actsLike: ZsMonoLike<As>
    astNode: TypeNode
    staticType: () => As
}

export class ZsAstExpr<As = any> extends ZsMonoType<As, ZsAstExprDef<As>> {
    readonly actsLike = this._def.actsLike
    readonly ast = this._def.astNode

    static create<As>(
        typeNode: TypeNode,
        actsLike: ZsMonoLike<As> = ZodAny.create()
    ) {
        return new ZsAstExpr<As>({
            typeName: ZsTypeKind.ZsAstExpr,
            astNode: typeNode,
            actsLike,
            staticType() {
                throw new Error("Should not be called.")
            }
        })
    }
}
