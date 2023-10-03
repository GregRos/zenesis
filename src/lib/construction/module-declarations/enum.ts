import { TypeOf, ZodEnum, ZodNativeEnum, ZodTypeAny, ZodTypeDef } from "zod"
import { ZsMonoType } from "../mono-type"
import { ZsTypeKind } from "../kinds"
import { EnumLike } from "zod/lib/types"

export interface ZsEnumDef<
    Name extends string,
    Type extends ZodNativeEnum<EnumLike>
> extends ZodTypeDef {
    typeName: ZsTypeKind.ZsEnum
    name: Name
    definition: Type
}

export class ZsEnum<
    Name extends string = string,
    Enum extends ZodNativeEnum<EnumLike> = ZodNativeEnum<EnumLike>
> extends ZsMonoType<TypeOf<Enum>, ZsEnumDef<Name, Enum>> {
    readonly name = this._def.name
    readonly actsLike = this._def.definition
    readonly declaration = "enum"

    static create<Name extends string, Enum extends ZodNativeEnum<EnumLike>>(
        name: Name,
        definition: Enum
    ) {
        return new ZsEnum({
            typeName: ZsTypeKind.ZsEnum,
            name,
            definition
        })
    }
}
