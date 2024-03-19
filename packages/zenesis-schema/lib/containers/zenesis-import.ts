import { Lazy } from "lazies"
import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsTypeExportable, ZsTypeLikeExportable } from "../declarations/unions"
import { ZsForallType } from "../generics/forall-type"
import { ZsTypeKind } from "../kinds"
import { ZsZenesisModule } from "./zenesis-module"

export interface ZsZenesisImportDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsZenesisImport
    name: string
    inner: Lazy<ZsTypeLikeExportable>
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
export class ZsZenesisImport extends ZsMonoType<any, ZsZenesisImportDef> {
    get origin() {
        return this._def.origin
    }
    get name() {
        return this._def.name
    }
    get isType() {
        return !(this.inner instanceof ZsForallType)
    }

    get inner() {
        return this._def.inner.pull()
    }

    get actsLike(): any {
        const inner = this.inner
        if (inner instanceof ZsForallType) {
            throw new Error("Uninstantiated generic import!")
        }
        return inner
    }

    static create<ZType extends ZsTypeLikeExportable>(
        name: string,
        innerType: Lazy<ZsTypeLikeExportable>,
        origin: ZsZenesisModule
    ): ZsSmartZenesisImport<ZType> {
        return new ZsZenesisImport({
            typeName: ZsTypeKind.ZsZenesisImport,
            name,
            inner: innerType,
            origin
        }) as any
    }

    instantiate(args: any) {
        const inner = this._def.inner.pull()
        if (inner instanceof ZsForallType) {
            return inner.instantiate(args)
        }
        throw new Error("Cannot instantiate non-generic import!")
    }
}
/**
 * Represents an imported Type from another Zenesis module.
 */
export interface ZsZenesisTypeImport<
    ZType extends ZsTypeExportable = ZsTypeExportable
> extends ZsMonoLike<TypeOf<ZType>> {
    readonly name: string
    readonly isType: true
    readonly inner: ZType
}

/**
 * Represents an imported Generic from another Zenesis module.
 */
export interface ZsZenesisGenericImport<
    ZGenType extends ZsForallType = ZsForallType
> {
    readonly name: string
    readonly inner: ZGenType
    readonly isType: false
    instantiate: ZGenType["instantiate"]
}

/**
 * Represents an imported Type or Generic from another Zenesis module. The type
 * of the import is known at compile time.
 */
export type ZsSmartZenesisImport<ZType> = ZType extends ZsForallType
    ? ZsZenesisGenericImport<ZType>
    : ZType extends ZsTypeExportable
      ? ZsZenesisTypeImport<ZType>
      : never
