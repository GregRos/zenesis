import { z, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../../core/mono-type"
import { SchemaSubtypeOf } from "../../core/operators"
import { ZsTypeKind } from "../../kinds"

export class ZsTypeVar<
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsMonoType<Extends, ZsTypeVarDef<Extends, Default>> {
    readonly declaration = "typeVar"
    readonly name = this._def.name
    static create(name: string) {
        return new ZsTypeVar({
            typeName: ZsTypeKind.ZsTypeVar,
            name,
            extends: z.any(),
            defaultType: null,
            const: false,
            variance: ""
        })
    }

    defaultType<Default2 extends SchemaSubtypeOf<Extends> | null>(
        defaultType: Default2
    ) {
        return new ZsTypeVar<Extends, Default2>({
            ...this._def,
            defaultType
        })
    }

    actsLike = this._def.extends
}

export type ZsTypeVarsRecord<Names extends string = any> = {
    [K in Names]: ZsTypeVar
}
export type Reification<
    Names extends keyof Vars,
    Vars extends ZsTypeVarsRecord
> = {
    [K in Names]: Vars[K]["_def"]["extends"]
}

export type ZsTypeVarVariance = "" | "in" | "out" | "inout"

export interface ZsTypeVarDef<
    Extends extends ZodTypeAny = any,
    Default extends SchemaSubtypeOf<Extends> | null = any
> extends ZodTypeDef {
    readonly typeName: ZsTypeKind.ZsTypeVar
    readonly name: string
    readonly extends: Extends
    readonly defaultType: Default
    readonly const: boolean
    readonly variance: ZsTypeVarVariance
}
