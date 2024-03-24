import { memoize } from "lazies"
import { TypeOf, ZodTypeDef } from "zod"
import { ZsMonoLike, ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsClass } from "../declarations/classlike/class"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsGeneric } from "../generics/generic"
import {
    ZsClassLike,
    ZsExportableType,
    ZsExportableTypeLike
} from "../utils/unions"
import { ZsZenesisModule } from "./zenesis-module"
export interface ZsZenesisImportDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsZenesisImport
    name: string
    inner: () => ZsExportableTypeLike
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
        return this._def.inner()
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
        innerType: () => ZsExportableTypeLike,
        origin: ZsZenesisModule
    ): ZsSmartZenesisImport<ZType> {
        return new ZsZenesisAnyImport({
            typeName: ZsTypeKind.ZsZenesisImport,
            name,
            inner: memoize(innerType),
            origin
        }) as any
    }

    make(args: any) {
        const inner = this._def.inner()
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
    readonly origin: ZsZenesisModule
}

export interface ZsZenesisShapedImport<ZType extends ZsClassLike = ZsClassLike>
    extends ZsZenesisTypeImport<ZType> {
    readonly shape: ZType["shape"]
}

/**
 * Represents an imported Generic from another Zenesis module.
 */
export type ZsZenesisGenericImport<ZGenType extends ZsGeneric = ZsGeneric> = {
    readonly name: string
    readonly inner: ZGenType
    readonly isType: false
    readonly origin: ZsZenesisModule

    make: ZGenType["make"]
}

export type ZsZenesisImport =
    | ZsZenesisGenericImport
    | ZsZenesisTypeImport
    | ZsZenesisShapedImport

/**
 * Represents an imported Type or Generic from another Zenesis module. The type
 * of the import is known at compile time.
 */
export type ZsSmartZenesisImport<ZType> = ZType extends ZsGeneric
    ? ZsZenesisGenericImport<ZType>
    : ZType extends ZsClass | ZsInterface
      ? ZsZenesisShapedImport<ZType>
      : ZType extends ZsExportableType
        ? ZsZenesisTypeImport<ZType>
        : never
