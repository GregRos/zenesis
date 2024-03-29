import { EnumLike, ZodFirstPartyTypeKind, ZodNativeEnum, ZodTypeDef } from "zod"
import { ZsModuleDeclKind } from "../core/declaration-kind"
import { ZsMonoType } from "../core/mono-type"
import { ZsTypeKind } from "../core/type-kind"

export interface ZsEnumDef<Name extends string, Type extends EnumLike>
    extends ZodTypeDef {
    declName: ZsModuleDeclKind.ZsEnum
    name: Name
    typeName: ZsTypeKind.ZsEnum
    definition: Type
}

export class ZsEnum<
    Name extends string = string,
    Enum extends EnumLike = any
> extends ZsMonoType<Enum[keyof Enum], ZsEnumDef<Name, Enum>> {
    readonly name = this._def.name
    readonly actsLike = new ZodNativeEnum({
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        values: this._def.definition
    })
    readonly declaration = "enum"
    readonly refAs = this
    static create<Name extends string, Enum extends EnumLike>(
        name: Name,
        definition: Enum
    ) {
        return new ZsEnum({
            declName: ZsModuleDeclKind.ZsEnum,
            typeName: ZsTypeKind.ZsEnum,
            name,
            definition
        })
    }
}
