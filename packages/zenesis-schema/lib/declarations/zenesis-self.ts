import { Lazy } from "lazies"
import { ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsStructural } from "../core/misc-node"
import { ZsMonoType } from "../core/mono-type"
import { ZsGeneric } from "../generics/forall-type"
import { ZsModuleDeclarableType } from "../utils/unions"

export interface ZsTypeSelfDef<Resolved extends ZsModuleDeclarableType>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsZenesisSelf
    resolved: Lazy<Resolved>
}

/**
 * Used as a self-reference to a type inside its scope, to avoid
 * recursive type inference.
 */
export class ZsTypeSelf<
    Resolved extends ZsModuleDeclarableType = ZsModuleDeclarableType
> extends ZsMonoType<any, ZsTypeSelfDef<Resolved>> {
    get actsLike(): any {
        return this._def.resolved.pull()
    }

    get isType() {
        return this._def.resolved.pull() instanceof ZsGeneric
    }
    static create(
        resolved: Lazy<ZsModuleDeclarableType>
    ): ZsTypeSelfDef<ZsModuleDeclarableType> {
        return { typeName: ZsTypeKind.ZsZenesisSelf, resolved }
    }

    make(...args: any[]) {
        if (this.isType) {
            throw new Error(
                "Attempted to treat a type self reference as a generic node!"
            )
        }
        return this._def.resolved.pull()
    }
}

export interface ZsZenesisGenericSelfDef<Resolved extends ZsGeneric> {
    resolved: Lazy<Resolved>
}

export class ZsZenesisGenericSelf<
    Resolved extends ZsGeneric = ZsGeneric
> extends ZsStructural<ZsZenesisGenericSelfDef<Resolved>> {
    static create<Resolved extends ZsGeneric>(
        resolved: Lazy<Resolved>
    ): ZsZenesisGenericSelfDef<Resolved> {
        return { resolved }
    }

    make: Resolved["make"] = (...args) => {
        return this._def.resolved.pull().make(...args)
    }
}
