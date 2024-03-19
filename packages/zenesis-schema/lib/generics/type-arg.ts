import { ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../kinds"

export interface ZsTypeArgDef<Name extends string> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsTypeArg
    name: Name
}

export class ZsTypeArg<Name extends string = string> extends ZsMonoType<
    any,
    ZsTypeArgDef<Name>
> {
    readonly actsLike = ZodAny.create()
    readonly name = this._def.name
    static create<Name extends string, Extends extends ZodTypeAny>(
        name: Name
    ): ZsTypeArg<Name> {
        return new ZsTypeArg({
            typeName: ZsTypeKind.ZsTypeArg,
            name
        })
    }
}

export type ZsTypeArgTuple = [ZsTypeArg, ...ZsTypeArg[]]
