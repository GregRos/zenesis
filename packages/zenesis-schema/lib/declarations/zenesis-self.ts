import { memoize } from "lazies"
import { ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsStructural } from "../core/misc-node"
import { ZsMonoType } from "../core/mono-type"
import { ZsGeneric } from "../generics/forall-type"
import { Instantiable } from "../generics/instantiable"
import { ZsMade } from "../generics/instantiation"
import { ZsTypeVarTuple } from "../generics/type-var"
import { ZsMakeResultType, ZsModuleDeclarableType } from "../utils/unions"

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
    static create(
        resolving: () => ZsModuleDeclarableType
    ): ZsTypeSelfref<ZsModuleDeclarableType> {
        return new ZsTypeSelfref({
            typeName: ZsTypeKind.ZsSelfref,
            resolving: memoize(resolving)
        })
    }
}

export interface ZsGenericSelfrefDef {
    resolving(): ZsGeneric
}

export class ZsGenericSelfref<
    Vars extends ZsTypeVarTuple = ZsTypeVarTuple,
    Result extends ZsMakeResultType = ZsMakeResultType
> extends ZsStructural<ZsGenericSelfrefDef> {
    static create<Vars extends ZsTypeVarTuple, Result extends ZsMakeResultType>(
        vars: Vars,
        resolving: () => ZsGeneric
    ): ZsGenericSelfref<Vars, Result> {
        return new ZsGenericSelfref({
            resolving: memoize(resolving)
        })
    }

    make: Instantiable<Vars, ZsMakeResultType>["make"] = (...args) => {
        const resolvedSelf = this._def.resolving()
        return ZsMade.create(resolvedSelf._def.innerType, resolvedSelf, args)
    }
}
