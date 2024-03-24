import { memoize } from "lazies"
import { ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsGeneric } from "../generics/generic"
import { ZsModuleDeclarableType } from "../utils/unions"

export interface ZsSelfrefDef<Resolved extends ZsModuleDeclarableType>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsSelfref
    resolving(): Resolved
}

/**
 * Used as a self-reference to a type inside its scope, to avoid
 * recursive type inference.
 */
export class ZsTypeSelfref<
    Resolved extends ZsModuleDeclarableType = ZsModuleDeclarableType
> extends ZsMonoType<any, ZsSelfrefDef<Resolved>> {
    get actsLike(): any {
        return this._def.resolving()
    }

    get isType() {
        return this._def.resolving() instanceof ZsGeneric
    }
    static create<Self extends ZsModuleDeclarableType>(
        resolving: () => Self
    ): ZsTypeSelfref<Self> {
        return new ZsTypeSelfref({
            typeName: ZsTypeKind.ZsSelfref,
            resolving: memoize(resolving) as () => Self
        })
    }
}
