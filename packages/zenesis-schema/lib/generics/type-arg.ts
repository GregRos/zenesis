import { TypeOf, ZodAny, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"
import { ZsTypeVar } from "./type-var"

export interface ZsTypeArgDef<Name extends string, Extends extends ZodTypeAny>
    extends ZodTypeDef {
    readonly typeName: ZsTypeKind.ZsTypeArg
    readonly declaration: ZsTypeVar<Name, Extends>
}
export class ZsTypeArg<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny
> extends ZsMonoType<TypeOf<Extends>, ZsTypeArgDef<Name, Extends>> {
    readonly declaration = this._def.declaration
    readonly actsLike = ZodAny.create()
    readonly name = this._def.declaration.name
    static create<Name extends string, Extends extends ZodTypeAny>(
        typeVar: ZsTypeVar<Name, Extends>
    ) {
        return new ZsTypeArg({
            typeName: ZsTypeKind.ZsTypeArg,
            declaration: typeVar
        })
    }
}
export type ZsTypeArgs = [ZsTypeArg, ...ZsTypeArg[]]
