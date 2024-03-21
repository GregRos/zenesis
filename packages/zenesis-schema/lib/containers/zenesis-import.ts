import { Lazy } from "lazies"
import { TypeOf, ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsGeneric } from "../generics/forall-type"
import { ZsExportableType, ZsExportableTypeLike } from "../utils/unions"
import { ZsZenesisModule } from "./zenesis-module"

export interface ZsZenesisImportDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsZenesisImport
    name: string
    inner: Lazy<ZsExportableTypeLike>
    origin: ZsZenesisModule
}
/**
 * Represents an imported Generic or Type from another Zenesis module. The import is
 * lazily resolved, and can be instantiated if it is a Generic.
 *
 * This class is unsafe to use directly because it doesn't know whether the input is
 * a Type or not and will only figure it out later. However, it's known during compile time,
 * when it's used using `ZsSmartZenesisImport`.

 */
export class ZsZenesisAnyImport extends ZsMonoType<any, ZsZenesisImportDef> {
    get origin() {
        return this._def.origin
    }
    get name() {
        return this._def.name
    }
    get isType() {
        return !(this.inner instanceof ZsGeneric)
    }

    get inner() {
        return this._def.inner.pull()
    }

    get actsLike(): any {
        const inner = this.inner
        if (inner instanceof ZsGeneric) {
            throw new Error("Uninstantiated generic import!")
        }
        return inner
    }

    static create<ZType extends ZsExportableTypeLike>(
        name: string,
        innerType: Lazy<ZsExportableTypeLike>,
        origin: ZsZenesisModule
    ): ZsSmartZenesisImport<ZType> {
        return new ZsZenesisAnyImport({
            typeName: ZsTypeKind.ZsZenesisImport,
            name,
            inner: innerType,
            origin
        }) as any
    }

    make(args: any) {
        const inner = this._def.inner.pull()
        if (inner instanceof ZsGeneric) {
            return inner.make(args)
        }
        throw new Error("Cannot instantiate non-generic import!")
    }
}
/**
 * Represents an imported Type from another Zenesis module.
 */
export interface ZsZenesisTypeImport<
    ZType extends ZsExportableType = ZsExportableType
> extends ZsMonoLike<TypeOf<ZType>> {
    readonly name: string
    readonly isType: true
    readonly inner: ZType
}

/**
 * Represents an imported Generic from another Zenesis module.
 */
export interface ZsZenesisGenericImport<
    ZGenType extends ZsGeneric = ZsGeneric
> {
    readonly name: string
    readonly inner: ZGenType
    readonly isType: false
    make: ZGenType["make"]
}

/**
 * Represents an imported Type or Generic from another Zenesis module. The type
 * of the import is known at compile time.
 */
export type ZsSmartZenesisImport<ZType> = ZType extends ZsGeneric
    ? ZsZenesisGenericImport<ZType>
    : ZType extends ZsExportableType
      ? ZsZenesisTypeImport<ZType>
      : never
