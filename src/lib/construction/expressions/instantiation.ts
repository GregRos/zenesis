import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../mono-type"
import { ZsShapedRef } from "../refs"
import { ZsTypeKind } from "../kinds"
import { ZsTypeAlias } from "../module-declarations/alias"
import { ZsInterface } from "../module-declarations/interface"
import { ZsClass } from "../module-declarations/class"
import { ZsImport } from "../external/import"

export type ZsTypeCtors = ZsTypeAlias | ZsInterface | ZsClass | ZsImport

export interface ZsInstantiationDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsInstantiation
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | []
    instance: Instance
}

export class ZsInstantiation<
    ZDeclaration extends ZsTypeCtors = ZsTypeCtors
> extends ZsMonoType<TypeOf<ZDeclaration>, ZsInstantiationDef<ZDeclaration>> {
    get declaration(): ZDeclaration extends ZsShapedRef
        ? ZDeclaration["declaration"]
        : undefined {
        if ("declaration" in this.actsLike) {
            return this.actsLike.declaration as any
        }
        return undefined as any
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
