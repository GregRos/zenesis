import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsMade } from "../generics/made"
import { ZsForeignModule } from "./foreign-module"

export interface ZsForeignDef<As extends any> extends ZodTypeDef {
    readonly typeName: ZsTypeKind.ZsForeignImport
    readonly name: string
    readonly origin: ZsForeignModule
    staticType(): As
}

export const foreignShape = Symbol("foreignShape")
/**
 * Represents a type imported from a non-Zenesis module. Because it's external,
 * nothing is known about it, so you're not going to get any type checking.
 */
export class ZsForeignImport<As = any> extends ZsMonoType<
    As,
    ZsForeignDef<As>
> {
    readonly actsLike = ZodAny.create()
    readonly name = this._def.name
    readonly origin = this._def.origin

    get shape(): any {
        return {
            [foreignShape]: true
        }
    }
    /**
     * Assuming this import is generic, will instantiate it with the given
     * type arguments. Produces invalid code if the import is not generic.
     * @param typeArgs The type arguments to instantiate with.
     * @throws If no type arguments are provided.
     */
    make(
        ...typeArgs: [ZodTypeAny, ...ZodTypeAny[]]
    ): ZsMade<ZsForeignImport<As>> {
        const values = Object.values(typeArgs) as any[]
        if (values.length === 0) {
            throw new Error("Empty type arguments provided.")
        }
        return ZsMade.create(this, this, values as any)
    }
    static create<As>(
        exporter: ZsForeignModule,
        name: string
    ): ZsForeignImport<As> {
        return new ZsForeignImport<As>({
            typeName: ZsTypeKind.ZsForeignImport,
            origin: exporter,
            name,
            staticType() {
                throw new Error("Should not be called.")
            }
        })
    }
}
