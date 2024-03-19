import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsShapedRef } from "../core/types"
import { ZsInstantiable } from "../declarations/unions"
import { ZsTypeKind } from "../kinds"

export interface ZsInstantiationDef<Instance extends ZsInstantiable>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsInstantiation
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    instance: Instance
}
export class ZsInstantiation<
    ZDeclaration extends ZsInstantiable = ZsInstantiable
> extends ZsMonoType<TypeOf<ZDeclaration>, ZsInstantiationDef<ZDeclaration>> {
    isDeclarationType<ZDecl extends ZsInstantiable>(ctor: {
        new (): ZDecl
    }): this is ZsInstantiation<ZDecl> {
        return this._def.instance instanceof ctor
    }
    get declaration(): ZDeclaration extends ZsShapedRef
        ? ZDeclaration["declaration"]
        : undefined {
        if ("declaration" in this.actsLike) {
            return this.actsLike.declaration as any
        }
        return undefined as any
    }
    static create<ZDecl extends ZsInstantiable>(
        instance: ZDecl,
        typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    ): ZsInstantiation<ZDecl> {
        return new ZsInstantiation({
            typeName: ZsTypeKind.ZsInstantiation,
            typeArgs,
            instance
        }) as any
    }

    get shape(): ZDeclaration extends ZsShapedRef
        ? ZDeclaration["shape"]
        : undefined {
        if ("shape" in this.actsLike) {
            return this.actsLike.shape as any
        }
        return undefined as any
    }

    get actsLike() {
        return this._def.instance
    }
}
