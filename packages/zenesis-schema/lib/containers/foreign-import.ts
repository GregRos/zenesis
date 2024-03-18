import { ZodAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsInstantiation } from "../expressions/instantiation"
import { ZsTypeKind } from "../kinds"
import { ZsForeignModule } from "./foreign-module"

export interface ZsForeignDef<As extends any> extends ZodTypeDef {
    readonly typeName: ZsTypeKind.ZsForeignImport
    readonly name: string
    readonly origin: ZsForeignModule
    staticType(): As
}

export class ZsForeignImport<As = any> extends ZsMonoType<
    As,
    ZsForeignDef<As>
> {
    readonly actsLike = ZodAny.create()
    readonly name = this._def.name
    readonly origin = this._def.origin
    instantiate(args: any) {
        const values = Object.values(args) as any[]
        if (values.length === 0) {
            throw new Error("Empty type arguments provided.")
        }
        return ZsInstantiation.create(this, values as any)
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
